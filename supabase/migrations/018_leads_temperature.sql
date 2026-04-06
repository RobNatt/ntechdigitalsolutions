-- CRM lead temperature (hot / warm / cold). Contact-form inquiries default to hot in app code.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_temperature text NOT NULL DEFAULT 'warm';

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_lead_temperature_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_temperature_check
  CHECK (lead_temperature IN ('hot', 'warm', 'cold'));
