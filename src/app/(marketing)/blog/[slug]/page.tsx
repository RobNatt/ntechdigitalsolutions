import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/ntech/PageShell";
import { formatBlogDate, renderBlogPostBody, type BlogPostPublic } from "@/lib/blog/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { SITE_URL } from "@/constants/site";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchPublishedPost(slug: string): Promise<BlogPostPublic | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_blog_posts")
    .select("id, title, slug, excerpt, content, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) {
    console.error("blog [slug] page:", error.message);
    return null;
  }
  return (data as BlogPostPublic | null) ?? null;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);
  if (!post) {
    return { title: "Post not found | N-Tech Digital Solutions" };
  }
  const description = post.excerpt?.trim() || post.content.replace(/\s+/g, " ").slice(0, 160);
  const path = `/blog/${post.slug}`;
  return {
    title: `${post.title} | N-Tech Digital Solutions`,
    description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      ...ogForPath(path, post.title, description),
      type: "article",
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);
  if (!post) notFound();

  const base = SITE_URL.replace(/\/$/, "");
  const url = `${base}/blog/${post.slug}`;
  const description = post.excerpt?.trim() || post.content.replace(/\s+/g, " ").slice(0, 160);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    url,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    author: { "@type": "Organization", name: "N-Tech Digital Solutions", url: base },
    publisher: { "@type": "Organization", name: "N-Tech Digital Solutions", url: base },
    mainEntityOfPage: url,
  };

  return (
    <PageShell eyebrow={formatBlogDate(post.published_at)} title={post.title}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="prose-blog max-w-none text-[1.0625rem] leading-relaxed text-ink">
        {renderBlogPostBody(post.content)}
      </article>
      <p className="mt-12 border-t border-rule pt-8">
        <Link
          href="/blog"
          className="type-data text-[0.8125rem] text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          <span aria-hidden className="text-live">←</span> Back to the blog
        </Link>
      </p>
    </PageShell>
  );
}
