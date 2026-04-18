import type { Metadata } from "next";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { CursorReactiveLazy } from "@/components/cursor-reactive/CursorReactiveLazy";
import { DentalHomeLanding } from "@/components/dental-landing/DentalHomeLanding";
import { Footer } from "@/components/startup-landing/footer";
import { Navbar } from "@/components/startup-landing/navbar";
import { DENTAL_HOME_FAQ } from "@/content/dental-home-faq";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
} from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

/** Swap to `/og-image.jpg` after adding a 1200×630 image under `public/`. */
const OG_IMAGE_PATH = "/ntech-official-logo.png";

const homeDesc =
  "Central US dental growth partner: conversion websites, local SEO, Google Business Profile, and patient acquisition funnels that turn traffic into booked patients. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: {
    absolute:
      "Dental Marketing & Patient Acquisition | N-Tech Digital Solutions | Central US",
  },
  description: homeDesc,
  keywords: [
    "dental marketing agency Central US",
    "dental SEO for dentists",
    "dental patient acquisition",
    "dental lead generation agency",
    "new patient funnel for dentists",
    "dental website conversion optimization",
    "Google Business Profile dental",
    "dental practice Nebraska",
    "dental marketing Iowa",
    "dental marketing Kansas",
    "dental marketing Missouri",
    "dental marketing South Dakota",
  ],
  authors: [{ name: "N-Tech Digital Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    ...ogForPath("/", "Dental Patient Acquisition | N-Tech Digital Solutions | Central US", homeDesc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
    images: [{ url: OG_IMAGE_PATH, alt: "N-Tech Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental Patient Acquisition | N-Tech Digital Solutions",
    description: homeDesc,
    images: [OG_IMAGE_PATH],
  },
};

const areaCentralUs = [
  { "@type": "State", name: "Nebraska" },
  { "@type": "State", name: "Iowa" },
  { "@type": "State", name: "Kansas" },
  { "@type": "State", name: "Missouri" },
  { "@type": "State", name: "South Dakota" },
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "N-Tech Digital Solutions",
  description:
    "Dental patient acquisition for practices across the Central US: conversion-focused websites, local SEO, Google Business Profile optimization, automated follow-up, and AI-assisted funnels. Free Patient Flow Audit.",
  url: "https://ntechdigital.solutions",
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  email: SITE_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Omaha",
    addressRegion: "NE",
    addressCountry: "US",
  },
  areaServed: [{ "@type": "Country", name: "United States" }, ...areaCentralUs, SITE_SERVICE_AREAS],
  serviceType: [
    "Dental website design",
    "Dental local SEO",
    "Google Business Profile for dentists",
    "Dental lead follow-up automation",
    "Dental patient acquisition consulting",
  ],
  priceRange: "$$",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DENTAL_HOME_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <CursorReactiveLazy />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <Navbar />
      <main className="pt-[4.75rem] sm:pt-24 lg:pt-28">
        <DentalHomeLanding />
      </main>
      <Footer />
      <ChatWidgetLazy />
    </>
  );
}
