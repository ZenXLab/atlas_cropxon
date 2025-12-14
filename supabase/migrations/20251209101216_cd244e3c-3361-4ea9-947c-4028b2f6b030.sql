-- Create activity log table for sidebar access changes
CREATE TABLE IF NOT EXISTS public.sidebar_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  admin_user_id UUID,
  action_type TEXT NOT NULL DEFAULT 'update', -- update, copy, reset, bulk_enable, bulk_disable
  role_affected TEXT NOT NULL,
  module_id TEXT,
  previous_value BOOLEAN,
  new_value BOOLEAN,
  copy_from_role TEXT, -- for copy operations
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sidebar_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Tenant admins can view their logs"
  ON public.sidebar_access_logs
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.client_tenant_users 
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Tenant admins can insert logs"
  ON public.sidebar_access_logs
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.client_tenant_users 
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Index for performance
CREATE INDEX idx_sidebar_access_logs_tenant ON public.sidebar_access_logs(tenant_id);
CREATE INDEX idx_sidebar_access_logs_created ON public.sidebar_access_logs(created_at DESC);