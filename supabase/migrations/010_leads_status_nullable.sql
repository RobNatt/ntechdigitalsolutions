-- ============================================
-- Make leads.status nullable
-- Run in Supabase SQL Editor
-- ============================================
-- Some environments have a NOT NULL `status` column with
-- a check constraint whose allowed values may not match
-- our initial insert. Public leads use `stage` for pipeline,
-- so we can safely allow `status` to be null.

ALTER TABLE public.leads ALTER COLUMN status DROP NOT NULL;

