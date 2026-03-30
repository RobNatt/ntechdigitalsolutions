/**
 * Canonical origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL in Vercel / .env.local if needed.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ntechdigital.solutions";

/** Optional: set NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_BUSINESS_PHONE for LocalBusiness schema */
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ntechdigital.solutions";

export const SITE_BUSINESS_PHONE =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+1-402-555-0100";
