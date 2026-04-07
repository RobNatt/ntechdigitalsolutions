-- Custom / non-pageview event breakdown for CEO dashboard (excludes pageview + inquiry_submit already shown elsewhere)

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
      (SELECT COUNT(*)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since
         AND e.event_type = 'pageview'),
    'inquirySubmissions',
      (SELECT COUNT(*)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since
         AND e.event_type = 'inquiry_submit'),
    'uniqueSessions',
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since),
    'uniqueVisitors',
      (SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since),
    'sessionsWithMultiplePageviews',
      (SELECT COUNT(*)::int FROM (
        SELECT session_id FROM analytics_events e
        WHERE e.company_id = p_company_id AND e.created_at >= p_since
          AND e.event_type = 'pageview'
        GROUP BY session_id
        HAVING COUNT(*) >= 2
      ) s),
    'sessionsReachedContact',
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id AND e.created_at >= p_since
         AND (
           e.event_type = 'inquiry_submit'
           OR e.path ILIKE '/contact%' OR e.path ILIKE '%/contact%'
         )),
    'customEventCounts',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('eventType', x.et, 'count', x.cnt) ORDER BY x.cnt DESC)
         FROM (
           SELECT e.event_type AS et, COUNT(*)::int AS cnt
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
             AND e.event_type NOT IN ('pageview', 'inquiry_submit')
           GROUP BY e.event_type
           ORDER BY cnt DESC
           LIMIT 40
         ) x),
        '[]'::jsonb
      ),
    'topPaths',
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('path', x.path, 'count', x.cnt) ORDER BY x.cnt DESC)
         FROM (
           SELECT e.path, COUNT(*)::int AS cnt
           FROM analytics_events e
           WHERE e.company_id = p_company_id AND e.created_at >= p_since
             AND e.event_type = 'pageview'
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
             AND e.event_type = 'pageview'
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
             AND e.event_type = 'pageview'
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
             AND e.event_type = 'pageview'
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
