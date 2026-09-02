-- GHL booking IDs for lead follow-up calendar booking.

ALTER TABLE public.os_settings
  ADD COLUMN IF NOT EXISTS integration_ghl_discovery_booking_id text,
  ADD COLUMN IF NOT EXISTS integration_ghl_proposal_booking_id text;

COMMENT ON COLUMN public.os_settings.integration_ghl_discovery_booking_id IS 'GHL booking widget ID for discovery calls (leads CRM Book a call).';
COMMENT ON COLUMN public.os_settings.integration_ghl_proposal_booking_id IS 'GHL booking widget ID for proposal meetings; falls back to discovery ID when unset.';
