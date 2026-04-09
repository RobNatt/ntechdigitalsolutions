import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostsReader } from "@/components/marketing/BlogPostsReader";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

/** Blog reads Supabase at request time; static prerender would cache an empty list. */
export const dynamic = "force-dynamic";

const blogDesc =
  "Notes on lead generation, web performance, automation, and growing a local business online.";

export const metadata: Metadata = {
  title: "Blog | N-Tech Digital Solutions",
  description: blogDesc,
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: ogForPath("/blog", "Blog | N-Tech Digital Solutions", blogDesc),
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("dashboard_blog_posts")
      .select("id, title, slug, excerpt, content, published_at")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("blog page dashboard_blog_posts:", error.message);
      posts = [];
    } else {
      posts = (data as typeof posts | null) ?? [];
    }
  } catch (e) {
    console.error("blog page:", e);
    posts = [];
  }

  return (
    <MarketingPageShell
      title="Blog"
      subtitle="Practical articles for owners who care about conversion, not jargon. The archive is under construction."
    >
      <p>
        Subscribe from the site footer when the newsletter goes live, or{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          reach out
        </Link>{" "}
        if you want a topic covered.
      </p>
      <h2 className="pt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
        Latest posts
      </h2>
      <BlogPostsReader posts={posts} />
    </MarketingPageShell>
  );
}
