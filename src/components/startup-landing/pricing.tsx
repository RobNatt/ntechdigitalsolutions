"use client";

import React from "react";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const TIERS = [
  {
    id: "foundation",
    packageLabel: "Package 1",
    nameLine: "Foundation",
    price: "$4,000",
    subline: "One-time build · $150/mo maintenance optional",
    description:
      "A professional, fast site with SEO fundamentals and analytics — so you launch with credibility and a clear path to being found online.",
    featured: false,
    cta: { label: "Get started", style: "outline" as const },
    features: [
      "5-page custom website",
      "Mobile-first responsive design",
      "On-page SEO setup",
      "Google Search Console + Bing Webmaster submission",
      "Contact form connected to email",
      "Google Analytics setup",
      "14-day delivery promise",
    ],
    bestFor: "Businesses that need a professional website and a solid launch.",
  },
  {
    id: "lead-machine",
    packageLabel: "Package 2",
    nameLine: "Lead Machine",
    price: "$7,000",
    subline: "One-time build + $1,200/mo",
    description:
      "Everything in Foundation, plus a funnel, CRM, and follow-up so interest turns into pipeline — not lost tabs and voicemail.",
    featured: true,
    badge: "Most popular",
    cta: { label: "Book a call →", style: "primary" as const },
    features: [
      "Everything in Foundation",
      "Custom lead funnel",
      "Dedicated landing page",
      "Lead capture forms",
      "Automated email follow-up",
      "CRM setup and pipeline configuration",
      "Lead tracking dashboard",
      "Google Business Profile optimization",
      "Local SEO for city / service area",
      "Monthly performance report",
      "Conversion review every 90 days",
    ],
    bestFor:
      "Businesses that need more than a website — a system that catches, tracks, and nurtures leads.",
  },
  {
    id: "complete-system",
    packageLabel: "Package 3",
    nameLine: "Growth System",
    price: "$12,000",
    subline: "One-time build + $4,000/mo",
    description:
      "Full-stack growth: qualification, SMS + email sequences, content, and ongoing optimization so your funnel keeps compounding.",
    featured: false,
    cta: { label: "Contact sales", style: "outline" as const },
    features: [
      "Everything in Lead Machine",
      "Multi-page funnel with A/B testing",
      "Automated lead qualification and scoring",
      "SMS + email follow-up sequences",
      "Monthly SEO content",
      "Ongoing Search Console monitoring",
      "Quarterly landing page refreshes",
      "Priority support",
      "Dedicated account manager",
      "Monthly strategy call",
    ],
    bestFor:
      "Businesses that want done-for-you lead generation and ongoing optimization.",
  },
  {
    id: "premium-growth-partner",
    packageLabel: "Package 4",
    nameLine: "Premium Growth Partner",
    price: "$20,000",
    subline: "One-time build + $7,000/mo · inquire for details",
    description:
      "Our highest-touch partnership: faster execution, more testing and content, and deeper strategy — for teams who want us operating as an extension of theirs.",
    featured: false,
    cta: {
      label: "Inquire for more information",
      style: "outline" as const,
      href: "/contact?plan=premium-growth-partner",
    },
    features: [
      "Everything in Complete System",
      "More frequent funnel testing",
      "More content production",
      "Faster support",
      "Deeper strategy involvement",
      "Ongoing CRO work",
      "Priority execution across all updates",
    ],
    bestFor:
      "Higher-budget clients who want full ownership of their web and lead system.",
  },
] as const;

type Tier = (typeof TIERS)[number];

function tierContactHref(tier: Tier): string {
  const cta = tier.cta as { label: string; style: "primary" | "outline"; href?: string };
  if (tier.id === "lead-machine") return CONSTANTS.BOOK_CALL_PATH;
  return cta.href ?? `/contact?plan=${tier.id}`;
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative isolate w-full overflow-hidden bg-white py-12 sm:py-16 dark:bg-neutral-950"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto max-w-[90rem] px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-100">
            Simple pricing. Serious results.
          </h2>
          <p className="mt-2 text-sm leading-snug text-neutral-600 sm:text-base dark:text-neutral-400">
            Four ways to work with us — from a strong launch to a fully managed growth engine.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[90rem] grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {TIERS.map((tier) => {
            const href = tierContactHref(tier);
            const onPlanClick = () =>
              trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.PRICING_PLAN_CLICK, {
                plan_id: tier.id,
                plan_name: tier.nameLine,
              });

            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex h-full flex-col rounded-xl border p-5 md:p-6",
                  tier.featured
                    ? "border-sky-500/60 bg-gradient-to-b from-sky-50/80 to-white shadow-[0_0_32px_-10px_rgba(14,165,233,0.3)] dark:border-sky-500/50 dark:from-neutral-900 dark:to-neutral-950 dark:shadow-[0_0_40px_-14px_rgba(34,211,238,0.18)]"
                    : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60"
                )}
              >
                {tier.featured && tier.badge && (
                  <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2">
                    <span className="rounded-full bg-sky-400 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-950 shadow-sm">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                  <span className="text-neutral-400 dark:text-neutral-500">{tier.packageLabel}</span>
                  <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {tier.nameLine}
                  </span>
                </p>
                <p
                  className={cn(
                    "mt-3 font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50",
                    "text-2xl md:text-3xl"
                  )}
                >
                  {tier.price}
                </p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{tier.subline}</p>
                <p className="mt-3 text-xs leading-snug text-neutral-600 sm:text-[13px] sm:leading-snug dark:text-neutral-400">
                  {tier.description}
                </p>

                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                  What&apos;s included
                </p>
                <ul className="mt-2 flex-1 space-y-2">
                  {tier.features.map((line) => (
                    <li key={line} className="flex gap-2 text-left text-[12px] leading-snug sm:text-[13px]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/35">
                        <IconCheck className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-neutral-200/90 pt-3 dark:border-neutral-700/70">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                    Best for
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-neutral-600 dark:text-neutral-400">
                    {tier.bestFor}
                  </p>
                </div>

                <div className="mt-5">
                  {tier.cta.style === "primary" ? (
                    <Link
                      href={href}
                      onClick={onPlanClick}
                      className={cn(
                        "btn-primary flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-center text-sm font-bold transition",
                        "bg-gradient-to-b from-sky-400 to-sky-600 text-neutral-950",
                        "shadow-[0_0_28px_rgba(14,165,233,0.35)] hover:from-sky-300 hover:to-sky-500",
                        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400"
                      )}
                    >
                      {tier.cta.label}
                    </Link>
                  ) : (
                    <Button
                      as={Link}
                      href={href}
                      variant="secondary"
                      onClick={onPlanClick}
                      className={cn(
                        "btn-primary w-full border border-neutral-300 bg-transparent font-bold",
                        "text-neutral-900 hover:bg-neutral-100",
                        "dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {tier.cta.label}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
