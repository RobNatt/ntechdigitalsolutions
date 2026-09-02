import type { Metadata } from "next";
import Link from "next/link";
import { blogListExcerpt, formatBlogDate, type BlogPostPublic } from "@/lib/blog/format";
import { PageShell } from "@/components/ntech/PageShell";
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
    <PageShell
      eyebrow="Blog"
      title="Notes for owners who answer their own phone."
      lede="Missed calls, lead follow-up, social media, and reviews — what actually moves the number, without the jargon."
    >
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-rule-strong bg-white p-6">
          <p className="type-data text-[0.75rem] uppercase text-muted-ink">Handoff</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
            TODO(client): no posts are published yet. Write and publish from Dashboard → Blog posts
            and they appear here automatically.
          </p>
        </div>
      ) : (
        <ul className="rounded-xl border border-rule bg-white px-4 sm:px-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-rule last:border-b-0">
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="type-data shrink-0 text-[0.75rem] text-muted-ink tabular-nums sm:w-28">
                    {formatBlogDate(post.published_at)}
                  </span>
                  <span className="type-heading flex-1 text-[1.0625rem] text-ink underline-offset-4 group-hover:underline">
                    {post.title}
                  </span>
                </div>
                <p className="mt-2.5 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted-ink sm:pl-[8.25rem]">
                  {blogListExcerpt(post)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-[0.9375rem] text-muted-ink">
        Have a topic you want covered?{" "}
        <Link href="/contact" className="font-semibold text-ink underline underline-offset-4">
          Reach out
        </Link>
        .
      </p>
    </PageShell>
  );
}
