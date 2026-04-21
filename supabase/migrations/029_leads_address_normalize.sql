-- Normalize leads.address so NOT NULL inserts never fail (empty string / NULL → placeholder).
-- Run against the linked Supabase project (or merge via `supabase db push`).

UPDATE public.leads
SET address = 'N/A'
WHERE address IS NULL OR btrim(address) = '';

ALTER TABLE public.leads
  ALTER COLUMN address SET DEFAULT 'N/A';

CREATE OR REPLACE FUNCTION public.leads_normalize_address()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.address IS NULL OR btrim(NEW.address) = '' THEN
    NEW.address := 'N/A';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_normalize_address_before_write ON public.leads;
CREATE TRIGGER leads_normalize_address_before_write
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.leads_normalize_address();
