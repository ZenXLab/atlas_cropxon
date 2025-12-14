-- TRACEFLOW Core Tables

-- 1. Capture Engine - Events Table
CREATE TABLE public.traceflow_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  tenant_id UUID REFERENCES public.client_tenants(id),
  event_type TEXT NOT NULL, -- 'click', 'scroll', 'rage_click', 'dead_click', 'error', 'network', 'dom_change'
  page_url TEXT,
  element_selector TEXT,
  element_text TEXT,
  x_position INTEGER,
  y_position INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT,
  os TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Session Intelligence - Sessions Table
CREATE TABLE public.traceflow_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  tenant_id UUID REFERENCES public.client_tenants(id),
  user_id UUID,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration_ms INTEGER,
  page_count INTEGER DEFAULT 1,
  event_count INTEGER DEFAULT 0,
  rage_click_count INTEGER DEFAULT 0,
  dead_click_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  frustration_score NUMERIC DEFAULT 0,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  user_agent TEXT,
  replay_data JSONB DEFAULT '[]',
  ai_summary TEXT,
  ai_root_cause TEXT,
  ai_suggested_fix TEXT,
  ai_analysis_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. UX Intelligence - Issues Table
CREATE TABLE public.traceflow_ux_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id),
  issue_type TEXT NOT NULL, -- 'rage_click', 'dead_click', 'slow_element', 'layout_shift', 'ui_breakage', 'text_overflow'
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  page_url TEXT NOT NULL,
  element_selector TEXT,
  element_screenshot_url TEXT,
  occurrence_count INTEGER DEFAULT 1,
  affected_sessions INTEGER DEFAULT 1,
  affected_users INTEGER DEFAULT 1,
  estimated_revenue_impact NUMERIC DEFAULT 0,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'ignored'
  ai_diagnosis TEXT,
  ai_suggested_fix TEXT,
  ai_code_hint TEXT,
  jira_ticket_id TEXT,
  github_issue_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Heatmap Data Table
CREATE TABLE public.traceflow_heatmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id),
  page_url TEXT NOT NULL,
  heatmap_type TEXT NOT NULL, -- 'click', 'scroll', 'attention', 'movement'
  data_points JSONB NOT NULL DEFAULT '[]',
  total_sessions INTEGER DEFAULT 0,
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,
  device_type TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Journey/Funnel Table
CREATE TABLE public.traceflow_funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  conversion_rate NUMERIC DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  drop_off_analysis JSONB DEFAULT '{}',
  ai_causality_analysis TEXT,
  ai_improvement_suggestions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. AI Analysis Queue Table
CREATE TABLE public.traceflow_ai_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id),
  task_type TEXT NOT NULL, -- 'session_analysis', 'ux_scan', 'journey_analysis', 'voice_analysis'
  priority INTEGER DEFAULT 5,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result JSONB,
  llm_used TEXT, -- 'openai', 'claude', 'gemini', 'deepseek'
  llm_model TEXT,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 7. Voice/Multi-Modal Feedback Table
CREATE TABLE public.traceflow_voice_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id),
  session_id TEXT,
  audio_url TEXT,
  transcript TEXT,
  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  sentiment_score NUMERIC,
  topics JSONB DEFAULT '[]',
  correlated_session_id TEXT,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. NeuroRouter Logs Table
CREATE TABLE public.traceflow_neurorouter_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL,
  task_complexity TEXT, -- 'simple', 'moderate', 'complex', 'vision'
  selected_llm TEXT NOT NULL,
  selected_model TEXT NOT NULL,
  routing_reason TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  latency_ms INTEGER,
  cost_estimate NUMERIC,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_traceflow_events_session ON public.traceflow_events(session_id);
CREATE INDEX idx_traceflow_events_type ON public.traceflow_events(event_type);
CREATE INDEX idx_traceflow_events_timestamp ON public.traceflow_events(timestamp DESC);
CREATE INDEX idx_traceflow_sessions_session_id ON public.traceflow_sessions(session_id);
CREATE INDEX idx_traceflow_sessions_frustration ON public.traceflow_sessions(frustration_score DESC);
CREATE INDEX idx_traceflow_ux_issues_severity ON public.traceflow_ux_issues(severity, status);
CREATE INDEX idx_traceflow_ux_issues_page ON public.traceflow_ux_issues(page_url);
CREATE INDEX idx_traceflow_ai_queue_status ON public.traceflow_ai_queue(status, priority DESC);

-- Enable RLS
ALTER TABLE public.traceflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_ux_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_heatmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_ai_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_voice_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_neurorouter_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public insert for capture, admin read for analysis
CREATE POLICY "Anyone can insert traceflow events" ON public.traceflow_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view traceflow events" ON public.traceflow_events FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete traceflow events" ON public.traceflow_events FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert traceflow sessions" ON public.traceflow_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update traceflow sessions" ON public.traceflow_sessions FOR UPDATE USING (true);
CREATE POLICY "Admins can view traceflow sessions" ON public.traceflow_sessions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete traceflow sessions" ON public.traceflow_sessions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage ux issues" ON public.traceflow_ux_issues FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert ux issues" ON public.traceflow_ux_issues FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage heatmaps" ON public.traceflow_heatmaps FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert heatmaps" ON public.traceflow_heatmaps FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage funnels" ON public.traceflow_funnels FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage ai queue" ON public.traceflow_ai_queue FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert ai queue" ON public.traceflow_ai_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update ai queue" ON public.traceflow_ai_queue FOR UPDATE USING (true);

CREATE POLICY "Admins can manage voice feedback" ON public.traceflow_voice_feedback FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert voice feedback" ON public.traceflow_voice_feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view neurorouter logs" ON public.traceflow_neurorouter_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert neurorouter logs" ON public.traceflow_neurorouter_logs FOR INSERT WITH CHECK (true);

-- Function to update session stats
CREATE OR REPLACE FUNCTION public.update_traceflow_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.traceflow_sessions
  SET 
    event_count = event_count + 1,
    rage_click_count = CASE WHEN NEW.event_type = 'rage_click' THEN rage_click_count + 1 ELSE rage_click_count END,
    dead_click_count = CASE WHEN NEW.event_type = 'dead_click' THEN dead_click_count + 1 ELSE dead_click_count END,
    error_count = CASE WHEN NEW.event_type = 'error' THEN error_count + 1 ELSE error_count END,
    updated_at = now()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update session stats
CREATE TRIGGER traceflow_session_stats_trigger
AFTER INSERT ON public.traceflow_events
FOR EACH ROW
EXECUTE FUNCTION public.update_traceflow_session_stats();