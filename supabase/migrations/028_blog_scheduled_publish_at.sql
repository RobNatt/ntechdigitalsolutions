-- Planned go-live time for draft posts (shown in dashboard). When you publish, this can
-- copy to published_at for future scheduling on /blog.
ALTER TABLE public.dashboard_blog_posts
  ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamptz NULL;
