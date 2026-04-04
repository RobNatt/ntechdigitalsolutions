-- ============================================
-- Recurring calendar events + reminder offset
-- ============================================

ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS recurrence text DEFAULT 'none';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS recurrence_until date;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS reminder_minutes_before int;

UPDATE public.calendar_events SET recurrence = 'none' WHERE recurrence IS NULL;

ALTER TABLE public.calendar_events DROP CONSTRAINT IF EXISTS calendar_events_recurrence_check;
ALTER TABLE public.calendar_events ADD CONSTRAINT calendar_events_recurrence_check
  CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly', 'yearly'));
