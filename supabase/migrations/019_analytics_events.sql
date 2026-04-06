-- ============================================
-- First-party analytics (N-Tech + per-client tenants)
-- Ingest: POST /api/analytics/collect with write_key
-- Read: service role / dashboard API only
-- ============================================

CREATE TABLE IF NOT EXISTS public.analytics_site_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT '',
  write_key text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_site_keys_company
  ON public.analytics_site_keys (company_id);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key_id uuid NOT NULL REFERENCES public.analytics_site_keys (id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  path text NOT NULL DEFAULT '/',
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_type text NOT NULL DEFAULT 'pageview',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_company_created
  ON public.analytics_events (company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session
  ON public.analytics_events (session_id, created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_site_key_created
  ON public.analytics_events (site_key_id, created_at DESC);

ALTER TABLE public.analytics_site_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access analytics_site_keys" ON public.analytics_site_keys;
CREATE POLICY "No direct access analytics_site_keys" ON public.analytics_site_keys
  FOR ALL USING (false);

DROP POLICY IF EXISTS "No direct access analytics_events" ON public.analytics_events;
CREATE POLICY "No direct access analytics_events" ON public.analytics_events
  FOR ALL USING (false);

-- Aggregated summary for CEO dashboard (called with service role only)
CREATE OR REPLACE FUNCTION public.analytics_get_summary(
  p_company_id uuid,
  p_since timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v jsonb;
BEGIN
  SELECT jsonb_build_object(
    'totalPageviews',
      (SELECT COUNT(*)::int FROM analytics_events e WHERE e.company_id = p_company_id AND e.created_at >= p_since),
    'uniqueSessions',
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events e WHERE e.company_id = p_company_id AND e.created_at >= p_since),
    'uniqueVisitors',
      (SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_events e WHERE e.company_id = p_company_id AND e.created_at >= p_since),
    'sessionsWithMultiplePageviews',
      (SELECT COUNT(*)::int FROM (
        SELECT session_id FROM analytics_events e
        WHERE e.company_id = p_company_id AND e.created_at >= p_since
        GROUP BY session_id
        HAVING COUNT(*) >= 2
      ) s),
    'sessionsReachedContact',
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since
         AND (e.path ILIKE '/contact%' OR e.path ILIKE '%/contact%')),
    'topPaths',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('path', x.path, 'count', x.cnt) ORDER BY x.cnt DESC)
         FROM (
           SELECT e.path, COUNT(*)::int AS cnt
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
           GROUP BY e.path
           ORDER BY cnt DESC
           LIMIT 12
         ) x),
        '[]'::jsonb
      ),
    'topReferrers',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('referrer', x.referrer, 'count', x.cnt) ORDER BY x.cnt DESC)
         FROM (
           SELECT COALESCE(NULLIF(TRIM(e.referrer), ''), '(direct)') AS referrer, COUNT(*)::int AS cnt
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
           GROUP BY COALESCE(NULLIF(TRIM(e.referrer), ''), '(direct)')
           ORDER BY cnt DESC
           LIMIT 12
         ) x),
        '[]'::jsonb
      ),
    'topUtmSources',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('source', x.source, 'count', x.cnt) ORDER BY x.cnt DESC)
         FROM (
           SELECT COALESCE(NULLIF(TRIM(e.utm_source), ''), '(none)') AS source, COUNT(*)::int AS cnt
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
           GROUP BY COALESCE(NULLIF(TRIM(e.utm_source), ''), '(none)')
           ORDER BY cnt DESC
           LIMIT 10
         ) x),
        '[]'::jsonb
      ),
    'dailyPageviews',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('day', d::text, 'count', c) ORDER BY d)
         FROM (
           SELECT (date_trunc('day', e.created_at AT TIME ZONE 'UTC'))::date AS d, COUNT(*)::int AS c
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
           GROUP BY 1
           ORDER BY 1
         ) daily),
        '[]'::jsonb
      )
  ) INTO v;
  RETURN v;
END;
$$;

REVOKE ALL ON FUNCTION public.analytics_get_summary(uuid, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analytics_get_summary(uuid, timestamptz) TO service_role;

-- Seed one site key for N-Tech (deterministic key: rotate in production via dashboard SQL if desired)
INSERT INTO public.analytics_site_keys (company_id, label, write_key)
SELECT
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'N-Tech main site',
  'ntech_sk_' || md5('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' || 'ntech_analytics_v1')
WHERE EXISTS (SELECT 1 FROM public.companies WHERE id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
  AND NOT EXISTS (
    SELECT 1 FROM public.analytics_site_keys
    WHERE company_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  );
