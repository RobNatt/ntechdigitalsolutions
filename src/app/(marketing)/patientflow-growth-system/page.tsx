import type { Metadata } from "next";
import { GrowthSystemDentalLanding } from "@/components/dental-landing/GrowthSystemDentalLanding";
import { GROWTH_SYSTEM_DENTAL_FAQ } from "@/content/growth-system-dental-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/patientflow-growth-system";

const desc =
  "Growth System™ for Central US dental practices: fully managed patient acquisition with monthly SEO, qualification, SMS + email follow-up, funnel A/B testing, and ongoing optimization. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Growth System™ | Dental Patient Growth & Optimization | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental growth marketing agency",
    "dental SEO content strategy",
    "dental funnel optimization",
    "dental lead qualification system",
    "dental SMS follow-up automation",
    "dental conversion optimization services",
    "Growth System dental",
    "Central US dental patient acquisition",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Growth System™ | Compounding Dental Patient Growth | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROWTH_SYSTEM_DENTAL_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Growth System™",
  description:
    "Compounding dental patient growth system including PatientFlow Lead Machine™ capabilities plus multi-page funnels with A/B testing, lead qualification and scoring, SMS and email automation, monthly SEO content, Search Console monitoring, quarterly landing page refreshes, priority support, dedicated account management, and monthly strategy for Central US dental practices.",
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
  serviceType: "Dental growth marketing and conversion optimization",
  url: `${SITE_URL.replace(/\/$/, "")}/patientflow-growth-system`,
};

export default function PatientflowGrowthSystemPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <main>
        <GrowthSystemDentalLanding />
      </main>
    </>
  );
}
