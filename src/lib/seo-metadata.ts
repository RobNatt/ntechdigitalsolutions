import type { Metadata } from "next";
import { SITE_URL } from "@/constants/site";

/** Absolute canonical URL for a path (leading slash, no trailing slash on site root). */
export function canonicalUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return SITE_URL;
  return `${SITE_URL.replace(/\/$/, "")}${p}`;
}

/** Common Open Graph block for marketing pages. */
export function ogForPath(
  path: string,
  title: string,
  description: string
): NonNullable<Metadata["openGraph"]> {
  const url = canonicalUrl(path);
  return {
    title,
    description,
    url,
    type: "website",
  };
}

export type FaqItem = { q: string; a: string };

/** `FAQPage` JSON-LD node for a flat list of Q&A pairs — embed in a page's `@graph` array. */
export function buildFaqJsonLd(items: readonly FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
