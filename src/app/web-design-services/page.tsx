import type { Metadata } from "next";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/web-design-services";

const desc =
  "Conversion-focused web design and website audit positioning: clarify what is broken, what to fix first, and how design supports leads and revenue.";

export const metadata: Metadata = {
  title: "Web Design Services | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Web Design Services | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

/**
 * Full-viewport embed of the Vite-built Figma export in `public/web-design-services/`
 * (built from `public/figma-landing` with `base: /web-design-services/`).
 */
export default function WebDesignServicesPage() {
  return (
    <iframe
      title="Web design services"
      src="/web-design-services/index.html"
      className="fixed inset-0 z-[100] h-[100dvh] w-full border-0 bg-[#F5F6F7]"
    />
  );
}
