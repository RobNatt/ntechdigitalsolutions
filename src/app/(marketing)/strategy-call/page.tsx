import type { Metadata } from "next";
import { StrategyQualificationForm } from "@/components/strategy-call/StrategyQualificationForm";
import { CONSTANTS } from "@/constants/links";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const path = CONSTANTS.STRATEGY_QUALIFICATION_PATH;
const title = "Schedule a Strategy Call | N-Tech Digital Solutions";
const description =
  "Tell us about your business and revenue range. If we are a strong fit, you will book a strategy session directly; otherwise our team will follow up personally.";

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

export default function StrategyCallQualificationPage() {
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <StrategyQualificationForm />
    </div>
  );
}
