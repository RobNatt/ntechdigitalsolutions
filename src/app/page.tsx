import type { Metadata } from "next";
import { SiteFooter } from "@/components/ntech/SiteFooter";
import { SiteNav } from "@/components/ntech/SiteNav";
import { Circuit } from "@/components/ntech/home/Circuit";
import { Close } from "@/components/ntech/home/Close";
import { Configurator } from "@/components/ntech/home/Configurator";
import { Cost } from "@/components/ntech/home/Cost";
import { Faq } from "@/components/ntech/home/Faq";
import { Hero } from "@/components/ntech/home/Hero";
import { Leaks } from "@/components/ntech/home/Leaks";
import { LiveProof } from "@/components/ntech/home/LiveProof";
import { Specifics } from "@/components/ntech/home/Specifics";
import { HOME_FAQ_ITEMS } from "@/constants/home-faq";
import { buildFaqJsonLd } from "@/lib/seo-metadata";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
  SITE_URL,
} from "@/constants/site";

const OG_IMAGE_PATH = "/ntech-official-logo.png";
const HOME_TITLE =
  "AI Receptionist, Lead Automation & Reviews | N-Tech Digital Solutions";
const HOME_DESCRIPTION =
  "N-Tech installs one connected system for local service businesses in the Omaha metro and Lincoln, NE: website, AI receptionist, lead automation, social media management, and Google review automation. One flat monthly retainer.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  keywords: [
    "AI receptionist for small business",
    "missed call text back",
    "lead follow-up automation",
    "local business CRM automation",
    "Google review automation",
    "social media lead generation",
    "Nebraska digital infrastructure",
    "Omaha AI receptionist",
  ],
  authors: [{ name: "N-Tech Digital Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
    images: [{ url: OG_IMAGE_PATH, alt: "N-Tech Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "N-Tech Digital Solutions",
  description: HOME_DESCRIPTION,
  url: SITE_URL,
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  email: SITE_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Omaha",
    addressRegion: "NE",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Omaha" },
    { "@type": "City", name: "Lincoln" },
    { "@type": "State", name: "Nebraska" },
    SITE_SERVICE_AREAS,
  ],
  serviceType: [
    "AI Receptionist",
    "Lead Automation",
    "Social Media Management",
    "Google Review Automation",
    "Web Design",
  ],
  priceRange: "$$",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "N-Tech Digital Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}${OG_IMAGE_PATH}`,
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE_CONTACT_EMAIL,
      ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
      areaServed: "US",
      availableLanguage: ["en"],
    },
  ],
  sameAs: [
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
    process.env.NEXT_PUBLIC_SOCIAL_X,
  ].filter(Boolean),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  ...buildFaqJsonLd(HOME_FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }))),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteNav />
      <main id="main" className="bg-field">
        <Hero />
        <Specifics />
        <Leaks />
        <Configurator />
        <Circuit />
        <LiveProof />
        <Cost />
        <Faq />
        <Close />
      </main>
      <SiteFooter />
    </>
  );
}
