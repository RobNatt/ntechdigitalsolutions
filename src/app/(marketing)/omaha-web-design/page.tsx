import type { Metadata } from "next";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { OmahaWebDesignLanding } from "@/components/omaha-web-design/OmahaWebDesignLanding";
import { OMAHA_WEB_DESIGN_FAQ } from "@/content/omaha-web-design-faq";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { SITE_URL } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/omaha-web-design";

const desc =
  "Get Omaha web design services that help small businesses look professional, load fast, and turn more visitors into leads. Website audits, modern builds, and discovery calls.";

export const metadata: Metadata = {
  title: "Omaha Web Design Services for Small Businesses | N-Tech Digital Solutions",
  description: desc,
  keywords: [
    "Omaha web design",
    "web design Omaha",
    "Omaha website design",
    "small business website Omaha",
    "website audit Omaha",
    "N-Tech Digital Solutions",
  ],
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: {
    ...ogForPath(PATH, "Omaha Web Design Services for Small Businesses | N-Tech Digital Solutions", desc),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

const base = SITE_URL.replace(/\/$/, "");
const pageUrl = `${base}${PATH}`;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: OMAHA_WEB_DESIGN_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Omaha web design services for small businesses",
  description: desc,
  url: pageUrl,
  isPartOf: { "@type": "WebSite", name: "N-Tech Digital Solutions", url: SITE_URL },
};

export default function OmahaWebDesignPage() {
  const scheduleUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="Omaha web design services for small businesses"
        description={desc}
        serviceType="Web design, responsive websites, conversion optimization, website audit"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main>
        <OmahaWebDesignLanding scheduleUrl={scheduleUrl} faqItems={OMAHA_WEB_DESIGN_FAQ} />
      </main>
    </>
  );
}
