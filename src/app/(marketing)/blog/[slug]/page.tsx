import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
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
    <MarketingPageShell title={post.title} subtitle={formatBlogDate(post.published_at)} cta="compact">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="prose-blog max-w-none text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
        {renderBlogPostBody(post.content)}
      </article>
      <p className="pt-8 text-sm">
        <Link
          href="/blog"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          ← Back to the blog
        </Link>
      </p>
    </MarketingPageShell>
  );
}
