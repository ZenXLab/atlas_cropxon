# TRACEFLOW Technology Stack

> **Last Updated:** 2025-12-10  
> **Version:** 1.0.0-beta

## Overview

TRACEFLOW is built on a modern, enterprise-grade technology stack designed for scalability, reliability, and real-time performance.

---

## Frontend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.x | UI component library |
| **TypeScript** | 5.x | Type-safe development |
| **Vite** | 5.x | Build tool and dev server |
| **React Router** | 6.x | Client-side routing |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible component primitives |
| **shadcn/ui** | Latest | Pre-built component library |
| **Framer Motion** | 11.x | Animation library |
| **Lucide React** | Latest | Icon library |

### State & Data Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query** | 5.x | Server state management |
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 3.x | Schema validation |

### Session Recording & Analytics
| Technology | Version | Purpose |
|------------|---------|---------|
| **rrweb** | 2.0.0-alpha | DOM recording & replay |
| **rrweb-player** | 1.0.0-alpha | Session replay player |

### Drag & Drop
| Technology | Version | Purpose |
|------------|---------|---------|
| **@dnd-kit/core** | 6.x | Drag and drop primitives |
| **@dnd-kit/sortable** | 10.x | Sortable lists |

---

## Backend Stack

### Database & Auth
| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | Latest | Backend-as-a-Service |
| **PostgreSQL** | 15.x | Primary database |
| **Supabase Auth** | Latest | Authentication & authorization |
| **Supabase Realtime** | Latest | WebSocket subscriptions |
| **Supabase Storage** | Latest | File/blob storage |

### Edge Functions
| Technology | Version | Purpose |
|------------|---------|---------|
| **Deno** | Latest | Edge function runtime |
| **Supabase Edge Functions** | Latest | Serverless functions |

### Background Processing (Planned)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Upstash Redis** | Latest | Distributed cache & queues |
| **BullMQ** | Latest | Job queue management |
| **Temporal** | Latest | Workflow orchestration |

---

## AI & Machine Learning Stack

### Multi-LLM NeuroRouter
| Provider | Models | Use Cases |
|----------|--------|-----------|
| **Lovable AI Gateway** | gemini-2.5-flash, gemini-2.5-pro, gpt-5, gpt-5-mini | Default AI provider (no API key required) |
| **Google Gemini** | gemini-2.5-flash, gemini-2.5-pro | Vision/UI analysis, multimodal tasks |
| **OpenAI** | gpt-5, gpt-5-mini, gpt-5-nano | General reasoning, code analysis |
| **Anthropic Claude** | claude-4 | Complex reasoning, code review |
| **DeepSeek** | deepseek-v3 | Cost-effective reasoning |

### AI Gateway Configuration
```typescript
// Primary: Lovable AI Gateway (Pre-configured)
const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Model Selection by Task Type
const MODEL_ROUTING = {
  session_summary: "google/gemini-2.5-flash",      // Fast, cost-effective
  root_cause_analysis: "google/gemini-2.5-pro",   // Deep reasoning
  ui_visual_analysis: "google/gemini-2.5-pro",    // Vision capabilities
  code_fix_suggestion: "openai/gpt-5-mini",       // Code expertise
  journey_analysis: "google/gemini-2.5-flash",    // Balanced performance
};
```

---

## Real-Time Infrastructure

### WebSocket & Streaming
| Technology | Purpose |
|------------|---------|
| **Supabase Realtime** | PostgreSQL change notifications |
| **Server-Sent Events (SSE)** | AI streaming responses |
| **WebSocket** | Bi-directional real-time communication |

### Event Processing Pipeline
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│   Edge      │───▶│   Queue     │───▶│   Worker    │
│   SDK       │    │   Function  │    │   (Redis)   │    │   Process   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │                                     │
                          ▼                                     ▼
                   ┌─────────────┐                       ┌─────────────┐
                   │  PostgreSQL │                       │  AI Models  │
                   │  (Storage)  │                       │  (Analysis) │
                   └─────────────┘                       └─────────────┘
```

---

## SDK Architecture

### Web SDK (JavaScript/TypeScript)
```typescript
// Installation
npm install @traceflow/web-sdk

// Usage
import { TraceFlow } from '@traceflow/web-sdk';

TraceFlow.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  captureOptions: {
    clicks: true,
    scrolls: true,
    forms: true,
    errors: true,
    network: true,
    sessionRecording: true,
  },
  privacy: {
    maskInputs: true,
    maskEmails: true,
    excludeSelectors: ['.sensitive-data'],
  },
});
```

### Mobile SDK (React Native / Flutter)
```typescript
// React Native
import { TraceFlowRN } from '@traceflow/react-native-sdk';

// Flutter
import 'package:traceflow_flutter/traceflow.dart';
```

### Backend SDK (Node.js / Python)
```typescript
// Node.js
import { TraceFlowServer } from '@traceflow/node-sdk';

// Python
from traceflow import TraceFlowClient
```

---

## Observability Stack (Planned)

| Technology | Purpose |
|------------|---------|
| **OpenTelemetry** | Distributed tracing |
| **Sentry** | Error monitoring |
| **Grafana** | Metrics visualization |
| **Prometheus** | Metrics collection |
| **Jaeger** | Trace visualization |

---

## Security & Compliance

| Feature | Technology |
|---------|------------|
| **Encryption at Rest** | AES-256 |
| **Encryption in Transit** | TLS 1.3 |
| **Authentication** | JWT, OAuth 2.0, SAML |
| **Row-Level Security** | PostgreSQL RLS |
| **Data Masking** | Client-side + Server-side |

---

## Deployment Options

### Cloud Providers
| Provider | Services Used |
|----------|---------------|
| **Lovable Cloud** | Default hosting (Supabase-powered) |
| **AWS** | ECS, RDS, S3, CloudFront, Lambda |
| **Azure** | AKS, Azure Database, Blob Storage |
| **GCP** | GKE, Cloud SQL, Cloud Storage |

### On-Premises
| Component | Technology |
|-----------|------------|
| **Container Runtime** | Docker, Kubernetes |
| **Database** | PostgreSQL 15+ |
| **Cache** | Redis 7+ |
| **Object Storage** | MinIO (S3-compatible) |
| **Load Balancer** | NGINX, HAProxy |

---

## Version Compatibility Matrix

| Component | Minimum Version | Recommended |
|-----------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| PostgreSQL | 14.x | 15.x |
| Redis | 6.x | 7.x |
| Deno | 1.38+ | Latest |
| Docker | 20.x | 24.x |
| Kubernetes | 1.26+ | 1.29+ |

---

## Future Technology Additions

### Q1 2026
- [ ] Apache Kafka for high-volume event streaming
- [ ] ClickHouse for analytics data warehouse
- [ ] Vector database (Pinecone/Weaviate) for AI embeddings

### Q2 2026
- [ ] GraphQL API layer
- [ ] gRPC for internal service communication
- [ ] Custom ML model training pipeline

### Q3 2026
- [ ] Edge computing nodes
- [ ] Multi-region data replication
- [ ] Real-time ML inference at edge
