"use client";

import React from "react";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";
import { CONSTANTS } from "@/constants/links";

const TIERS = [
  {
    id: "starter",
    label: "Starter",
    price: "$997",
    subline: "one-time build + $149/mo maintenance",
    featured: false,
    cta: { label: "Get Started", style: "outline" as const },
    features: [
      "5-page SEO-optimized website",
      "WordPress CMS with full training",
      "Mobile-first responsive design",
      "Google Analytics setup",
      "Basic contact lead form",
      "14-day delivery guarantee",
    ],
  },
  {
    id: "growth",
    label: "Growth",
    price: "$2,497",
    subline: "one-time build + $299/mo AI system",
    featured: true,
    badge: "Most popular",
    cta: { label: "Book a Call →", style: "primary" as const },
    features: [
      "Everything in Starter",
      "Custom lead funnel + landing pages",
      "AI lead tracking & scoring",
      "Automated follow-up sequences",
      "CRM integration",
      "Monthly performance report",
      "Conversion rate optimization",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$4,997",
    subline: "one-time build + $499/mo full management",
    featured: false,
    cta: { label: "Contact Sales", style: "outline" as const },
    features: [
      "Everything in Growth",
      "Full AI automation suite",
      "Lead generation & selling service",
      "Ongoing SEO content strategy",
      "A/B testing & funnel optimization",
      "Dedicated account manager",
      "Priority support & development",
    ],
  },
] as const;

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative isolate w-full overflow-hidden bg-white py-16 sm:py-20 dark:bg-neutral-950"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl dark:text-neutral-100">
            Simple pricing. Serious results.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Transparent packages built for small businesses ready to grow. No
            hidden fees — just systems that work.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-6 md:p-8",
                tier.featured
                  ? "border-sky-500/60 bg-gradient-to-b from-sky-50/80 to-white shadow-[0_0_40px_-8px_rgba(14,165,233,0.35)] dark:border-sky-500/50 dark:from-neutral-900 dark:to-neutral-950 dark:shadow-[0_0_48px_-12px_rgba(34,211,238,0.2)]"
                  : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60"
              )}
            >
              {tier.featured && tier.badge && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <span className="rounded-full bg-sky-400 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-950 shadow-sm">
                    {tier.badge}
                  </span>
                </div>
              )}

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                {tier.label}
              </p>
              <p
                className={cn(
                  "mt-4 font-bold tracking-tight text-neutral-900 dark:text-neutral-50",
                  "text-4xl md:text-5xl"
                )}
              >
                {tier.price}
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {tier.subline}
              </p>

              <ul className="mt-8 flex-1 space-y-4">
                {tier.features.map((line) => (
                  <li key={line} className="flex gap-3 text-left text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40">
                      <IconCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {tier.cta.style === "primary" ? (
                  <Link
                    href={`${CONSTANTS.LEAD_AGENT_APP_URL}?plan=${tier.id}`}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-sm font-bold transition",
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
                    href={`${CONSTANTS.LEAD_AGENT_APP_URL}?plan=${tier.id}`}
                    variant="secondary"
                    className={cn(
                      "w-full border border-neutral-300 bg-transparent font-bold",
                      "text-neutral-900 hover:bg-neutral-100",
                      "dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    {tier.cta.label}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
