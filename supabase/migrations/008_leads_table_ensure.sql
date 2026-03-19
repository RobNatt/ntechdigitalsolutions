-- ============================================
-- Ensure leads table exists with full schema
-- Run in Supabase SQL Editor
-- ============================================
-- Guarantees public.leads exists with all required columns.
-- Idempotent: CREATE TABLE IF NOT EXISTS skips when table exists.
-- company_id is plain uuid (no FK) so this works without 006.

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid,
  source text NOT NULL DEFAULT 'unknown',
  lead_type text DEFAULT 'homeowner',
  name text,
  phone text,
  address text,
  email text,
  details jsonb NOT NULL DEFAULT '{}',
  stage text DEFAULT 'submitted',
  stage_updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_leads_source_created ON public.leads(source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct user access to leads" ON public.leads;
CREATE POLICY "No direct user access to leads" ON public.leads
  FOR ALL USING (false);
