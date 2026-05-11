import type { Metadata } from "next";
import { GrowthSystemFunnel } from "@/components/growth-system/GrowthSystemFunnel";
import { GROWTH_SYSTEM_FUNNEL_PATH, GROWTH_SYSTEM_OFFER_NAME } from "@/constants/growth-system-offer";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const path = GROWTH_SYSTEM_FUNNEL_PATH;
const title = `${GROWTH_SYSTEM_OFFER_NAME} | N-Tech Digital Solutions`;
const description =
  "Website rebuild with lead capture and funnel, custom lead dashboard, then paid ads plus SEO — one system for service businesses. $7,000 + $1,500/mo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl(path) },
  openGraph: {
    ...ogForPath(path, title, description),
    siteName: "N-Tech Digital Solutions",
    locale: "en_US",
  },
};

export default function GrowthSystemFunnelPage() {
  return <GrowthSystemFunnel />;
}
