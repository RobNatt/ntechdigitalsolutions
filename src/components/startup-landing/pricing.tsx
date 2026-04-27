"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const TIERS = [
  {
    id: "foundation",
    packageLabel: "Package 1",
    nameLine: "Foundation",
    price: "$4,000",
    description:
      "A professional, fast site with SEO fundamentals and analytics — so you launch with credibility and a clear path to being found online.",
  },
  {
    id: "lead-machine",
    packageLabel: "Package 2",
    nameLine: "Lead Machine",
    price: "$7,000",
    description:
      "Everything in Foundation, plus a funnel, CRM, and follow-up so interest turns into pipeline — not lost tabs and voicemail.",
    featured: true,
  },
  {
    id: "complete-system",
    packageLabel: "Package 3",
    nameLine: "Growth System",
    price: "$12,000",
    description:
      "Full-stack growth: qualification, SMS + email sequences, content, and ongoing optimization so your funnel keeps compounding.",
  },
  {
    id: "premium-growth-partner",
    packageLabel: "Package 4",
    nameLine: "Premium Growth Partner",
    price: "$20,000",
    description:
      "Our highest-touch partnership: faster execution, more testing and content, and deeper strategy — for teams who want us operating as an extension of theirs.",
  },
] as const;

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

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {TIERS.map((tier) => {
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex h-full flex-col rounded-xl border p-4 sm:p-5",
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
                    "mt-2 font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50",
                    "text-2xl"
                  )}
                >
                  {tier.price}
                </p>
                <p className="mt-3 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
                  {tier.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
