import type { Metadata } from "next";
import { PatientFlowFoundationLanding } from "@/components/dental-landing/PatientFlowFoundationLanding";
import { PATIENTFLOW_FOUNDATION_FAQ } from "@/content/patientflow-foundation-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/patientflow-foundation";

const desc =
  "PatientFlow Foundation™ for Central US dental practices: conversion website, local SEO setup, analytics, and lead capture—stop leaking patients before you scale marketing. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "PatientFlow Foundation™ | Dental Website & SEO Foundation | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "dental website design Central US",
    "dental website conversion optimization",
    "dental SEO setup",
    "dental lead capture optimization",
    "dental website agency for dentists",
    "dental practice website optimization",
    "PatientFlow Foundation",
    "dental patient acquisition",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "PatientFlow Foundation™ | Dental Patient Acquisition | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PATIENTFLOW_FOUNDATION_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "PatientFlow Foundation™",
  description:
    "Foundational dental patient acquisition package: custom conversion-focused website, on-page and local SEO setup, analytics, Search Console, Bing Webmaster, and lead capture optimization for Central US dental practices.",
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
  serviceType: "Dental website design and local SEO foundation",
  url: `${SITE_URL.replace(/\/$/, "")}/patientflow-foundation`,
};

export default function PatientFlowFoundationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <main>
        <PatientFlowFoundationLanding />
      </main>
    </>
  );
}
