import type { Metadata } from "next";
import { RankVaultLanding } from "@/components/rankvault/RankVaultLanding";
import { RANKVAULT_PATH } from "@/constants/rankvault";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const title = "RankVault | Rank and Rent Local Lead Generation Systems";
const description =
  "RankVault by NTech Digital Solutions is done-for-you local lead generation infrastructure: rank-and-rent sites, SEO systems, and exclusive inbound contractor leads.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "rank and rent",
    "local lead generation",
    "exclusive contractor leads",
    "SEO lead generation",
    "local SEO systems",
    "inbound lead generation",
  ],
  alternates: { canonical: canonicalUrl(RANKVAULT_PATH) },
  openGraph: {
    ...ogForPath(RANKVAULT_PATH, title, description),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const rankVaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "RankVault",
  serviceType: "Rank and Rent Lead Generation",
  provider: {
    "@type": "ProfessionalService",
    name: "N-Tech Digital Solutions",
    url: "https://ntechdigital.solutions",
    ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
    email: SITE_CONTACT_EMAIL,
  },
  description,
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/LimitedAvailability",
  },
};

export default function RankVaultPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rankVaultJsonLd) }} />
      <RankVaultLanding />
    </>
  );
}
