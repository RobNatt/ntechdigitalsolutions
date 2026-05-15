-- Operating System dashboard: core tables + RLS (coexists with legacy CRM tables).
-- App "users" for roles: extend `public.profiles` with `os_role` (admin | client) and `os_client_id`.

-- ---------------------------------------------------------------------------
-- Helper: internal team vs portal client (only os_role = 'client' is restricted)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_os_internal()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      /* Backward-compatible during migration bootstrap:
         os_role may not exist yet in some environments. */
      SELECT (
        COALESCE(
          NULLIF(to_jsonb(p)->>'os_role', ''),
          NULLIF(to_jsonb(p)->>'role', '')
        ) IS DISTINCT FROM 'client'
      )
      FROM public.profiles p
      WHERE p.id = auth.uid()
    ),
    false
  );
$$;

COMMENT ON FUNCTION public.is_os_internal() IS 'True for admin/internal users; false for portal clients (os_role = client).';

-- ---------------------------------------------------------------------------
-- OS clients (directory — not legacy public.clients)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_clients_business_name ON public.os_clients (business_name);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS os_role text,
  ADD COLUMN IF NOT EXISTS os_client_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_os_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_os_role_check
      CHECK (os_role IS NULL OR os_role IN ('admin', 'client'));
  END IF;
END $$;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_os_client_id_fkey;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_os_client_id_fkey
  FOREIGN KEY (os_client_id) REFERENCES public.os_clients (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Singleton settings (one row; app uses first row)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  os_name text NOT NULL DEFAULT 'Operating System',
  brand_color text NOT NULL DEFAULT '#2563eb',
  currency text NOT NULL DEFAULT 'AUD',
  timezone text NOT NULL DEFAULT 'Australia/Sydney',
  enable_content_engine boolean NOT NULL DEFAULT true,
  enable_analytics boolean NOT NULL DEFAULT true,
  enable_sops boolean NOT NULL DEFAULT true,
  enum_defaults jsonb NOT NULL DEFAULT '{
    "lead_stages": ["New", "Contacted", "Booked", "Showed", "Qualified"],
    "project_stages": ["Onboarding", "Development", "In Review", "Live"],
    "lead_temperatures": ["Cold", "Warm", "Hot"],
    "event_types": ["Call", "Meeting", "Follow-up", "Content"],
    "event_status": ["Confirmed", "Completed", "Missed"],
    "payment_methods": ["Bank Transfer", "Card", "Cash", "Other"],
    "sales_outcomes": ["Closed", "No Show", "Showed No Close", "Rescheduled"]
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.os_settings (id, os_name)
VALUES ('00000000-0000-4000-8000-000000000001', 'Operating System')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.touch_os_settings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_settings_updated ON public.os_settings;
CREATE TRIGGER trg_os_settings_updated
  BEFORE UPDATE ON public.os_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_os_settings_updated_at();

-- ---------------------------------------------------------------------------
-- OS leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_name text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  email text,
  phone text,
  source text,
  status text NOT NULL DEFAULT 'New',
  temperature text NOT NULL DEFAULT 'Cold',
  tags text[] NOT NULL DEFAULT '{}',
  assigned_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  linked_client_id uuid REFERENCES public.os_clients (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_leads_assigned ON public.os_leads (assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_os_leads_linked_client ON public.os_leads (linked_client_id);

-- ---------------------------------------------------------------------------
-- OS projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL DEFAULT '',
  client_id uuid NOT NULL REFERENCES public.os_clients (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Onboarding',
  recurring boolean NOT NULL DEFAULT false,
  start_date date,
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_projects_client ON public.os_projects (client_id);

-- ---------------------------------------------------------------------------
-- OS payments (revenue)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.os_clients (id) ON DELETE CASCADE,
  amount numeric(14, 2) NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'Other',
  date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_payments_client ON public.os_payments (client_id);

-- ---------------------------------------------------------------------------
-- OS events (calendar)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  date_start timestamptz NOT NULL,
  date_end timestamptz NOT NULL,
  event_type text NOT NULL DEFAULT 'Meeting',
  status text NOT NULL DEFAULT 'Confirmed',
  related_lead_id uuid REFERENCES public.os_leads (id) ON DELETE SET NULL,
  related_client_id uuid REFERENCES public.os_clients (id) ON DELETE SET NULL,
  meeting_link text,
  created_by_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_events_start ON public.os_events (date_start);
CREATE INDEX IF NOT EXISTS idx_os_events_client ON public.os_events (related_client_id);

-- ---------------------------------------------------------------------------
-- OS content posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_content_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text,
  scheduled_date date,
  status text NOT NULL DEFAULT 'Draft',
  related_client_id uuid REFERENCES public.os_clients (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- OS ideas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text,
  title text NOT NULL DEFAULT '',
  description text,
  priority text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- OS sales calls
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_sales_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  closer text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  revenue_amount numeric(14, 2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- OS SOPs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_sops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  link_url text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- OS activity log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.os_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.os_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_sales_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_activity_log ENABLE ROW LEVEL SECURITY;

-- os_settings: read any authenticated; write internal only
DROP POLICY IF EXISTS "os_settings_select_auth" ON public.os_settings;
CREATE POLICY "os_settings_select_auth" ON public.os_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "os_settings_update_internal" ON public.os_settings;
CREATE POLICY "os_settings_update_internal" ON public.os_settings
  FOR UPDATE TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

-- os_clients
DROP POLICY IF EXISTS "os_clients_select" ON public.os_clients;
CREATE POLICY "os_clients_select" ON public.os_clients FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
);

DROP POLICY IF EXISTS "os_clients_insert" ON public.os_clients;
CREATE POLICY "os_clients_insert" ON public.os_clients FOR INSERT TO authenticated WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_clients_update" ON public.os_clients;
CREATE POLICY "os_clients_update" ON public.os_clients FOR UPDATE TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_clients_delete" ON public.os_clients;
CREATE POLICY "os_clients_delete" ON public.os_clients FOR DELETE TO authenticated USING (public.is_os_internal());

-- os_leads
DROP POLICY IF EXISTS "os_leads_select" ON public.os_leads;
CREATE POLICY "os_leads_select" ON public.os_leads FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR assigned_user_id = auth.uid()
  OR linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
);

DROP POLICY IF EXISTS "os_leads_insert" ON public.os_leads;
CREATE POLICY "os_leads_insert" ON public.os_leads FOR INSERT TO authenticated WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_leads_update" ON public.os_leads;
CREATE POLICY "os_leads_update" ON public.os_leads FOR UPDATE TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_leads_delete" ON public.os_leads;
CREATE POLICY "os_leads_delete" ON public.os_leads FOR DELETE TO authenticated USING (public.is_os_internal());

-- os_projects
DROP POLICY IF EXISTS "os_projects_select" ON public.os_projects;
CREATE POLICY "os_projects_select" ON public.os_projects FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
);

DROP POLICY IF EXISTS "os_projects_write" ON public.os_projects;
CREATE POLICY "os_projects_write" ON public.os_projects
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

-- os_payments
DROP POLICY IF EXISTS "os_payments_select" ON public.os_payments;
CREATE POLICY "os_payments_select" ON public.os_payments FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
);

DROP POLICY IF EXISTS "os_payments_write" ON public.os_payments;
CREATE POLICY "os_payments_write" ON public.os_payments
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_payments_delete" ON public.os_payments;

-- os_events
DROP POLICY IF EXISTS "os_events_select" ON public.os_events;
CREATE POLICY "os_events_select" ON public.os_events FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  OR related_lead_id IN (
    SELECT l.id FROM public.os_leads l
    WHERE l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
       OR l.assigned_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "os_events_write" ON public.os_events;
CREATE POLICY "os_events_write" ON public.os_events
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_events_delete" ON public.os_events;

-- os_content_posts
DROP POLICY IF EXISTS "os_content_posts_select" ON public.os_content_posts;
CREATE POLICY "os_content_posts_select" ON public.os_content_posts FOR SELECT TO authenticated USING (
  public.is_os_internal()
  OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
);

DROP POLICY IF EXISTS "os_content_posts_write" ON public.os_content_posts;
CREATE POLICY "os_content_posts_write" ON public.os_content_posts
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_content_posts_delete" ON public.os_content_posts;

-- os_ideas: internal only
DROP POLICY IF EXISTS "os_ideas_select" ON public.os_ideas;
CREATE POLICY "os_ideas_select" ON public.os_ideas FOR SELECT TO authenticated USING (public.is_os_internal());

DROP POLICY IF EXISTS "os_ideas_write" ON public.os_ideas;
CREATE POLICY "os_ideas_write" ON public.os_ideas FOR ALL TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_ideas_delete" ON public.os_ideas;
CREATE POLICY "os_ideas_delete" ON public.os_ideas FOR DELETE TO authenticated USING (public.is_os_internal());

-- os_sales_calls: internal only
DROP POLICY IF EXISTS "os_sales_calls_select" ON public.os_sales_calls;
CREATE POLICY "os_sales_calls_select" ON public.os_sales_calls FOR SELECT TO authenticated USING (public.is_os_internal());

DROP POLICY IF EXISTS "os_sales_calls_write" ON public.os_sales_calls;
CREATE POLICY "os_sales_calls_write" ON public.os_sales_calls FOR ALL TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_sales_calls_delete" ON public.os_sales_calls;
CREATE POLICY "os_sales_calls_delete" ON public.os_sales_calls FOR DELETE TO authenticated USING (public.is_os_internal());

-- os_sops: read all authenticated when visible in app; write internal
DROP POLICY IF EXISTS "os_sops_select" ON public.os_sops;
CREATE POLICY "os_sops_select" ON public.os_sops FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "os_sops_write" ON public.os_sops;
CREATE POLICY "os_sops_write" ON public.os_sops FOR INSERT TO authenticated WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_sops_update" ON public.os_sops;
CREATE POLICY "os_sops_update" ON public.os_sops FOR UPDATE TO authenticated USING (public.is_os_internal()) WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_sops_delete" ON public.os_sops;
CREATE POLICY "os_sops_delete" ON public.os_sops FOR DELETE TO authenticated USING (public.is_os_internal());

-- os_activity_log: internal only
DROP POLICY IF EXISTS "os_activity_log_select" ON public.os_activity_log;
CREATE POLICY "os_activity_log_select" ON public.os_activity_log FOR SELECT TO authenticated USING (public.is_os_internal());

DROP POLICY IF EXISTS "os_activity_log_insert" ON public.os_activity_log;
CREATE POLICY "os_activity_log_insert" ON public.os_activity_log FOR INSERT TO authenticated WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_activity_log_delete" ON public.os_activity_log;
CREATE POLICY "os_activity_log_delete" ON public.os_activity_log FOR DELETE TO authenticated USING (public.is_os_internal());

GRANT SELECT, UPDATE ON public.os_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_content_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_ideas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_sales_calls TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_sops TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.os_activity_log TO authenticated;
