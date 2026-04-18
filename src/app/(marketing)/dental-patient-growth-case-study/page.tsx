import type { Metadata } from "next";
import { DentalPatientGrowthCaseStudyLanding } from "@/components/dental-landing/DentalPatientGrowthCaseStudyLanding";
import { DENTAL_PATIENT_GROWTH_CASE_STUDY_FAQ } from "@/content/dental-patient-growth-case-study-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/dental-patient-growth-case-study";

const desc =
  "Dental patient growth case study (Central US): from inconsistent flow and weak conversion to stronger consults, follow-up, and local visibility—systems over hype. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Dental Patient Growth Case Study | From Traffic to Booked Patients | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental marketing case study",
    "dental patient growth success story",
    "dental SEO results for dentists",
    "dental patient acquisition results",
    "dental lead conversion case study",
    "dental growth partner success",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Dental Patient Growth Case Study | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DENTAL_PATIENT_GROWTH_CASE_STUDY_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Dental Patient Growth Case Study — Traffic to booked patients",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}/dental-patient-growth-case-study`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function DentalPatientGrowthCaseStudyPage() {
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
        <DentalPatientGrowthCaseStudyLanding />
      </main>
    </>
  );
}
