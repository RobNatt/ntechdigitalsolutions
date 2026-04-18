import type { Metadata } from "next";
import { PatientFlowLeadMachineLanding } from "@/components/dental-landing/PatientFlowLeadMachineLanding";
import { PATIENTFLOW_LEAD_MACHINE_FAQ } from "@/content/patientflow-lead-machine-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/patientflow-lead-machine";

const desc =
  "PatientFlow Lead Machine™ — flagship dental patient acquisition system for Central US practices: funnels, landing pages, local SEO, CRM, automation, and reporting. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "PatientFlow Lead Machine™ | Dental Patient Acquisition System | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental lead generation agency",
    "dental patient acquisition system",
    "dental CRM setup for dentists",
    "dental lead funnel optimization",
    "dental conversion funnel for practices",
    "dental appointment booking system",
    "PatientFlow Lead Machine",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "PatientFlow Lead Machine™ | Dental Patient Acquisition | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PATIENTFLOW_LEAD_MACHINE_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "PatientFlow Lead Machine™",
  description:
    "Flagship dental patient acquisition system including PatientFlow Foundation™ deliverables plus custom funnels, dedicated landing pages, lead capture, automated email follow-up, CRM pipeline setup, lead tracking dashboard, Google Business Profile optimization, local SEO for service area, monthly reporting, and quarterly conversion reviews for Central US dental practices.",
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
  serviceType: "Dental lead generation and patient acquisition system",
  url: `${SITE_URL.replace(/\/$/, "")}/patientflow-lead-machine`,
};

export default function PatientFlowLeadMachinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <main>
        <PatientFlowLeadMachineLanding />
      </main>
    </>
  );
}
