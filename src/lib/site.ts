/**
 * The canonical origin, used by the sitemap, robots, and metadata.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. The fallback is the
 * real domain rather than localhost, so a missing variable produces correct
 * absolute URLs in production rather than a sitemap full of localhost links —
 * which is the failure mode that quietly destroys a site's indexing.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ntechdigital.solutions"
).replace(/\/$/, "");
