-- Supabase linter: enable RLS on public tables exposed to PostgREST.
-- App code uses service_role (admin client), which bypasses RLS; these policies
-- block direct anon/authenticated access via the Data API.

-- public.companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access companies" ON public.companies;
CREATE POLICY "No direct access companies"
  ON public.companies
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- public.dashboard_blog_posts (linter may show as dashboard_blog_post in UI)
ALTER TABLE public.dashboard_blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access dashboard_blog_posts" ON public.dashboard_blog_posts;
CREATE POLICY "No direct access dashboard_blog_posts"
  ON public.dashboard_blog_posts
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- public.dashboard_business_notes
ALTER TABLE public.dashboard_business_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access dashboard_business_notes" ON public.dashboard_business_notes;
CREATE POLICY "No direct access dashboard_business_notes"
  ON public.dashboard_business_notes
  FOR ALL
  USING (false)
  WITH CHECK (false);
