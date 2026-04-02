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
    packageLabel: "Package 1",
    nameLine: "Starter: The Foundation",
    price: "$997",
    subline: "One-time build + $149/mo maintenance",
    description:
      "Your business deserves a website that actually works for you. We design and build a fast, professional, SEO-optimized site that puts you on the map and starts converting visitors into contacts — day one.",
    featured: false,
    cta: { label: "Get Started", style: "outline" as const },
    features: [
      "5-page custom website (Home, About, Services, Contact + 1 custom page)",
      "Mobile-first responsive design",
      "On-page SEO setup (meta tags, schema, sitemap, robots.txt)",
      "Google Search Console + Bing Webmaster submission",
      "Contact form connected to your email",
      "Google Analytics setup",
      "WordPress CMS with full training so you can manage it yourself",
      "14-day delivery guarantee",
    ],
    bestFor:
      "Small businesses with no web presence, or ones with an outdated site that's costing them customers.",
  },
  {
    id: "growth",
    packageLabel: "Package 2",
    nameLine: "Growth: The Lead Machine",
    price: "$2,497",
    subline: "One-time build + $299/mo system management",
    description:
      "A website alone doesn't grow your business — a system does. We build your site and layer a complete lead capture and follow-up system on top of it, so every visitor who shows interest gets tracked, contacted, and nurtured automatically.",
    featured: true,
    badge: "Most popular",
    cta: { label: "Book a Call →", style: "primary" as const },
    features: [
      "Everything in The Foundation",
      "Custom lead funnel + dedicated landing page built to convert",
      "Lead capture forms with automated email follow-up sequences",
      "CRM setup and pipeline configuration",
      "Lead tracking dashboard so you see every inquiry and its status",
      "Google Business Profile optimization",
      "Local SEO targeting for your city and service area",
      "Monthly performance report (traffic, leads, conversions)",
      "Conversion rate review every 90 days",
    ],
    bestFor:
      "Business owners who are getting some traffic but losing leads because there's no system to catch and follow up with them.",
  },
  {
    id: "pro",
    packageLabel: "Package 3",
    nameLine: "Pro: The Full Growth System",
    price: "$4,997",
    subline: "One-time build + $499/mo full management",
    description:
      "This is the complete N-Tech system — website, lead funnel, automation, SEO content, and ongoing optimization all working together. You focus on closing deals and delivering your service. We handle everything that brings the leads to your door.",
    featured: false,
    cta: { label: "Contact Sales", style: "outline" as const },
    features: [
      "Everything in The Lead Machine",
      "Multi-page lead funnel with A/B tested variations",
      "Automated lead qualification and scoring system",
      "SMS + email follow-up sequences (multi-touch)",
      "Monthly SEO content (2 blog posts or location pages targeting your keywords)",
      "Ongoing Google + Bing search console monitoring",
      "Quarterly landing page refresh based on conversion data",
      "Priority support and development (48hr response)",
      "Dedicated account manager",
      "Monthly strategy call",
    ],
    bestFor:
      "Business owners ready to treat their marketing like an asset — one that compounds over time and consistently fills their pipeline without them chasing leads manually.",
  },
] as const;

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative isolate w-full overflow-hidden bg-white py-12 sm:py-16 dark:bg-neutral-950"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-100">
            Simple pricing. Serious results.
          </h2>
          <p className="mt-2 text-sm leading-snug text-neutral-600 sm:text-base dark:text-neutral-400">
            Transparent packages for small businesses. No hidden fees.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-3 lg:gap-5">
          {TIERS.map((tier) => (
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
                <span className="text-neutral-400 dark:text-neutral-500">
                  {tier.packageLabel}
                </span>
                <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">
                  ·
                </span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {tier.nameLine}
                </span>
              </p>
              <p
                className={cn(
                  "mt-3 font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50",
                  "text-3xl md:text-4xl"
                )}
              >
                {tier.price}
              </p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {tier.subline}
              </p>
              <p className="mt-3 text-xs leading-snug text-neutral-600 sm:text-[13px] sm:leading-snug dark:text-neutral-400">
                {tier.description}
              </p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                What&apos;s included
              </p>
              <ul className="mt-2 flex-1 space-y-2">
                {tier.features.map((line) => (
                  <li key={line} className="flex gap-2 text-left text-[13px] leading-snug">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/35">
                      <IconCheck className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {line}
                    </span>
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
                    href={`${CONSTANTS.LEAD_AGENT_APP_URL}?plan=${tier.id}`}
                    className={cn(
                      "btn-primary flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-bold transition",
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
          ))}
        </div>
      </div>
    </section>
  );
}
