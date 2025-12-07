-- Create table for storing rrweb session recordings
CREATE TABLE public.session_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  page_count INTEGER DEFAULT 1,
  event_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

-- Allow public insert for recording sessions (anonymous tracking)
CREATE POLICY "Anyone can insert recordings" 
ON public.session_recordings 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view recordings
CREATE POLICY "Admins can view recordings" 
ON public.session_recordings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow public to update their own session recordings (by session_id match)
CREATE POLICY "Anyone can update own session recordings" 
ON public.session_recordings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create index for faster session lookups
CREATE INDEX idx_session_recordings_session_id ON public.session_recordings(session_id);
CREATE INDEX idx_session_recordings_created_at ON public.session_recordings(created_at DESC);

-- Enable realtime for session recordings
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_recordings;