import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { PageShell } from "@/components/ntech/PageShell";
import { ctaPrimary, ctaSecondary } from "@/components/ntech/primitives";
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

const EXCLUDED = [
  "Paid ad management and ad spend — a separate add-on, raised after onboarding once the infrastructure exists to convert the traffic",
  "A guarantee of leads or revenue — no legitimate operator offers one, and we don't",
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
  {
    q: "Is there a contract, and what happens if I want to cancel?",
    a: "We keep terms simple and will walk you through them on a call before you commit. The goal is a system you see results from, not a contract you feel stuck in.",
  },
] as const;

export default function PricingPage() {
  return (
    <PageShell
      eyebrow="Pricing"
      title="One retainer. Every leak, covered."
      lede="We don't sell website design, or lead gen, or social posting separately. It's one flat monthly system — because a website without follow-up, or leads without a receptionist, still leaks money."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />

      <div className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
        <p className="type-data text-[0.75rem] uppercase text-muted-ink">The complete system</p>
        <h2 className="type-heading mt-3 text-[var(--text-step-2)] text-ink">
          Everything below, one monthly retainer.
        </h2>

        <ul className="mt-6 space-y-3">
          {INCLUDED.map((line) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-live" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="type-data mt-8 text-[0.75rem] uppercase text-muted-ink">Not included</p>
        <ul className="mt-3 space-y-3">
          {EXCLUDED.map((line) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-ink">
              <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 border-t border-rule pt-6 text-[0.9375rem] leading-relaxed text-muted-ink">
          Read the full breakdown of each component on{" "}
          <Link
            href="/infrastructure"
            className="font-semibold text-ink underline underline-offset-4"
          >
            the infrastructure page
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 border-l-2 border-live bg-white py-6 pl-5 pr-5 sm:pl-7 sm:pr-7">
        <h2 className="type-heading text-[1.25rem] text-ink">
          Why there is no number on this page
        </h2>
        <p className="mt-4 text-[1rem] leading-relaxed text-muted-ink">
          We could charge per component plus a build fee. We&apos;re choosing not to right now,
          because we need honest results from real businesses first. We&apos;re running a limited
          case-study phase — once we have five, pricing moves up for everyone after. Book a call and
          we&apos;ll give you the real number and show you exactly what it covers for your business.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/book-call" className={ctaPrimary}>
            Book With Us
          </Link>
          <Link href="/contact" className={ctaSecondary}>
            Ask a question first
          </Link>
        </div>
      </div>

      <section aria-labelledby="pricing-faq" className="mt-14 border-t border-rule pt-12">
        <h2 id="pricing-faq" className="type-heading text-[var(--text-step-2)] text-ink">
          Pricing FAQ
        </h2>
        <p className="mt-3 text-[1rem] text-muted-ink">What to expect before you book a call.</p>
        <div className="mt-6 rounded-xl border border-rule bg-white px-4 sm:px-6">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={item.q}
              className="group border-b border-rule last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">
                <span className="type-data mt-0.5 shrink-0 text-[0.75rem] text-muted-ink tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="type-heading flex-1 text-[1rem] text-ink">{item.q}</span>
              </summary>
              <p className="pb-5 text-[0.9375rem] leading-relaxed text-muted-ink sm:pl-[2.5rem]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
