-- ============================================
-- Make company_id nullable on leads (for form submissions)
-- Run in Supabase SQL Editor
-- ============================================

ALTER TABLE public.leads ALTER COLUMN company_id DROP NOT NULL;
