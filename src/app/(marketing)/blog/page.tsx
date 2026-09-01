import type { Metadata } from "next";
import Link from "next/link";
import { blogListExcerpt, formatBlogDate, type BlogPostPublic } from "@/lib/blog/format";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { releaseDueScheduledBlogPosts } from "@/lib/dashboard/release-scheduled-blog-posts";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

/** Blog reads Supabase at request time; static prerender would cache an empty list. */
export const dynamic = "force-dynamic";

const blogDesc =
  "Notes on missed calls, lead follow-up, social media automation, and Google reviews for local service businesses.";

export const metadata: Metadata = {
  title: "Blog | N-Tech Digital Solutions",
  description: blogDesc,
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: ogForPath("/blog", "Blog | N-Tech Digital Solutions", blogDesc),
};

export default async function BlogPage() {
  let posts: BlogPostPublic[] = [];
  try {
    await releaseDueScheduledBlogPosts();
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
      subtitle="Practical notes for owners who care about missed calls, lead follow-up, and reviews — not jargon. The archive is under construction."
    >
      <p>
        Have a topic you want covered?{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Reach out
        </Link>
        .
      </p>
      <h2 className="pt-8 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500 sm:pt-10">
        Latest posts
      </h2>
      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          No published posts yet. Create and publish from Dashboard → Blog posts.
        </p>
      ) : (
        <ul className="mt-6 list-none space-y-4 p-0 sm:space-y-5">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border-b border-neutral-200 pb-6 last:border-0 dark:border-neutral-800 sm:pb-8"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block w-full rounded-2xl border border-transparent px-5 py-5 text-left transition hover:border-neutral-200 hover:bg-neutral-50/80 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/40 sm:px-6 sm:py-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="font-medium text-neutral-900 decoration-neutral-400 decoration-2 underline-offset-2 transition group-hover:underline dark:text-white dark:decoration-neutral-500">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
                    {formatBlogDate(post.published_at)}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:mt-4">
                  {blogListExcerpt(post)}
                </p>
                <span className="mt-3 inline-block text-xs font-semibold text-neutral-900 dark:text-white sm:mt-4">
                  Read full article
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </MarketingPageShell>
  );
}
