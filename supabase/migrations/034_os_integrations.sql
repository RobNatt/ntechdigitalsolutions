-- Optional inbound/outbound integration fields on settings + optional Google Calendar event id on events.

ALTER TABLE public.os_settings
  ADD COLUMN IF NOT EXISTS integration_sheets_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS integration_calendly_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS integration_google_calendar_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS integration_webhook_secret text,
  ADD COLUMN IF NOT EXISTS integration_sheets_column_map jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS integration_calendly_booked_stage text NOT NULL DEFAULT 'Booked',
  ADD COLUMN IF NOT EXISTS integration_google_calendar_id text,
  ADD COLUMN IF NOT EXISTS integration_google_oauth_connected boolean NOT NULL DEFAULT false;

ALTER TABLE public.os_events
  ADD COLUMN IF NOT EXISTS google_calendar_event_id text;

COMMENT ON COLUMN public.os_settings.integration_webhook_secret IS 'Shared secret for X-Webhook-Token on /api/webhooks/* (optional integrations).';
COMMENT ON COLUMN public.os_settings.integration_sheets_column_map IS 'Maps lead field keys to Google Sheet column header names.';
