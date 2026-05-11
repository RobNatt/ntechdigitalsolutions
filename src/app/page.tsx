import type { Metadata } from "next";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { CursorReactiveLazy } from "@/components/cursor-reactive/CursorReactiveLazy";
import { HomeBrandHub } from "@/components/home/HomeBrandHub";
import { Footer } from "@/components/startup-landing/footer";
import { Navbar } from "@/components/startup-landing/navbar";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
} from "@/constants/site";

/** Swap to `/og-image.jpg` after adding a 1200×630 image under `public/`. */
const OG_IMAGE_PATH = "/ntech-official-logo.png";

export const metadata: Metadata = {
  title: {
    absolute: "N-Tech Digital Solutions | Growth Systems for Service Businesses",
  },
  description:
    "Website-first growth for roofers, HVAC, plumbers, dental practices, and similar service businesses — flagship 3 Step Scale System: site + funnel, lead dashboard, paid ads and SEO.",
  keywords: [
    "service business marketing",
    "lead generation agency",
    "web design for contractors",
    "local SEO",
    "lead funnels",
    "HVAC marketing",
    "dental practice marketing",
  ],
  authors: [{ name: "N-Tech Digital Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ntechdigital.solutions" },
  openGraph: {
    type: "website",
    url: "https://ntechdigital.solutions",
    title: "N-Tech Digital Solutions | Growth Systems for Service Businesses",
    description:
      "Websites, funnels, lead tracking, and traffic — built as one system for service businesses that want qualified buyers, not vanity traffic.",
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
    images: [{ url: OG_IMAGE_PATH, alt: "N-Tech Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "N-Tech Digital Solutions | Growth Systems for Service Businesses",
    description:
      "Website, funnel, dashboard, paid ads, and SEO — one path from click to booked work.",
    images: [OG_IMAGE_PATH],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "N-Tech Digital Solutions",
  description:
    "Website design, lead capture, funnels, SEO, and paid traffic for service businesses that want more qualified buyers.",
  url: "https://ntechdigital.solutions",
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
      <Navbar />
      <main>
        <HomeBrandHub />
      </main>
      <Footer />
      <ChatWidgetLazy />
    </>
  );
}
