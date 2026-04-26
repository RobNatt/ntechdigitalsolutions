"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Check, Globe2, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSTANTS } from "@/constants/links";
import { motion } from "motion/react";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const FEATURES = [
  {
    id: 1,
    title: "Phase 1 — Build the foundation",
    description:
      "A fast, professional site is your handshake. Without it, everything else fails. Most local businesses lose prospects in 8 seconds.",
    bullets: ["Speed", "Mobile-first", "Clear CTA"],
    variant: "left" as const,
  },
  {
    id: 2,
    title: "Phase 2 — Get found (SEO + GEO)",
    description:
      "Your website means nothing if no one lands on it. Organic visibility — in Google Search and AI answer engines — is how you get consistent, free traffic. This is the multiplier.",
    bullets: ["Google Business", "GEO / AI search", "Local rankings"],
    variant: "right" as const,
  },
] as const;

const LEAD_MACHINE_INCLUDES = [
  "5-page custom website build",
  "CRM setup + pipeline dashboard",
  "Google Business Profile optimization",
  "AI-powered lead qualification",
  "On-page SEO (all 5 pages)",
  "SMS + email follow-up sequences",
  "GEO / AI search visibility setup",
  "Monthly performance reports",
  "Lead training dashboard access",
  "30-day post-launch optimization",
] as const;

export default function FeaturesWithIsometricBlocks() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const isActive = (id: number) => activeId === id;

  return (
    <section
      id="features"
      className="relative isolate w-full overflow-hidden bg-white py-20 md:py-24 dark:bg-neutral-950"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-14 text-center md:mb-16">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl dark:text-neutral-100">
            Everything you need to turn traffic into qualified leads.
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
            Three transparent packages — from a solid web foundation to lead
            systems and full ongoing growth. Same scope you&apos;ll see in
            pricing, laid out here in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              onMouseEnter={() => setActiveId(feature.id)}
              onMouseLeave={() => setActiveId(null)}
              className={cn(
                "relative flex flex-col px-0 md:px-8",
                "md:border-r md:border-neutral-200 dark:md:border-neutral-800",
                index === FEATURES.length - 1 && "md:border-r-0"
              )}
            >
              <div
                className={cn(
                  "relative cursor-pointer rounded-2xl p-6 transition-all duration-200",
                  isActive(feature.id)
                    ? "bg-neutral-50 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900/80 dark:ring-neutral-700"
                    : "hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40"
                )}
              >
                <div className="mb-5 flex justify-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 shadow-inner dark:border-neutral-700 dark:bg-neutral-900/80">
                    <IsometricBox
                      className="size-36"
                      variant={feature.variant}
                      isActive={isActive(feature.id)}
                    />
                  </div>
                </div>

                <h3 className="mb-3 text-center text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {feature.title}
                </h3>
                <p className="mb-5 text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
                <ul className="space-y-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300">
                  {feature.bullets.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <LeadMachineOfferSection />
      </div>
    </section>
  );
}

function LeadMachineOfferSection() {
  return (
    <div
      id="lead-machine"
      className="scroll-mt-24 mt-20 border-t border-neutral-200 pt-16 md:mt-24 md:pt-20 dark:border-neutral-800"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
        The Lead Machine — $7,000
      </p>
      <h2 className="mx-auto mt-3 max-w-3xl text-center text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl dark:text-neutral-100">
        A complete system that turns your website into a lead engine.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
        Built for Omaha businesses that are done waiting on referrals. The Lead Machine combines a
        high-converting website, local SEO, and AI-powered lead capture into one fully managed system.
      </p>

      <div className="mx-auto mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
        <h3 className="text-3xl font-bold tabular-nums text-neutral-900 md:text-4xl dark:text-neutral-50">
          $7,000
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          one-time setup · system is yours to keep.
        </p>
      </div>

      <hr className="mx-auto my-10 max-w-2xl border-neutral-200 dark:border-neutral-700" />

      <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
        What&apos;s included — 3 pillar breakdown
      </p>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
        <PillarCard
          icon={<LayoutTemplate className="size-6" aria-hidden />}
          title="High-converting website"
          body="Custom-built on WordPress. Fast, mobile-first, with clear calls to action and a contact funnel designed to convert visitors — not just impress them."
          layer="Foundation layer"
        />
        <PillarCard
          icon={<Globe2 className="size-6" aria-hidden />}
          title="Local SEO + GEO setup"
          body="Google Business Profile optimization, on-page SEO, and AI search visibility — so you rank where your customers are actually looking, including ChatGPT and Gemini."
          layer="Visibility layer"
        />
        <PillarCard
          icon={<Bot className="size-6" aria-hidden />}
          title="AI lead capture + CRM"
          body="Automated lead qualification, SMS and email follow-up sequences, and a pipeline dashboard — so every lead is tracked and followed up within seconds, not days."
          layer="Conversion layer"
        />
      </div>

      <hr className="mx-auto my-12 max-w-2xl border-neutral-200 dark:border-neutral-700" />

      <div className="mx-auto max-w-2xl">
        <TimelinePhase
          title="Week 1 — Discovery + strategy"
          body="We audit your current presence, map your local competitors, and define your lead capture funnel before writing a single line of code."
          foot="Kickoff call + intake form"
        />
        <TimelinePhase
          title="Weeks 2–3 — Build"
          body="Custom site built, CRM configured, lead forms wired up, SMS and email sequences written and loaded. Google Business Profile fully optimized."
          foot="You review, we revise"
        />
        <TimelinePhase
          title="Week 4 — Launch + handoff"
          body="Live launch with full testing. You get a 60-minute walkthrough of your dashboard, pipeline, and how leads flow through the system."
          foot="First leads within 30 days"
        />
        <TimelinePhase
          title="Day 30 — Performance review"
          body="We review real data together. Traffic sources, lead volume, conversion rate. Adjust and optimize. You own the system — we make sure it's working."
          foot="Monthly reports included."
          isLast
        />
      </div>

      <hr className="mx-auto my-12 max-w-2xl border-neutral-200 dark:border-neutral-700" />

      <div className="mx-auto max-w-xl">
        <h3 className="text-center text-lg font-bold text-neutral-900 md:text-xl dark:text-neutral-100">
          What you get — full includes list
        </h3>
        <ul className="mt-6 space-y-3 text-left text-sm text-neutral-700 md:text-base dark:text-neutral-300">
          {LEAD_MACHINE_INCLUDES.map((line) => (
            <li key={line} className="flex gap-3">
              <Check
                className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="mx-auto mt-14 max-w-3xl rounded-2xl border border-neutral-200 bg-neutral-50/90 px-6 py-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60 md:px-10 md:py-10">
        <blockquote className="text-center text-sm font-medium leading-relaxed text-neutral-800 md:text-base dark:text-neutral-200">
          &ldquo;Within 2 months, we went from a basic site, no online presence and no leads to having an
          impressive website that informed potential customers, ranking top 10 in every search, and getting
          regular calls and leads from our website.&rdquo;
        </blockquote>
        <figcaption className="mt-5 text-center text-xs text-neutral-600 md:text-sm dark:text-neutral-400">
          — James, Roofer and exterior contractor, Omaha NE — Lead Machine customer
        </figcaption>
      </figure>

      <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-8 rounded-2xl border border-neutral-200 bg-white px-6 py-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/50 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-10">
        <div className="min-w-0 flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-neutral-900 md:text-xl dark:text-neutral-50">
            Ready to see if the Lead Machine is right for your business?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Book a free 20-minute strategy call. We&apos;ll look at your current web presence, identify
            exactly where leads are slipping through, and show you what a system built for your business
            would look like.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
          <Link
            href={CONSTANTS.BOOK_CALL_PATH}
            className="inline-flex w-full min-w-[12rem] items-center justify-center rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 md:w-auto dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            Book a strategy call
          </Link>
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 md:text-right">
            No commitment. 20 minutes. Honest advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function PillarCard({
  icon,
  title,
  body,
  layer,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  layer: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/50 md:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-300">
        {icon}
      </div>
      <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{body}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
        {layer}
      </p>
    </div>
  );
}

function TimelinePhase({
  title,
  body,
  foot,
  isLast,
}: {
  title: string;
  body: string;
  foot: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-neutral-200 py-6 dark:border-neutral-700",
        !isLast && "border-b"
      )}
    >
      <h4 className="text-base font-bold text-neutral-900 md:text-lg dark:text-neutral-100">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{body}</p>
      <p className="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-500">{foot}</p>
    </div>
  );
}

function IsometricBox({
  className,
  variant,
  isActive,
}: {
  className?: string;
  variant: "left" | "right" | "top";
  isActive: boolean;
}) {
  const XVariants = {
    initial: { translateX: 0 },
    animate: { translateX: -20 },
  };

  const YVariants = {
    initial: { translateY: 0 },
    animate: { translateY: -20 },
  };

  const NegativeXVariants = {
    initial: { translateX: 0 },
    animate: { translateX: 20 },
  };

  const NoOpVariants = {
    initial: { translateX: 0, translateY: 0 },
    animate: { translateX: 0, translateY: 0 },
  };

  const TRANSITION = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  const getVariants = (face: "left" | "right" | "top") => {
    if (face !== variant) return NoOpVariants;
    switch (face) {
      case "left":
        return XVariants;
      case "right":
        return NegativeXVariants;
      case "top":
        return YVariants;
      default:
        return NoOpVariants;
    }
  };

  const strokeClass = isActive
    ? "stroke-sky-500"
    : "stroke-neutral-400 dark:stroke-neutral-500";

  return (
    <motion.div animate={isActive ? "animate" : "initial"} initial="initial">
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-60", className)}
      >
        <motion.path
          variants={getVariants("top")}
          transition={TRANSITION}
          d="M100 40 Q108 40 155 68 Q162 72 155 76 Q108 104 100 104 Q92 104 45 76 Q38 72 45 68 Q92 40 100 40 Z"
          className={cn(
            "fill-neutral-200 dark:fill-slate-800/90",
            strokeClass
          )}
          strokeWidth="1.5"
        />

        <motion.path
          variants={getVariants("top")}
          transition={TRANSITION}
          d="M100 52 Q105 52 132 68 Q138 72 132 76 Q105 92 100 92 Q95 92 68 76 Q62 72 68 68 Q95 52 100 52 Z"
          className={cn("fill-white dark:fill-slate-900/95", strokeClass)}
          strokeWidth="1"
        />

        <motion.path
          variants={getVariants("left")}
          transition={TRANSITION}
          d="M45 76 L100 104 L100 164 Q100 170 92 166 L45 140 Q38 136 38 128 L38 80 Q38 72 45 76 Z"
          className={cn(
            "fill-neutral-300 dark:fill-slate-900/90",
            strokeClass
          )}
          strokeWidth="1.5"
        />

        <motion.path
          variants={getVariants("right")}
          transition={TRANSITION}
          d="M155 76 L100 104 L100 164 Q100 170 108 166 L155 140 Q162 136 162 128 L162 80 Q162 72 155 76 Z"
          className={cn(
            "fill-neutral-200 dark:fill-slate-800/90",
            strokeClass
          )}
          strokeWidth="1.5"
        />

        <motion.path
          variants={getVariants("left")}
          transition={TRANSITION}
          d="M55 86 L55 145"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <motion.path
          variants={getVariants("left")}
          transition={TRANSITION}
          d="M70 95 L70 155"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <motion.path
          variants={getVariants("left")}
          transition={TRANSITION}
          d="M85 104 L85 162"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />

        <motion.path
          variants={getVariants("right")}
          transition={TRANSITION}
          d="M145 86 L145 145"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <motion.path
          variants={getVariants("right")}
          transition={TRANSITION}
          d="M130 95 L130 155"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <motion.path
          variants={getVariants("right")}
          transition={TRANSITION}
          d="M115 104 L115 162"
          className={strokeClass}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      </motion.svg>
    </motion.div>
  );
}
