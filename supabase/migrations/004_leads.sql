-- ============================================
-- Leads table for landing page form submissions
-- Run in Supabase SQL Editor
-- ============================================
-- Adds missing columns to existing leads table (inspections depends on it)

-- Add source column if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'unknown';

-- Add lead_type if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_type text DEFAULT 'homeowner';

-- Add details (jsonb) if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}';

-- Add email if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;

-- Add created_at if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Add updated_at if missing
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_leads_source_created ON public.leads(source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct user access to leads" ON public.leads;
CREATE POLICY "No direct user access to leads" ON public.leads
  FOR ALL USING (false);
