# TRACEFLOW Deployment Guide

> **Last Updated:** 2025-12-10  
> **Version:** 1.0.0-beta

---

## Deployment Options

| Option | Best For | Complexity |
|--------|----------|------------|
| **Lovable Cloud** | Quick start, managed | Low |
| **AWS** | Enterprise, scale | Medium |
| **Azure** | Microsoft ecosystem | Medium |
| **GCP** | Google ecosystem | Medium |
| **On-Premises** | Data sovereignty | High |

---

## Option 1: Lovable Cloud (Default)

### Prerequisites
- Lovable account
- Project created in Lovable

### Steps

1. **Enable Lovable Cloud**
   - Project Settings → Cloud → Enable

2. **Configure Secrets**
   ```
   LOVABLE_API_KEY (auto-provisioned)
   OPENAI_API_KEY (optional)
   ANTHROPIC_API_KEY (optional)
   ```

3. **Deploy Edge Functions**
   - Functions deploy automatically on code push

4. **Access Dashboard**
   - Navigate to `/traceflow/dashboard`

---

## Option 2: AWS Deployment

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS REGION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    CloudFront CDN                        │   │
│   └───────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│   ┌───────────────────────────┼───────────────────────────┐     │
│   │                           │                           │     │
│   ▼                           ▼                           ▼     │
│ ┌─────────┐            ┌─────────────┐            ┌─────────┐   │
│ │   S3    │            │     ALB     │            │   S3    │   │
│ │ (Static)│            │(Load Balancer)│          │(Recordings)│ │
│ └─────────┘            └──────┬──────┘            └─────────┘   │
│                               │                                  │
│                ┌──────────────┼──────────────┐                  │
│                ▼              ▼              ▼                  │
│          ┌─────────┐   ┌─────────┐   ┌─────────┐               │
│          │   ECS   │   │   ECS   │   │  Lambda │               │
│          │  (API)  │   │ (Worker)│   │  (Edge) │               │
│          └────┬────┘   └────┬────┘   └─────────┘               │
│               │             │                                    │
│               └──────┬──────┘                                    │
│                      ▼                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                        VPC                               │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│   │  │     RDS     │  │ ElastiCache │  │   Secrets   │      │   │
│   │  │ (PostgreSQL)│  │   (Redis)   │  │   Manager   │      │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Terraform Configuration

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "traceflow-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# RDS PostgreSQL
resource "aws_db_instance" "traceflow" {
  identifier           = "traceflow-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.large"
  allocated_storage    = 100
  storage_encrypted    = true
  
  db_name  = "traceflow"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.traceflow.name

  backup_retention_period = 7
  multi_az               = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "traceflow" {
  cluster_id           = "traceflow-cache"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  security_group_ids = [aws_security_group.redis.id]
  subnet_group_name  = aws_elasticache_subnet_group.traceflow.name
}

# S3 Buckets
resource "aws_s3_bucket" "recordings" {
  bucket = "traceflow-recordings-${var.environment}"
}

resource "aws_s3_bucket" "static" {
  bucket = "traceflow-static-${var.environment}"
}
```

### Environment Variables

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name traceflow/production \
  --secret-string '{
    "SUPABASE_URL": "your-rds-endpoint",
    "SUPABASE_SERVICE_ROLE_KEY": "your-service-key",
    "LOVABLE_API_KEY": "your-lovable-key",
    "OPENAI_API_KEY": "your-openai-key",
    "REDIS_URL": "redis://your-elasticache-endpoint:6379"
  }'
```

---

## Option 3: Azure Deployment

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AZURE REGION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Azure Front Door                        │   │
│   └───────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│   ┌───────────────────────────┼───────────────────────────┐     │
│   │                           │                           │     │
│   ▼                           ▼                           ▼     │
│ ┌─────────┐            ┌─────────────┐            ┌─────────┐   │
│ │  Blob   │            │     AKS     │            │  Blob   │   │
│ │ (Static)│            │ (Kubernetes)│            │(Storage)│   │
│ └─────────┘            └──────┬──────┘            └─────────┘   │
│                               │                                  │
│                ┌──────────────┴──────────────┐                  │
│                ▼                             ▼                  │
│   ┌─────────────────────┐       ┌─────────────────────┐        │
│   │   Azure Database    │       │   Azure Cache       │        │
│   │   for PostgreSQL    │       │   for Redis         │        │
│   └─────────────────────┘       └─────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Azure CLI Setup

```bash
# Create resource group
az group create --name traceflow-rg --location eastus

# Create PostgreSQL
az postgres flexible-server create \
  --resource-group traceflow-rg \
  --name traceflow-db \
  --location eastus \
  --admin-user traceflow \
  --admin-password "$DB_PASSWORD" \
  --sku-name Standard_D4s_v3 \
  --tier GeneralPurpose \
  --version 15

# Create Redis
az redis create \
  --resource-group traceflow-rg \
  --name traceflow-cache \
  --location eastus \
  --sku Premium \
  --vm-size P1

# Create AKS cluster
az aks create \
  --resource-group traceflow-rg \
  --name traceflow-aks \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-managed-identity
```

---

## Option 4: On-Premises Deployment

### Prerequisites

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 8 cores | 16+ cores |
| RAM | 32 GB | 64+ GB |
| Storage | 500 GB SSD | 1+ TB NVMe |
| Network | 1 Gbps | 10 Gbps |

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: traceflow
      POSTGRES_USER: traceflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U traceflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://traceflow:${DB_PASSWORD}@postgres:5432/traceflow
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
      LOVABLE_API_KEY: ${LOVABLE_API_KEY}
    depends_on:
      - postgres
      - redis
      - minio
    ports:
      - "3000:3000"

  worker:
    build: ./worker
    environment:
      DATABASE_URL: postgres://traceflow:${DB_PASSWORD}@postgres:5432/traceflow
      REDIS_URL: redis://redis:6379
      LOVABLE_API_KEY: ${LOVABLE_API_KEY}
    depends_on:
      - postgres
      - redis

  web:
    build: ./web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: traceflow-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: traceflow-api
  template:
    metadata:
      labels:
        app: traceflow-api
    spec:
      containers:
      - name: api
        image: traceflow/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: traceflow-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: traceflow-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: traceflow-api
spec:
  selector:
    app: traceflow-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_URL` | Redis connection string | No | - |
| `S3_ENDPOINT` | S3-compatible storage endpoint | No | - |
| `S3_BUCKET` | Storage bucket name | No | `traceflow-recordings` |
| `LOVABLE_API_KEY` | Lovable AI Gateway key | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key (optional) | No | - |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) | No | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `ENCRYPTION_KEY` | Data encryption key | Yes | - |

---

## Migration from Lovable Cloud

To migrate from Lovable Cloud to self-hosted:

1. **Export Database**
   ```bash
   # Use Supabase CLI to export
   supabase db dump --project-ref wnentybljoyjhizsdhrt > backup.sql
   ```

2. **Export Storage**
   ```bash
   # Download recordings from Supabase Storage
   supabase storage download --bucket recordings --local ./recordings
   ```

3. **Import to New Environment**
   ```bash
   # Import database
   psql $NEW_DATABASE_URL < backup.sql
   
   # Upload to new storage
   aws s3 sync ./recordings s3://your-bucket/recordings
   ```

4. **Update Environment Variables**
   - Point to new database and storage endpoints

5. **Verify**
   - Test all API endpoints
   - Verify session playback
   - Check AI analysis functions
