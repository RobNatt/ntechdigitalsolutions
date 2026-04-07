import type { Metadata } from "next";
import { ChatWidget } from "@/components/chat/chat-widget";
import { CursorReactiveEnvironment } from "@/components/cursor-reactive/CursorReactiveEnvironment";
import { Features } from "@/components/startup-landing/features";
import { Footer } from "@/components/startup-landing/footer";
import { Hero } from "@/components/startup-landing/hero";
import { Navbar } from "@/components/startup-landing/navbar";
import { Process } from "@/components/startup-landing/process";
import { Pricing } from "@/components/startup-landing/pricing";
import { Testimonials } from "@/components/startup-landing/testimonials";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
} from "@/constants/site";

/** Swap to `/og-image.jpg` after adding a 1200×630 image under `public/`. */
const OG_IMAGE_PATH = "/ntech-official-logo.png";

export const metadata: Metadata = {
  title: {
    absolute:
      "N-Tech Digital Solutions | AI-Powered Lead Generation & Web Design Omaha",
  },
  description:
    "N-Tech Digital Solutions builds AI-powered lead generation systems, high-converting websites, and automated lead funnels for small businesses. SEO-optimized WordPress sites built to rank and convert.",
  keywords: [
    "lead generation agency",
    "AI lead generation",
    "web design small business",
    "SEO website design",
    "WordPress website",
    "lead funnels",
    "automated lead tracking",
    "local SEO",
    "web development agency",
  ],
  authors: [{ name: "N-Tech Digital Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ntechdigital.solutions" },
  openGraph: {
    type: "website",
    url: "https://ntechdigital.solutions",
    title:
      "N-Tech Digital Solutions | AI-Powered Lead Generation & Web Design",
    description:
      "We build AI-powered lead systems, SEO-optimized websites, and automated funnels that turn clicks into paying customers — on autopilot.",
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
    images: [{ url: OG_IMAGE_PATH, alt: "N-Tech Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "N-Tech Digital Solutions | AI Lead Generation & Web Design",
    description:
      "AI-powered lead generation, funnels, and SEO-optimized websites for small businesses ready to grow.",
    images: [OG_IMAGE_PATH],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "N-Tech Digital Solutions",
  description:
    "AI-powered lead generation systems, website design, and automated lead funnels for small businesses.",
  url: "https://ntechdigital.solutions",
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  email: SITE_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Omaha",
    addressRegion: "NE",
    addressCountry: "US",
  },
  areaServed: SITE_SERVICE_AREAS,
  serviceType: [
    "Lead Generation",
    "Web Design",
    "SEO",
    "WordPress Development",
    "AI Automation",
  ],
  priceRange: "$$",
};

export default function HomePage() {
  return (
    <>
      <CursorReactiveEnvironment />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Process />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
