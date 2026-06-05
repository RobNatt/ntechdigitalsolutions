-- Calendly event URLs for outbound booking from the leads CRM.

ALTER TABLE public.os_settings
  ADD COLUMN IF NOT EXISTS integration_calendly_discovery_url text,
  ADD COLUMN IF NOT EXISTS integration_calendly_proposal_url text;

COMMENT ON COLUMN public.os_settings.integration_calendly_discovery_url IS 'Calendly event URL for discovery calls (leads CRM Book with Calendly).';
COMMENT ON COLUMN public.os_settings.integration_calendly_proposal_url IS 'Calendly event URL for proposal meetings; falls back to discovery URL when unset.';
