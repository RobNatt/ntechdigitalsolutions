import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { createAdminClient } from "@/lib/supabase/admin";

/** Blog reads Supabase at request time; static prerender would cache an empty list. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | N-Tech Digital Solutions",
  description:
    "Notes on lead generation, web performance, automation, and growing a local business online.",
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
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("blog page dashboard_blog_posts:", error.message);
      posts = [];
    } else {
      posts = (data as BlogPost[] | null) ?? [];
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
      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          No published posts yet. Create and publish from Dashboard → Blog posts.
        </p>
      ) : (
        <ul className="mt-4 list-none space-y-4 p-0">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border-b border-neutral-200 pb-4 dark:border-neutral-800"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium text-neutral-900 dark:text-white">{post.title}</span>
                <span className="text-sm text-neutral-500">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "Published"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {post.excerpt || `${post.content.slice(0, 200)}...`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </MarketingPageShell>
  );
}
