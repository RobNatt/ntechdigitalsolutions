import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { CursorReactiveLazy } from "@/components/cursor-reactive/CursorReactiveLazy";
import { Footer } from "@/components/startup-landing/footer";
import { Hero } from "@/components/startup-landing/hero";
import { HomeDashboardShowcase } from "@/components/startup-landing/home-dashboard-showcase";
import { Navbar } from "@/components/startup-landing/navbar";

const Features = dynamic(() =>
  import("@/components/startup-landing/features").then((m) => ({ default: m.Features }))
);
const Pricing = dynamic(() =>
  import("@/components/startup-landing/pricing").then((m) => ({ default: m.Pricing }))
);
const Testimonials = dynamic(() =>
  import("@/components/startup-landing/testimonials").then((m) => ({ default: m.Testimonials }))
);
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
      "N-Tech Digital Solutions | Websites Built to Bring You Customers",
  },
  description:
    "We start with your website, then SEO and GEO, lead capture with automation, and optional social and Google marketing—with funnels built on pain-to-relief, trust and evidence, and math and logic.",
  keywords: [
    "lead generation agency",
    "AI lead generation",
    "web design small business",
    "SEO website design",
    "WordPress website",
    "lead funnels",
    "automated lead tracking",
    "SEO services",
    "marketing automation small business",
    "web development agency",
  ],
  authors: [{ name: "N-Tech Digital Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ntechdigital.solutions" },
  openGraph: {
    type: "website",
    url: "https://ntechdigital.solutions",
    title:
      "N-Tech Digital Solutions | Websites Built to Bring You Customers",
    description:
      "Website-first growth: SEO and GEO, automated lead capture, and paid social and Google strategies with dedicated conversion funnels.",
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
    images: [{ url: OG_IMAGE_PATH, alt: "N-Tech Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "N-Tech Digital Solutions | Websites Built to Bring You Customers",
    description:
      "Websites, SEO and GEO, lead automation, and performance marketing—built to bring you customers.",
    images: [OG_IMAGE_PATH],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "N-Tech Digital Solutions",
  description:
    "Website design, SEO and GEO, lead capture and automation, and performance marketing for businesses that want more customers.",
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
    "WordPress Development",
    "AI Automation",
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
        <Hero />
        <Features />
        <HomeDashboardShowcase />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
      <ChatWidgetLazy />
    </>
  );
}
