import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { createAdminClient } from "@/lib/supabase/admin";

const CORE_ROUTES = [
  "",
  "/infrastructure",
  "/pricing",
  "/case-studies",
  "/about",
  "/contact",
  "/book-call",
  "/blog",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const coreEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("dashboard_blog_posts")
      .select("slug, published_at")
      .eq("status", "published")
      .lte("published_at", now.toISOString());
    postEntries = (data ?? []).map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : now,
    }));
  } catch (e) {
    console.error("sitemap blog posts:", e);
  }

  return [...coreEntries, ...postEntries];
}
