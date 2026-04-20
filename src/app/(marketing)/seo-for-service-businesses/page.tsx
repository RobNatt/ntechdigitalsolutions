import type { Metadata } from "next";
import { SeoForServiceBusinessesLanding } from "@/components/seo-for-service-businesses/SeoForServiceBusinessesLanding";
import { SEO_FOR_SERVICE_BUSINESSES_FAQ } from "@/content/seo-for-service-businesses-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/seo-for-service-businesses";

const desc =
  "Get SEO designed specifically for service businesses that want more calls, quotes, and booked jobs from local search. Contractors, home services, and on-site trades.";

export const metadata: Metadata = {
  title: "SEO for Service Businesses That Get More Booked Jobs | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "SEO for service businesses",
    "local SEO contractors",
    "home services SEO",
    "HVAC SEO",
    "plumber SEO",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "SEO for Service Businesses That Get More Booked Jobs | N-Tech Digital Solutions", desc),
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
  mainEntity: SEO_FOR_SERVICE_BUSINESSES_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SEO for service businesses",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO for service businesses",
  description: desc,
  serviceType:
    "Local SEO for contractors and home services, service-area pages, on-page SEO, technical SEO, conversion-focused optimization",
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
    { "@type": "ListItem", position: 2, name: "SEO for service businesses", item: pageUrl },
  ],
};

export default function SeoForServiceBusinessesPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main>
        <SeoForServiceBusinessesLanding scheduleUrl={scheduleUrl} faqItems={SEO_FOR_SERVICE_BUSINESSES_FAQ} />
      </main>
    </>
  );
}
