import type { Metadata } from "next";
import { CostOfLostPatientsLanding } from "@/components/dental-landing/CostOfLostPatientsLanding";
import { COST_OF_LOST_PATIENTS_FAQ } from "@/content/cost-of-lost-patients-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/cost-of-lost-patients";

const desc =
  "The cost of lost dental patients in the Central US: revenue leakage from weak conversion, local SEO, follow-up, and booking friction—and why waiting often costs more than fixing. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Cost of Lost Dental Patients | Revenue Leak Analysis | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "cost of lost dental patients",
    "dental revenue leak analysis",
    "dental website conversion loss",
    "dental patient acquisition problems",
    "dental lead conversion issues",
    "dental revenue growth strategy",
    "Central US dental practice growth",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "The Cost of Lost Patients | Dental Revenue Leakage | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COST_OF_LOST_PATIENTS_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "The Cost of Lost Patients — Dental revenue leakage",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}/cost-of-lost-patients`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function CostOfLostPatientsPage() {
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
        <CostOfLostPatientsLanding />
      </main>
    </>
  );
}
