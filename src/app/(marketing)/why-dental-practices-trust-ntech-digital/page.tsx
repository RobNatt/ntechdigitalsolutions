import type { Metadata } from "next";
import { WhyDentalPracticesTrustNtechLanding } from "@/components/dental-landing/WhyDentalPracticesTrustNtechLanding";
import { WHY_DENTAL_PRACTICES_TRUST_NTECH_FAQ } from "@/content/why-dental-practices-trust-ntech-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/why-dental-practices-trust-ntech-digital";

const desc =
  "Why Central US dental practices trust N-Tech Digital: patient acquisition systems over agency theater—conversion, local SEO, GBP, follow-up, and booked patients. No hype. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Why Dental Practices Trust N-Tech Digital | Dental Growth Partner | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "best dental marketing agency Central US",
    "dental growth partner",
    "dental patient acquisition experts",
    "dental SEO agency for dentists",
    "dental conversion experts",
    "dental practice growth partner",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Why Dental Practices Trust N-Tech Digital | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WHY_DENTAL_PRACTICES_TRUST_NTECH_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Why dental practices trust N-Tech Digital — patient acquisition systems",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}${PATH}`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function WhyDentalPracticesTrustNtechDigitalPage() {
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
            name: "N-Tech Digital Solutions — Dental patient acquisition (Central US)",
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
        <WhyDentalPracticesTrustNtechLanding />
      </main>
    </>
  );
}
