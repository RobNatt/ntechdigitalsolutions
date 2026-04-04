-- ============================================
-- CRM calendar: event types, links, reminders
-- ============================================

ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'other';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS lead_id uuid;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS client_id uuid;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS remind_at timestamptz;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS notification_sent_at timestamptz;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE public.calendar_events SET event_type = 'other' WHERE event_type IS NULL;

ALTER TABLE public.calendar_events DROP CONSTRAINT IF EXISTS calendar_events_event_type_check;
ALTER TABLE public.calendar_events ADD CONSTRAINT calendar_events_event_type_check
  CHECK (event_type IN ('lead_call', 'client_onboarding', 'client_follow_up', 'other'));

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON public.calendar_events(user_id, date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_remind_at ON public.calendar_events(remind_at)
  WHERE remind_at IS NOT NULL;
