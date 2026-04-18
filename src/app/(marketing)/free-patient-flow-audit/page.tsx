import type { Metadata } from "next";
import { FreePatientFlowAuditLanding } from "@/components/dental-landing/FreePatientFlowAuditLanding";
import { PATIENT_FLOW_AUDIT_LP_FAQ } from "@/content/patient-flow-audit-lp-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/free-patient-flow-audit";

const desc =
  "Free Patient Flow Audit™ for Central US dental practices: clear diagnosis of website conversion, local SEO, GBP, lead capture, follow-up, and booking leaks—before you spend more on ads or agencies. No PHI required.";

export const metadata: Metadata = {
  title: "Free Patient Flow Audit™ | Dental Website & Conversion Diagnosis | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "free dental website audit",
    "dental patient flow audit",
    "dental lead conversion audit",
    "dental SEO audit for dentists",
    "dental new patient growth audit",
    "dental revenue leak audit",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Free Patient Flow Audit™ | Dental Patient Acquisition Diagnosis | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PATIENT_FLOW_AUDIT_LP_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Patient Flow Audit™ — Dental diagnostic offer",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}/free-patient-flow-audit`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function FreePatientFlowAuditPage() {
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
            name: "N-Tech Digital Solutions — Free Patient Flow Audit",
            description:
              "Diagnostic patient acquisition audit for dental practices: conversion, local SEO, GBP, capture, follow-up, and booking friction across the Central US.",
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
        <FreePatientFlowAuditLanding />
      </main>
    </>
  );
}
