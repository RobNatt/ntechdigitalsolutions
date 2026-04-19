import type { Metadata } from "next";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { OmahaSeoLanding } from "@/components/omaha-seo/OmahaSeoLanding";
import { OMAHA_SEO_FAQ } from "@/content/omaha-seo-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/omaha-seo";

const desc =
  "Get Omaha SEO services that help local businesses improve visibility, attract more traffic, and generate more qualified leads. Maps, search, and pages built for the Omaha metro.";

export const metadata: Metadata = {
  title: "Omaha SEO Services for Local Businesses | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "Omaha SEO",
    "Omaha SEO services",
    "local SEO Omaha",
    "Nebraska SEO",
    "Google Business Profile Omaha",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Omaha SEO Services for Local Businesses | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const base = SITE_URL.replace(/\/$/, "");
const pageUrl = `${base}${PATH}`;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: OMAHA_SEO_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Omaha SEO services for local businesses",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function OmahaSeoPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="Omaha SEO services for local businesses"
        description={desc}
        serviceType="Local search engine optimization, Google Business Profile, on-page SEO, technical SEO"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main>
        <OmahaSeoLanding scheduleUrl={scheduleUrl} faqItems={OMAHA_SEO_FAQ} />
      </main>
    </>
  );
}
