import type { Metadata } from "next";
import { DentistSeoLanding } from "@/components/dentist-seo/DentistSeoLanding";
import { DENTIST_SEO_FAQ } from "@/content/dentist-seo-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/dentist-seo";

const desc =
  "Get dentist-focused SEO that helps dental practices attract more new patients from local search and treatment-specific queries. Audits, on-page work, and Google Business Profile alignment.";

export const metadata: Metadata = {
  title: "Dentist SEO That Brings In More New Patients | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dentist SEO",
    "SEO for dentists",
    "dental practice SEO",
    "local SEO dentists",
    "dental marketing search",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Dentist SEO That Brings In More New Patients | N-Tech Digital Solutions", desc),
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
  mainEntity: DENTIST_SEO_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Dentist SEO",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Dentist SEO",
  description: desc,
  serviceType:
    "Local and organic SEO for dental practices: treatment pages, Google Business Profile, on-page optimization, patient-focused content, booking-oriented UX",
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
    { "@type": "ListItem", position: 2, name: "Dentist SEO", item: pageUrl },
  ],
};

export default function DentistSeoPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main>
        <DentistSeoLanding scheduleUrl={scheduleUrl} faqItems={DENTIST_SEO_FAQ} />
      </main>
    </>
  );
}
