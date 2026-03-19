-- ============================================
-- Make company_id nullable on leads (fallback for form submissions)
-- Run in Supabase SQL Editor
-- ============================================
-- Allows leads to be saved when companies table/row doesn't exist yet.
-- After running 006_default_company.sql, leads will include company_id.

ALTER TABLE public.leads ALTER COLUMN company_id DROP NOT NULL;
