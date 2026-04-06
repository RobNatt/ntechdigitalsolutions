-- Run in Supabase SQL Editor if you prefer not to use the dashboard "Clear all leads" button.
-- Keeps client rows; only removes CRM lead rows.

UPDATE public.clients
SET source_lead_id = NULL
WHERE source_lead_id IS NOT NULL;

DELETE FROM public.leads;
