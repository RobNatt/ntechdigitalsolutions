"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, Check, CheckCircle2, PhoneCall } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { cn } from "@/lib/utils";

const VIEW_WORK_PATH = "/infrastructure";

const HERO_TRUST_POINTS = [
  "AI receptionist included",
  "CRM + lead automation",
  "Social media managed",
  "Nebraska-based",
  "One flat monthly retainer",
] as const;

export function HomeHeroBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const trustLoop = reduceMotion ? [...HERO_TRUST_POINTS] : [...HERO_TRUST_POINTS, ...HERO_TRUST_POINTS];

  return (
    <section
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 px-4 py-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 md:px-8 md:py-40"
    >
      <BackgroundGrids />

      <p className="relative z-50 mx-auto mb-2 max-w-4xl text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        N-Tech Digital Solutions
      </p>
      <h1 className="relative z-50 mx-auto mt-2 mb-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
        <Balancer>Stop Leaking Leads to Missed Calls and Slow Follow-Up</Balancer>
      </h1>
      <p className="relative z-50 mx-auto mt-4 max-w-2xl px-4 text-center text-base/relaxed text-gray-600 md:text-lg dark:text-neutral-300">
        One connected system for local service businesses: website, AI receptionist, lead automation,
        social media management, and Google review automation — all under one flat monthly retainer.
      </p>

      <HeroLoadInPreview />

      <div
        id="offer-path"
        className="relative z-50 mt-8 mb-5 flex w-full max-w-xl flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:flex-wrap"
      >
        <ScheduleCtaLink className="group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-center text-sm font-semibold leading-6 text-white no-underline shadow-sm transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:w-56">
          Book a Call
          <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        </ScheduleCtaLink>
        <Link
          href={VIEW_WORK_PATH}
          className="shadow-input group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center rounded-full border-2 border-neutral-900 bg-white px-4 py-2 text-sm font-semibold leading-6 text-neutral-900 no-underline transition hover:-translate-y-0.5 dark:border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 sm:w-56"
        >
          See the System
        </Link>
      </div>

      <nav
        ref={containerRef}
        aria-label="Trust highlights"
        className="relative z-50 mx-auto mb-12 w-full max-w-4xl px-4 md:mb-20"
      >
        <ul className="sr-only">
          {HERO_TRUST_POINTS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <div
          aria-hidden
          className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/70 py-2.5 shadow-sm backdrop-blur-sm dark:border-neutral-700/90 dark:bg-neutral-900/60"
        >
          <div
            className={cn(
              "flex items-center gap-0",
              reduceMotion
                ? "w-full max-w-full flex-wrap justify-center gap-x-4 gap-y-2 py-1"
                : "animate-trust-marquee w-max pr-8 md:pr-12",
            )}
          >
            {trustLoop.map((label, i) => (
              <span
                key={reduceMotion ? label : `${label}-${i}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-neutral-700 sm:text-sm dark:text-neutral-200",
                  reduceMotion ? "px-1" : "pl-6 sm:pl-8 md:pl-10",
                )}
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-white"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className="whitespace-nowrap">{label}</span>
                {!reduceMotion ? (
                  <span
                    className="pl-4 text-neutral-300 select-none sm:pl-6 dark:text-neutral-600"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : i < trustLoop.length - 1 ? (
                  <span
                    className="pl-2 text-neutral-300 select-none dark:text-neutral-600"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </section>
  );
}

/**
 * Plays once on page load only (CSS animation-fill-mode: forwards, no repeat/loop) — a ~1s
 * preview of "Call Now" connecting to the AI receptionist before the visitor scrolls further.
 */
const HeroLoadInPreview = () => {
  return (
    <div
      className="relative z-50 mt-6 flex items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400"
      aria-hidden
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
        <PhoneCall className="h-4 w-4" />
      </span>
      <svg width="48" height="16" viewBox="0 0 48 16" className="overflow-visible">
        <line
          x1="2"
          y1="8"
          x2="46"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="60"
          className="hero-loadin-line text-neutral-900 dark:text-white"
        />
      </svg>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
        <Bot className="h-4 w-4" />
        <CheckCircle2
          className="hero-loadin-badge absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-white text-neutral-900 opacity-0 dark:bg-neutral-950 dark:text-white"
        />
      </span>
    </div>
  );
};

const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-neutral-100 to-transparent dark:via-neutral-800">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
    </div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
};
