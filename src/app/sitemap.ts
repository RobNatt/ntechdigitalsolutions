import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { PACKAGES } from "@/lib/packages";
import { POSTS } from "@/lib/posts";

/*
 * Generated from the same data that builds the pages, so a new service can
 * never be added without appearing here. A hand-maintained sitemap goes stale
 * the first time someone is in a hurry.
 *
 * Priorities are relative and deliberately conservative: the home page, the
 * services index and the packages index are the entry points, individual
 * services and packages matter, blog posts support them, and the legal pages
 * exist to be findable rather than ranked.
 *
 * Completeness matters more here than it usually would. Stuart's knowledge base
 * is built by crawling this site, so a page missing from the sitemap is a
 * question he may not be able to answer on a call.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/book-a-call`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/packages`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    ...PACKAGES.map((p) => ({
      url: `${SITE_URL}/packages/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/meet-the-founder`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    ...POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
