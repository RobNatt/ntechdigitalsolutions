-- ============================================
-- Default company for nTech (owner of main landing pages)
-- Run in Supabase SQL Editor
-- ============================================
-- Creates companies table if missing, inserts nTech as default.
-- Leads from /lead_roofing and /client_roofing use this company_id.

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert nTech as default company (id used by lead submit API)
INSERT INTO public.companies (id, name)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'nTech Digital Solutions')
ON CONFLICT (id) DO NOTHING;
