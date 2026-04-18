import type { Metadata } from "next";
import { DentalWebsiteNotBookingPatientsLanding } from "@/components/dental-landing/DentalWebsiteNotBookingPatientsLanding";
import { DENTAL_WEBSITE_NOT_BOOKING_FAQ } from "@/content/dental-website-not-booking-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/why-dental-website-isnt-booking-patients";

const desc =
  "Why your dental website isn't booking patients (Central US): conversion vs traffic, trust, mobile friction, GBP/local gaps, and follow-up—Patient Flow Audit™ for clarity. Nebraska, Iowa, Kansas, Missouri, South Dakota.";

export const metadata: Metadata = {
  title: "Why Your Dental Website Isn't Booking Patients | Conversion Diagnosis | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "why dental websites don't convert",
    "dental website conversion optimization",
    "dental website booking problems",
    "dental patient conversion issues",
    "dental practice website audit",
    "dental website revenue leak",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Why Your Dental Website Isn’t Booking Patients | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DENTAL_WEBSITE_NOT_BOOKING_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Why your dental website isn't booking patients — conversion diagnosis",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}${PATH}`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function WhyDentalWebsiteIsntBookingPatientsPage() {
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
            name: "N-Tech Digital Solutions — Dental website conversion & patient flow",
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
        <DentalWebsiteNotBookingPatientsLanding />
      </main>
    </>
  );
}
