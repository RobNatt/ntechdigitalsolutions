import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

/*
 * Generated from the same data that builds the pages, so a new service can
 * never be added without appearing here. A hand-maintained sitemap goes stale
 * the first time someone is in a hurry.
 *
 * Priorities are relative and deliberately conservative: the home page and the
 * services index are the entry points, individual services matter, and the
 * legal pages exist to be findable rather than ranked.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
