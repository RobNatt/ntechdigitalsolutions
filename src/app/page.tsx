import type { Metadata } from "next";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { CursorReactiveLazy } from "@/components/cursor-reactive/CursorReactiveLazy";
import { HomeBrandHub } from "@/components/home/HomeBrandHub";
import { Footer } from "@/components/startup-landing/footer";
import { Navbar } from "@/components/startup-landing/navbar";
import { HOME_FAQ_ITEMS } from "@/constants/home-faq";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
  SITE_URL,
} from "@/constants/site";

/** Swap to `/og-image.jpg` after adding a 1200×630 image under `public/`. */
const OG_IMAGE_PATH = "/ntech-official-logo.png";
const HOME_TITLE = "Website Design Company | Website Development | NTech";
const HOME_DESCRIPTION =
  "NTech Digital Solutions is a website design company delivering website development, conversion-focused websites, targeted advertising, and lead tracking dashboards.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "website designer near me",
    "website design company",
    "website development company",
    "web design services",
    "professional website development",
    "conversion-focused website design",
    "business website development",
    "website development services",
    "local website design agency",
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
  "@type": "ProfessionalService",
  name: "N-Tech Digital Solutions",
  description:
    "Website design, lead capture, funnels, SEO, and paid traffic for service businesses that want more qualified buyers.",
  url: SITE_URL,
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  email: SITE_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Omaha",
    addressRegion: "NE",
    addressCountry: "US",
  },
  areaServed: [{ "@type": "Country", name: "United States" }, SITE_SERVICE_AREAS],
  serviceType: [
    "Lead Generation",
    "Web Design",
    "SEO",
    "Paid Ads",
    "Marketing Automation",
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
  "@type": "FAQPage",
  mainEntity: HOME_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
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
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <Navbar />
      <main>
        <HomeBrandHub />
      </main>
      <Footer />
      <ChatWidgetLazy />
    </>
  );
}
