-- ============================================
-- Gmail OAuth tokens for dashboard email
-- Run in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.gmail_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz NOT NULL,
  gmail_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

-- Users can only access their own connection
DROP POLICY IF EXISTS "Users can manage own gmail connection" ON public.gmail_connections;
CREATE POLICY "Users can manage own gmail connection" ON public.gmail_connections
  FOR ALL USING (auth.uid() = user_id);

-- Service role can insert/update (OAuth callback runs server-side)
-- RLS allows user access; API routes use service role for token storage
