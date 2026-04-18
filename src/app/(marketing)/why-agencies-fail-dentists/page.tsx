import type { Metadata } from "next";
import { WhyAgenciesFailDentistsLanding } from "@/components/dental-landing/WhyAgenciesFailDentistsLanding";
import { WHY_AGENCIES_FAIL_DENTISTS_FAQ } from "@/content/why-agencies-fail-dentists-faq";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/why-agencies-fail-dentists";

const desc =
  "Why most marketing agencies fail dentists in the Central US: activity vs outcomes, what agencies ignore, and how N-Tech focuses on patient acquisition systems and booked patients. Free Patient Flow Audit.";

export const metadata: Metadata = {
  title: "Why Most Agencies Fail Dentists | Dental Patient Acquisition | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "best dental marketing agency",
    "why dental marketing agencies fail",
    "dental patient acquisition agency",
    "dental SEO agency for dentists",
    "dental growth partner",
    "dental lead conversion experts",
    "Central US dental marketing",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Why Most Agencies Fail Dentists | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WHY_AGENCIES_FAIL_DENTISTS_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Why Most Agencies Fail Dentists",
  description: desc,
  url: `${SITE_URL.replace(/\/$/, "")}/why-agencies-fail-dentists`,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function WhyAgenciesFailDentistsPage() {
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
            name: "N-Tech Digital Solutions — Dental patient acquisition",
            description:
              "Dental marketing and patient acquisition systems for Central US practices—conversion, local SEO, follow-up, and booked patient outcomes.",
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
        <WhyAgenciesFailDentistsLanding />
      </main>
    </>
  );
}
