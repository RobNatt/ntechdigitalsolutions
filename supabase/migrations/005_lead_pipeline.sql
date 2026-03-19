-- ============================================
-- Lead pipeline stages for CRM tracking
-- Run in Supabase SQL Editor
-- ============================================

-- Ensure core columns exist (for tables created before 004)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS address text;

-- Lead pipeline stage: submitted | contacted | appointment_set | qualified | closed_won | closed_lost
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS stage text DEFAULT 'submitted';
UPDATE public.leads SET stage = 'submitted' WHERE stage IS NULL;
ALTER TABLE public.leads ALTER COLUMN stage SET DEFAULT 'submitted';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS stage_updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);
