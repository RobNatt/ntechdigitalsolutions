import type { Metadata } from "next";
import { WebDesignServicesLanding } from "@/components/web-design-services/WebDesignServicesLanding";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/web-design-services";

const desc =
  "Conversion-focused web design: what is broken on your site, what to fix first, and how design supports leads and revenue. Free website audit from N-Tech Digital Solutions.";

export const metadata: Metadata = {
  title: "Web Design Services | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "web design services",
    "website audit",
    "conversion-focused website",
    "small business web design",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Web Design Services | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function WebDesignServicesPage() {
  return <WebDesignServicesLanding />;
}
