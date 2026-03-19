-- ============================================
-- Make user_id nullable on leads (for public form submissions)
-- Run in Supabase SQL Editor
-- ============================================
-- Public form submissions have no authenticated user.

ALTER TABLE public.leads ALTER COLUMN user_id DROP NOT NULL;
