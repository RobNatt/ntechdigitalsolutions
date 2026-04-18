import type { Metadata } from "next";
import { NewPatientLeakFunnelLanding } from "@/components/dental-landing/NewPatientLeakFunnelLanding";
import { NEW_PATIENT_LEAK_FUNNEL_FAQ } from "@/content/new-patient-leak-funnel-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/new-patient-leak-funnel";

const desc =
  "Dental new patient leaks (Central US): where practices lose patients before they book—conversion, follow-up, local SEO, GBP, and booking friction. Patient Flow Audit™ for clarity, not hype. Nebraska, Iowa, Kansas, Missouri, South Dakota.";

export const metadata: Metadata = {
  title: "Dental New Patient Leak Funnel | Patient Loss & Conversion | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental new patient loss",
    "dental patient leakage",
    "dental conversion problems",
    "dental website lost patients",
    "dental lead conversion issues",
    "dental practice growth problems",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Dental New Patient Leak Funnel | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: NEW_PATIENT_LEAK_FUNNEL_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "New patient leak funnel — dental patient loss before booking",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}${PATH}`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function NewPatientLeakFunnelPage() {
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
            name: "N-Tech Digital Solutions — Dental patient flow diagnosis",
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
        <NewPatientLeakFunnelLanding />
      </main>
    </>
  );
}
