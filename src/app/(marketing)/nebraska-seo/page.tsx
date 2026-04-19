import type { Metadata } from "next";
import { NebraskaStateServiceJsonLd } from "@/components/marketing/NebraskaStateServiceJsonLd";
import { NebraskaSeoLanding } from "@/components/nebraska-seo/NebraskaSeoLanding";
import { NEBRASKA_SEO_FAQ } from "@/content/nebraska-seo-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/nebraska-seo";

const desc =
  "Get Nebraska SEO services that help businesses improve visibility, attract more traffic, and generate qualified leads across the state. Multi-city and regional search, done practically.";

export const metadata: Metadata = {
  title: "Nebraska SEO Services for Local Businesses | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "Nebraska SEO",
    "Nebraska SEO services",
    "statewide SEO Nebraska",
    "Lincoln Omaha SEO",
    "multi-city SEO",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Nebraska SEO Services for Local Businesses | N-Tech Digital Solutions", desc),
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
  mainEntity: NEBRASKA_SEO_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Nebraska SEO services for local businesses",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function NebraskaSeoPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <NebraskaStateServiceJsonLd
        path={PATH}
        name="Nebraska SEO services for local businesses"
        description={desc}
        serviceType="Search engine optimization, statewide and multi-city SEO, local SEO, technical SEO, content strategy"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main>
        <NebraskaSeoLanding scheduleUrl={scheduleUrl} faqItems={NEBRASKA_SEO_FAQ} />
      </main>
    </>
  );
}
