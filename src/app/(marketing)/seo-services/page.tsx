import type { Metadata } from "next";
import { SeoServicesLanding } from "@/components/seo-services/SeoServicesLanding";
import { SEO_SERVICES_FAQ } from "@/content/seo-services-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/seo-services";

const desc =
  "Get SEO services that improve visibility, traffic, and qualified leads. We help small businesses grow with strategy, content, technical SEO, and local optimization.";

export const metadata: Metadata = {
  title: "SEO Services for Small Businesses | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "SEO services",
    "small business SEO",
    "local SEO services",
    "technical SEO",
    "on-page SEO",
    "SEO audit",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "SEO Services for Small Businesses | N-Tech Digital Solutions", desc),
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
  mainEntity: SEO_SERVICES_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SEO Services for Small Businesses",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO services for small businesses",
  description: desc,
  serviceType:
    "Search engine optimization, on-page SEO, technical SEO, content strategy, internal linking, local SEO",
  url: pageUrl,
  provider: {
    "@type": "Organization",
    name: "N-Tech Digital Solutions",
    url: base,
  },
  areaServed: { "@type": "Country", name: "United States" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
    { "@type": "ListItem", position: 2, name: "SEO services", item: pageUrl },
  ],
};

export default function SeoServicesPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main>
        <SeoServicesLanding scheduleUrl={scheduleUrl} faqItems={SEO_SERVICES_FAQ} />
      </main>
    </>
  );
}
