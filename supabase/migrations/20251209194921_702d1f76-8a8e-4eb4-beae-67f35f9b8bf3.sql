-- TRACEFLOW Subscriptions table
CREATE TABLE IF NOT EXISTS public.traceflow_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'pending_payment',
  industry TEXT,
  company_size TEXT,
  website TEXT,
  use_cases JSONB DEFAULT '[]'::jsonb,
  invoice_id UUID,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TRACEFLOW Invoices table
CREATE TABLE IF NOT EXISTS public.traceflow_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  plan TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  billing_name TEXT,
  billing_email TEXT,
  billing_address TEXT,
  billing_city TEXT,
  billing_country TEXT,
  billing_gst TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TRACEFLOW User Features (RBAC)
CREATE TABLE IF NOT EXISTS public.traceflow_user_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  enabled_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, feature_id)
);

-- Enable RLS
ALTER TABLE public.traceflow_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_user_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.traceflow_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.traceflow_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.traceflow_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.traceflow_subscriptions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for invoices
CREATE POLICY "Users can view own invoices" ON public.traceflow_invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON public.traceflow_invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.traceflow_invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all invoices" ON public.traceflow_invoices
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user features
CREATE POLICY "Users can view own features" ON public.traceflow_user_features
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all features" ON public.traceflow_user_features
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));