# TRACEFLOW Database Schema

> **Last Updated:** 2025-12-10  
> **Version:** 1.0.0-beta  
> **Database:** PostgreSQL 15.x (Supabase)

---

## Schema Overview

| Category | Tables | Purpose |
|----------|--------|---------|
| Core | 5 | Sessions, events, recordings |
| Intelligence | 4 | AI analysis, UX issues, routing |
| Subscriptions | 3 | Billing, features, plans |
| Admin | 2 | User roles, audit logs |

---

## Core Tables

### `traceflow_sessions`

Primary session tracking table.

```sql
CREATE TABLE public.traceflow_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES traceflow_projects(id),
  visitor_id TEXT,
  
  -- Device & Browser Info
  user_agent TEXT,
  device_type TEXT, -- 'desktop' | 'mobile' | 'tablet'
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  
  -- Location
  ip_address TEXT,
  country_code TEXT,
  city TEXT,
  geolocation JSONB, -- { lat, lng }
  
  -- Session Metrics
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_ms INTEGER,
  page_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  
  -- Frustration Detection
  frustration_score INTEGER DEFAULT 0, -- 0-100
  rage_click_count INTEGER DEFAULT 0,
  dead_click_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  
  -- AI Analysis Status
  ai_analyzed BOOLEAN DEFAULT false,
  ai_summary TEXT,
  ai_root_cause TEXT,
  
  -- Metadata
  referrer TEXT,
  landing_page TEXT,
  pages_visited JSONB DEFAULT '[]',
  custom_properties JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_traceflow_sessions_session_id ON traceflow_sessions(session_id);
CREATE INDEX idx_traceflow_sessions_project_id ON traceflow_sessions(project_id);
CREATE INDEX idx_traceflow_sessions_visitor_id ON traceflow_sessions(visitor_id);
CREATE INDEX idx_traceflow_sessions_started_at ON traceflow_sessions(started_at DESC);
CREATE INDEX idx_traceflow_sessions_frustration ON traceflow_sessions(frustration_score DESC);
CREATE INDEX idx_traceflow_sessions_country ON traceflow_sessions(country_code);

-- RLS Policy
ALTER TABLE traceflow_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their project sessions"
  ON traceflow_sessions FOR SELECT
  USING (project_id IN (
    SELECT project_id FROM traceflow_project_members 
    WHERE user_id = auth.uid()
  ));
```

### `traceflow_events`

Individual event tracking (clicks, scrolls, errors, etc.).

```sql
CREATE TABLE public.traceflow_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES traceflow_sessions(session_id),
  
  -- Event Classification
  event_type TEXT NOT NULL, -- 'click' | 'scroll' | 'error' | 'pageview' | 'custom'
  event_name TEXT,
  
  -- Page Context
  page_url TEXT,
  page_title TEXT,
  
  -- Element Data (for clicks)
  element_tag TEXT,
  element_id TEXT,
  element_class TEXT,
  element_text TEXT,
  element_selector TEXT,
  
  -- Coordinates
  x_position INTEGER,
  y_position INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  scroll_depth INTEGER, -- percentage
  
  -- Error Data
  error_message TEXT,
  error_stack TEXT,
  
  -- Timing
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_on_page_ms INTEGER,
  
  -- Extended Data
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_traceflow_events_session ON traceflow_events(session_id);
CREATE INDEX idx_traceflow_events_type ON traceflow_events(event_type);
CREATE INDEX idx_traceflow_events_timestamp ON traceflow_events(timestamp DESC);
CREATE INDEX idx_traceflow_events_page ON traceflow_events(page_url);

-- Partitioning (for high-volume deployments)
-- Consider partitioning by created_at for tables > 100M rows
```

### `session_recordings`

Full session recording storage (rrweb events).

```sql
CREATE TABLE public.session_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  
  -- Recording Data
  events JSONB NOT NULL DEFAULT '[]', -- rrweb event array
  
  -- Metadata
  duration_ms INTEGER,
  event_count INTEGER,
  page_count INTEGER,
  pages_visited JSONB DEFAULT '[]',
  
  -- Device Info
  user_agent TEXT,
  device_fingerprint TEXT,
  visitor_id TEXT,
  
  -- Location
  ip_address TEXT,
  geolocation JSONB, -- { city, country, lat, lng }
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  
  -- Storage Optimization
  compressed BOOLEAN DEFAULT false,
  storage_size_bytes INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_session_recordings_session ON session_recordings(session_id);
CREATE INDEX idx_session_recordings_visitor ON session_recordings(visitor_id);
CREATE INDEX idx_session_recordings_start ON session_recordings(start_time DESC);

-- RLS Policy (allow anonymous recording, admin viewing)
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for recording"
  ON session_recordings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all recordings"
  ON session_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Intelligence Tables

### `traceflow_ux_issues`

AI-detected UX issues and recommendations.

```sql
CREATE TABLE public.traceflow_ux_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES traceflow_sessions(session_id),
  project_id UUID REFERENCES traceflow_projects(id),
  
  -- Issue Classification
  issue_type TEXT NOT NULL, -- 'rage_click' | 'dead_click' | 'error' | 'slow_load' | 'form_abandonment'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'critical'
  
  -- Location
  page_url TEXT,
  component TEXT,
  element_selector TEXT,
  
  -- Detection Details
  occurrence_count INTEGER DEFAULT 1,
  first_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- AI Analysis
  ai_description TEXT,
  ai_recommendation TEXT,
  ai_confidence DECIMAL(3,2), -- 0.00 to 1.00
  ai_code_suggestion TEXT,
  
  -- Impact Metrics
  affected_sessions INTEGER DEFAULT 0,
  affected_users INTEGER DEFAULT 0,
  estimated_revenue_impact DECIMAL(10,2),
  
  -- Status
  status TEXT DEFAULT 'open', -- 'open' | 'in_progress' | 'resolved' | 'ignored'
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ux_issues_project ON traceflow_ux_issues(project_id);
CREATE INDEX idx_ux_issues_type ON traceflow_ux_issues(issue_type);
CREATE INDEX idx_ux_issues_severity ON traceflow_ux_issues(severity);
CREATE INDEX idx_ux_issues_status ON traceflow_ux_issues(status);
```

### `traceflow_ai_queue`

AI analysis job queue.

```sql
CREATE TABLE public.traceflow_ai_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  
  -- Task Details
  task_type TEXT NOT NULL, -- 'session_summary' | 'root_cause' | 'code_fix' | 'journey_analysis'
  priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Processing Info
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Input/Output
  input_data JSONB,
  result JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ai_queue_status ON traceflow_ai_queue(status);
CREATE INDEX idx_ai_queue_priority ON traceflow_ai_queue(priority ASC, created_at ASC);
```

### `neurorouter_logs`

AI model usage and performance logging.

```sql
CREATE TABLE public.neurorouter_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request Info
  task_type TEXT NOT NULL,
  model_selected TEXT NOT NULL, -- 'gemini-2.5-flash' | 'gpt-5-mini' | etc.
  provider TEXT NOT NULL, -- 'google' | 'openai' | 'anthropic'
  
  -- Performance Metrics
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  
  -- Cost Tracking
  cost_estimate DECIMAL(10,6),
  
  -- Quality Metrics
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Metadata
  session_id TEXT,
  user_id UUID,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_neurorouter_logs_model ON neurorouter_logs(model_selected);
CREATE INDEX idx_neurorouter_logs_task ON neurorouter_logs(task_type);
CREATE INDEX idx_neurorouter_logs_created ON neurorouter_logs(created_at DESC);
```

---

## Subscription Tables

### `traceflow_subscriptions`

User subscription management.

```sql
CREATE TABLE public.traceflow_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Plan Details
  plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'starter' | 'pro' | 'enterprise'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'trial' | 'cancelled' | 'past_due'
  
  -- Role
  role TEXT DEFAULT 'member', -- 'owner' | 'admin' | 'member' | 'viewer'
  
  -- Billing
  billing_cycle TEXT DEFAULT 'monthly', -- 'monthly' | 'annual'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- Usage Limits
  sessions_limit INTEGER DEFAULT 1000,
  sessions_used INTEGER DEFAULT 0,
  recordings_limit INTEGER DEFAULT 100,
  recordings_used INTEGER DEFAULT 0,
  ai_credits_limit INTEGER DEFAULT 50,
  ai_credits_used INTEGER DEFAULT 0,
  
  -- Trial
  trial_ends_at TIMESTAMPTZ,
  
  -- Payment Provider
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscriptions_user ON traceflow_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON traceflow_subscriptions(status);
```

### `traceflow_user_features`

Feature flags per user.

```sql
CREATE TABLE public.traceflow_user_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  feature_id TEXT NOT NULL, -- 'session_replay' | 'heatmaps' | 'ai_analysis' | etc.
  enabled BOOLEAN DEFAULT true,
  
  -- Limits
  usage_limit INTEGER,
  current_usage INTEGER DEFAULT 0,
  
  -- Metadata
  enabled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, feature_id)
);
```

---

## Database Functions

### `update_traceflow_session_stats()`

Trigger function to update session statistics on new events.

```sql
CREATE OR REPLACE FUNCTION public.update_traceflow_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.traceflow_sessions
  SET 
    event_count = event_count + 1,
    rage_click_count = CASE 
      WHEN NEW.event_type = 'rage_click' THEN rage_click_count + 1 
      ELSE rage_click_count 
    END,
    dead_click_count = CASE 
      WHEN NEW.event_type = 'dead_click' THEN dead_click_count + 1 
      ELSE dead_click_count 
    END,
    error_count = CASE 
      WHEN NEW.event_type = 'error' THEN error_count + 1 
      ELSE error_count 
    END,
    updated_at = now()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger
CREATE TRIGGER on_traceflow_event_insert
  AFTER INSERT ON traceflow_events
  FOR EACH ROW
  EXECUTE FUNCTION update_traceflow_session_stats();
```

### `is_traceflow_admin()`

Check if user has admin access.

```sql
CREATE OR REPLACE FUNCTION public.is_traceflow_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.traceflow_subscriptions
    WHERE user_id = check_user_id AND role IN ('admin', 'owner')
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

---

## Database Triggers

| Trigger | Table | Event | Function |
|---------|-------|-------|----------|
| `on_traceflow_event_insert` | `traceflow_events` | AFTER INSERT | `update_traceflow_session_stats()` |
| `update_session_recording_timestamp` | `session_recordings` | BEFORE UPDATE | `update_updated_at_column()` |

---

## RLS Policies Summary

| Table | Policy | Access |
|-------|--------|--------|
| `traceflow_sessions` | Project members can view | SELECT |
| `session_recordings` | Anonymous insert, admin view | INSERT, SELECT |
| `traceflow_events` | Project members can view | SELECT |
| `traceflow_ux_issues` | Project members can manage | ALL |
| `traceflow_subscriptions` | Users can view own | SELECT |

---

## Migration Commands

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE traceflow_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE traceflow_events;
ALTER PUBLICATION supabase_realtime ADD TABLE traceflow_ux_issues;
```
