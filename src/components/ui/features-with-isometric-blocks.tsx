"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const FEATURES = [
  {
    id: 1,
    title: "Starter: The Foundation",
    description:
      "A fast, professional, SEO-optimized site that puts you on the map — WordPress CMS with full training and a 14-day delivery guarantee.",
    bullets: [
      "5-page custom website (Home, About, Services, Contact + 1 custom page)",
      "Mobile-first responsive design",
      "On-page SEO setup (meta tags, schema, sitemap, robots.txt)",
      "Google Search Console + Bing Webmaster submission",
      "Contact form to your email, Google Analytics, WordPress with full training",
    ],
    variant: "left" as const,
  },
  {
    id: 2,
    title: "Growth: The Lead Machine",
    description:
      "Your site plus a complete lead capture and follow-up system — every interested visitor gets tracked, contacted, and nurtured automatically.",
    bullets: [
      "Custom lead funnel + dedicated landing page built to convert",
      "Lead capture forms with automated email follow-up sequences",
      "CRM setup, pipeline configuration, and lead tracking dashboard",
      "Google Business Profile and organic search visibility for your markets",
      "Monthly performance report (traffic, leads, conversions) + conversion review every 90 days",
    ],
    variant: "right" as const,
  },
  {
    id: 3,
    title: "Pro: The Full Growth System",
    description:
      "Website, funnel, automation, SEO content, and ongoing optimization in one system — you close deals; we run what fills the pipeline.",
    bullets: [
      "Multi-page lead funnel with A/B tested variations",
      "Automated lead qualification and scoring + SMS & email follow-up (multi-touch)",
      "Monthly SEO content (2 blog posts or topic/service pages for your keywords)",
      "Ongoing Google + Bing Search Console monitoring + quarterly landing page refresh",
      "Priority support (48hr response), dedicated account manager, monthly strategy call",
    ],
    variant: "top" as const,
  },
];

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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              id={feature.id === 2 ? "lead-machine" : undefined}
              onMouseEnter={() => setActiveId(feature.id)}
              onMouseLeave={() => setActiveId(null)}
              className={cn(
                "relative flex scroll-mt-24 flex-col px-0 md:px-8",
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
      </div>
    </section>
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
