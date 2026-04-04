-- Align leads with API payloads (submit + Excel import) that set display/legacy columns.
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone_number text;
