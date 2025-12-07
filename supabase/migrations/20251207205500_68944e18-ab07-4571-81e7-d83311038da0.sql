-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- A/B Testing Experiments Table
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'archived')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT DEFAULT 'all',
  traffic_allocation NUMERIC DEFAULT 100,
  primary_metric TEXT NOT NULL,
  secondary_metrics JSONB DEFAULT '[]'::jsonb,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- A/B Test Variants Table
CREATE TABLE IF NOT EXISTS public.ab_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_control BOOLEAN DEFAULT false,
  traffic_weight NUMERIC DEFAULT 50,
  variant_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- A/B Test Results Table
CREATE TABLE IF NOT EXISTS public.ab_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  sample_size INTEGER DEFAULT 0,
  conversion_rate NUMERIC,
  confidence_level NUMERIC,
  is_significant BOOLEAN DEFAULT false,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- A/B Test User Assignments Table
CREATE TABLE IF NOT EXISTS public.ab_user_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value NUMERIC
);

-- AI Predictions Cache Table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('mrr_forecast', 'churn_risk', 'conversion_improvement')),
  input_data JSONB NOT NULL,
  prediction_result JSONB NOT NULL,
  confidence_score NUMERIC,
  model_version TEXT DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ab_experiments
CREATE POLICY "Admins can manage experiments" ON public.ab_experiments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ab_variants
CREATE POLICY "Admins can manage variants" ON public.ab_variants FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ab_results
CREATE POLICY "Admins can manage results" ON public.ab_results FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ab_user_assignments
CREATE POLICY "Admins can manage assignments" ON public.ab_user_assignments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert assignments" ON public.ab_user_assignments FOR INSERT WITH CHECK (true);

-- RLS Policies for ai_predictions
CREATE POLICY "Admins can view predictions" ON public.ai_predictions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_experiments_status ON public.ab_experiments(status);
CREATE INDEX IF NOT EXISTS idx_ab_variants_experiment ON public.ab_variants(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_results_experiment ON public.ab_results(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_user_assignments_experiment ON public.ab_user_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_user_assignments_user ON public.ab_user_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_type ON public.ai_predictions(prediction_type);

-- Trigger for updated_at
CREATE TRIGGER update_ab_experiments_updated_at
  BEFORE UPDATE ON public.ab_experiments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();