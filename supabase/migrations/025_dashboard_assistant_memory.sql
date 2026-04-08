-- Long-term memory for CEO dashboard assistant

CREATE TABLE IF NOT EXISTS public.dashboard_assistant_memory_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  review_kind text NOT NULL CHECK (review_kind IN ('weekly', 'monthly', 'quarterly')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  comparison_start date NULL,
  comparison_end date NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, review_kind, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS dashboard_assistant_memory_reviews_user_kind_idx
  ON public.dashboard_assistant_memory_reviews (user_id, review_kind, period_start DESC);

ALTER TABLE public.dashboard_assistant_memory_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access dashboard_assistant_memory_reviews"
  ON public.dashboard_assistant_memory_reviews;
CREATE POLICY "No direct access dashboard_assistant_memory_reviews"
  ON public.dashboard_assistant_memory_reviews
  FOR ALL
  USING (false);

-- Range-bound analytics summary for memory comparisons
CREATE OR REPLACE FUNCTION public.analytics_get_summary_range(
  p_company_id uuid,
  p_since timestamptz,
  p_until timestamptz
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
       WHERE e.company_id = p_company_id
         AND e.created_at >= p_since
         AND e.created_at < p_until
         AND e.event_type = 'pageview'),
    'inquirySubmissions',
      (SELECT COUNT(*)::int FROM analytics_events e
       WHERE e.company_id = p_company_id
         AND e.created_at >= p_since
         AND e.created_at < p_until
         AND e.event_type = 'inquiry_submit'),
    'uniqueSessions',
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id
         AND e.created_at >= p_since
         AND e.created_at < p_until),
    'uniqueVisitors',
      (SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_events e
       WHERE e.company_id = p_company_id
         AND e.created_at >= p_since
         AND e.created_at < p_until)
  ) INTO v;
  RETURN v;
END;
$$;

REVOKE ALL ON FUNCTION public.analytics_get_summary_range(uuid, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analytics_get_summary_range(uuid, timestamptz, timestamptz) TO service_role;
