-- CEO dashboard content tools: blog posts + business notes

CREATE TABLE IF NOT EXISTS public.dashboard_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) >= 3),
  slug text NOT NULL UNIQUE,
  excerpt text NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz NULL,
  created_by uuid NULL,
  updated_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS dashboard_blog_posts_status_idx
  ON public.dashboard_blog_posts(status, published_at DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS public.dashboard_business_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) >= 2),
  note text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid NULL,
  updated_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS dashboard_business_notes_active_idx
  ON public.dashboard_business_notes(archived, pinned DESC, created_at DESC);
