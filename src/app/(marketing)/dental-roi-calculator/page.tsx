import type { Metadata } from "next";
import { DentalRoiCalculatorLanding } from "@/components/dental-landing/DentalRoiCalculatorLanding";
import { DENTAL_ROI_CALCULATOR_FAQ } from "@/content/dental-roi-calculator-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/dental-roi-calculator";

const desc =
  "Free dental patient revenue leak calculator for Central US practices—estimate website conversion, follow-up, and high-value case loss. Revenue protection, not vanity marketing. Leads to Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Dental ROI Calculator | Patient Revenue Leak Estimator | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental ROI calculator",
    "dental website revenue loss",
    "dental patient acquisition ROI",
    "dental lead conversion calculator",
    "dental funnel revenue optimization",
    "dental practice revenue growth",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Dental Patient Revenue Leak Calculator | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DENTAL_ROI_CALCULATOR_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Dental Patient Revenue Leak Calculator",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}/dental-roi-calculator`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function DentalRoiCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "N-Tech Digital Solutions — Dental patient acquisition",
            url: SITE_URL,
            ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
            email: SITE_CONTACT_EMAIL,
            areaServed: [
              { "@type": "State", name: "Nebraska" },
              { "@type": "State", name: "Iowa" },
              { "@type": "State", name: "Kansas" },
              { "@type": "State", name: "Missouri" },
              { "@type": "State", name: "South Dakota" },
            ],
          }),
        }}
      />
      <main>
        <DentalRoiCalculatorLanding />
      </main>
    </>
  );
}
