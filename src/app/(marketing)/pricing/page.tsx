import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Pricing | N-Tech Digital Solutions",
  description:
    "Transparent starting points for websites, lead systems, and ongoing growth — final scopes are tailored after a short discovery call.",
};

const TIERS = [
  {
    name: "Launch",
    price: "From project quote",
    blurb: "Core site or landing experience, analytics baseline, and conversion-focused structure.",
  },
  {
    name: "Grow",
    price: "From project quote",
    blurb: "Funnels, integrations, and automation layered on top of a solid web foundation.",
  },
  {
    name: "Scale",
    price: "Custom retainer",
    blurb: "Ongoing optimization, experiments, and hands-on support as your volume increases.",
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingPageShell
      title="Pricing"
      subtitle="We scope from outcomes, not templates. Use this page as a starting frame; your proposal reflects your market, stack, and timeline."
    >
      <p>
        You can also review package highlights on the{" "}
        <Link
          href="/#pricing"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          home page pricing section
        </Link>
        .
      </p>
      <div className="grid gap-6 pt-4 sm:grid-cols-1">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{t.name}</h2>
            <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">{t.price}</p>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">{t.blurb}</p>
          </div>
        ))}
      </div>
      <p className="pt-2">
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Request a quote
        </Link>
      </p>
    </MarketingPageShell>
  );
}
