import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes have nothing to index and shouldn't be crawled.
        disallow: ["/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
