import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { FaqSection } from "@/components/marketing/FaqSection";
import { GetMoreInfoButton } from "@/components/scheduling/GetMoreInfoButton";
import { GhlIntakeFlow } from "@/components/marketing/GhlIntakeFlow";
import { buildFaqJsonLd, canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const pricingDesc =
  "One flat monthly retainer covers the whole infrastructure system — website, AI receptionist, lead automation, social media management, and review automation. Book a call for pricing.";

export const metadata: Metadata = {
  title: "Pricing | N-Tech Digital Solutions",
  description: pricingDesc,
  alternates: { canonical: canonicalUrl("/pricing") },
  openGraph: ogForPath("/pricing", "Pricing | N-Tech Digital Solutions", pricingDesc),
};

const INCLUDED = [
  "Website with lead form + Call Now button",
  "AI receptionist that answers, books, and logs every call",
  "Lead-form automation: instant CRM entry + confirmation follow-up",
  "Facebook + Instagram management, with engagement-to-lead automation",
  "Google review automation — 5-star public, everything else private feedback",
] as const;

const FAQ_ITEMS = [
  {
    q: "How much does the infrastructure system cost?",
    a: "We're running a limited case-study pricing phase right now to get honest results from a handful of real businesses before our standard rates take effect. The exact number depends on your business and what's already in place — book a call and we'll walk through it.",
  },
  {
    q: "Is this a one-time fee or a monthly retainer?",
    a: "It's a flat monthly retainer. There's no separate build fee — the website, AI receptionist, lead automation, social media management, and review automation are all included under one monthly number.",
  },
  {
    q: "Will the price go up later?",
    a: "Yes. We're intentionally pricing below where each component will land once we've completed our first five client case studies. Locking in now means locking in the case-study rate before it increases.",
  },
  {
    q: "What if I only want one or two pieces, not the whole system?",
    a: "We can scope a smaller starting point with fewer components. It costs more per component than the full bundle, since the bundle price reflects everything working together — but it's a real option if you want to start smaller.",
  },
  {
    q: "Is paid ad spend included?",
    a: "No. Ad management and ad spend are a separate add-on we typically discuss after onboarding, once the infrastructure is in place to actually convert the traffic ads send.",
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingPageShell
      title="One retainer. Every leak, covered."
      subtitle="We don't sell website design, or lead gen, or social posting separately. It's one flat monthly system — because a website without follow-up, or leads without a receptionist, still leaks money."
      cta="none"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />

      <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
          The complete system
        </p>
        <h2 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">
          Everything below, one monthly retainer.
        </h2>
        <ul className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          {INCLUDED.map((line) => (
            <li key={line} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900 dark:text-white" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-400">
          Read the full breakdown of each component on{" "}
          <Link
            href="/infrastructure"
            className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
          >
            the infrastructure page
          </Link>
          . Paid ad spend and ad management are a separate add-on, pitched after onboarding.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/90 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60 sm:p-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Why we&apos;re not posting a number here
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          We could charge per component plus a build fee. We&apos;re choosing not to right now, because
          we need honest results from real businesses first. We&apos;re running a limited case-study
          phase — once we have five, pricing moves up for everyone after. Book a call and we&apos;ll
          give you the real number and show you exactly what it covers for your business.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GetMoreInfoButton className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            Get more info
          </GetMoreInfoButton>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Ask a question first
          </Link>
        </div>
      </div>

      <FaqSection
        heading="Pricing FAQ"
        intro="What to expect before you book a call."
        items={FAQ_ITEMS}
      />

      <section
        id="intake-form"
        className="mt-10 scroll-mt-24 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50 sm:p-8"
        aria-labelledby="intake-heading"
      >
        <div className="text-center">
          <h2 id="intake-heading" className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Tell us about your business
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            We'll follow up to walk through your current workflow and what the full system would look
            like for you.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-xl">
          <GhlIntakeFlow analyticsSurface="pricing" />
        </div>
      </section>
    </MarketingPageShell>
  );
}
