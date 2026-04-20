import type { Metadata } from "next";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { OmahaLeadGenerationLanding } from "@/components/omaha-lead-generation/OmahaLeadGenerationLanding";
import { OMAHA_LEAD_GENERATION_FAQ } from "@/content/omaha-lead-generation-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/omaha-lead-generation-small-business";

const desc =
  "Get Omaha lead generation help designed for small businesses that want more booked jobs, calls, and consistent leads from online marketing. System-first audits, funnels, and follow-up.";

export const metadata: Metadata = {
  title: "Omaha Lead Generation for Small Business | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "Omaha lead generation",
    "lead generation small business Omaha",
    "Omaha small business marketing",
    "local lead generation",
    "CRM automation Omaha",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Omaha Lead Generation for Small Business | N-Tech Digital Solutions", desc),
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
  mainEntity: OMAHA_LEAD_GENERATION_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Omaha lead generation for small business",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function OmahaLeadGenerationSmallBusinessPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="Omaha lead generation for small business"
        description={desc}
        serviceType="Lead generation, marketing funnel, CRM automation, local SEO, website conversion"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main>
        <OmahaLeadGenerationLanding scheduleUrl={scheduleUrl} faqItems={OMAHA_LEAD_GENERATION_FAQ} />
      </main>
    </>
  );
}
