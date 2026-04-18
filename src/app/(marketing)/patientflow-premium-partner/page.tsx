import type { Metadata } from "next";
import { PremiumGrowthPartnerLanding } from "@/components/dental-landing/PremiumGrowthPartnerLanding";
import { PREMIUM_GROWTH_PARTNER_FAQ } from "@/content/premium-growth-partner-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/patientflow-premium-partner";

const desc =
  "Premium Growth Partner™ for Central US dental practices: highest-touch strategic partnership—faster execution, deeper CRO, stronger content, and full patient acquisition ownership. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Premium Growth Partner™ | Strategic Dental Growth Partnership | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental growth partner agency",
    "premium dental marketing services",
    "dental CRO agency",
    "dental funnel optimization partner",
    "high-end dental growth systems",
    "dental strategic marketing partner",
    "Premium Growth Partner",
    "Central US dental practice growth",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Premium Growth Partner™ | Dental Strategic Growth | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PREMIUM_GROWTH_PARTNER_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Premium Growth Partner™",
  description:
    "Highest-touch strategic growth partnership for dental practices including Growth System™ capabilities plus more frequent funnel testing, expanded content production, faster support, deeper strategy involvement, ongoing CRO leadership, and priority execution across updates for Central US markets.",
  provider: {
    "@type": "Organization",
    name: "N-Tech Digital Solutions",
    url: SITE_URL,
    ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
    email: SITE_CONTACT_EMAIL,
  },
  areaServed: [
    { "@type": "State", name: "Nebraska" },
    { "@type": "State", name: "Iowa" },
    { "@type": "State", name: "Kansas" },
    { "@type": "State", name: "Missouri" },
    { "@type": "State", name: "South Dakota" },
  ],
  serviceType: "Premium dental growth partnership and CRO",
  url: `${SITE_URL.replace(/\/$/, "")}/patientflow-premium-partner`,
};

export default function PatientflowPremiumPartnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <main>
        <PremiumGrowthPartnerLanding />
      </main>
    </>
  );
}
