/**
 * Canonical origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL in Vercel / .env.local if needed.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ntechdigital.solutions";

/** `NEXT_PUBLIC_CONTACT_EMAIL` — shown in header/footer and schema. */
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ntechdigital.solutions";

/**
 * Public business line — only set when you have a real number (`NEXT_PUBLIC_BUSINESS_PHONE`).
 * No default placeholder; UI hides call CTAs when this is null.
 */
export const SITE_BUSINESS_PHONE: string | null = (() => {
  const raw = process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim();
  return raw && raw.length > 0 ? raw : null;
})();

/** Shown in header/footer — override with NEXT_PUBLIC_SERVICE_AREAS if needed. */
export const SITE_SERVICE_AREAS =
  process.env.NEXT_PUBLIC_SERVICE_AREAS?.trim() ||
  "Omaha metro & Lincoln, NE — remote-friendly across the U.S.";

/** `tel:` href when `SITE_BUSINESS_PHONE` is set; otherwise null. */
export function siteTelHref(): string | null {
  if (!SITE_BUSINESS_PHONE) return null;
  return `tel:${SITE_BUSINESS_PHONE.replace(/\s/g, "")}`;
}
