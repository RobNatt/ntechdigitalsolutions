"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, CalendarCheck, MessageSquare, PhoneMissed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";

/*
 * Hero — chapter 0: the intro hook.
 *
 * Deliberately NOT a centred card. The first build was one, and it read as a
 * template. This is asymmetric: type holds the left seven columns, and a
 * product artifact sits in the right five, offset downward so the two columns
 * never share a baseline.
 *
 * The artifact is the point. A site selling an AI receptionist has to SHOW a
 * missed call being caught, not describe it. That is the difference between a
 * page about a product and a page that demonstrates one.
 *
 * ALL COPY IS PLACEHOLDER and claims nothing that isn't true — no client
 * counts, no results, no testimonials.
 */

interface Step {
  icon: LucideIcon;
  label: string;
  detail: string;
  time: string;
  live?: boolean;
}

const STEPS: Step[] = [
  {
    icon: PhoneMissed,
    label: "Missed call",
    detail: "Placeholder — rings out while you're on a job",
    time: "2:14pm",
  },
  {
    icon: MessageSquare,
    label: "Text sent back",
    detail: "Placeholder — automatic reply, four seconds later",
    time: "2:14pm",
  },
  {
    icon: CalendarCheck,
    label: "Booked",
    detail: "Placeholder — slot taken without you touching it",
    time: "2:21pm",
    live: true,
  },
];

const COPY = {
  overline: "Omaha, Nebraska",
  headlineA: "Placeholder line one",
  headlineB: "that earns the scroll",
  sub: "Placeholder subheading — two lines at most, plain about what this is and who it's for, in the register a real person uses out loud.",
  primaryCta: "Placeholder CTA",
  secondaryCta: "See how it works",
} as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Decorative layers only. Never text, never controls.
  const bloomY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="surface-dark grain relative isolate flex min-h-screen items-center overflow-hidden px-6 py-24 md:px-12 lg:px-20"
    >
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: bloomY }}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
      >
        <div className="absolute left-[-10%] top-[-20%] h-[95vh] w-[95vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.20),transparent_60%)] blur-[100px]" />
        <div className="absolute right-[-15%] top-[10%] h-[75vh] w-[75vh] rounded-full bg-[radial-gradient(circle,rgba(120,113,108,0.16),transparent_62%)] blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(to_top,rgba(12,10,9,0.95),transparent)]" />
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Type column — seven of twelve, never centred. */}
        <div className="lg:col-span-7">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              {COPY.overline}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1
              id="hero-heading"
              className="mt-8 text-display font-heading text-foreground"
            >
              {COPY.headlineA}
              <span className="block text-muted-foreground">
                {COPY.headlineB}
              </span>
            </h1>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-8 max-w-[52ch] text-body-lg text-muted-foreground">
              {COPY.sub}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={3}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.primaryCta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-md border border-border-strong px-8 py-4 text-body font-medium text-foreground transition-[transform,background-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.secondaryCta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Artifact column — five of twelve, pushed down so the columns don't
            share a baseline. The product actually doing something. */}
        <motion.div
          style={reduce ? undefined : { y: artY }}
          className="lg:col-span-5 lg:translate-y-12"
        >
          <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-[20px] backdrop-saturate-150">
            <div className="flex items-center justify-between px-3 pb-4 pt-2">
              <span className="text-overline uppercase text-muted-foreground">
                Placeholder — live
              </span>
              <span
                aria-hidden="true"
                className="flex size-2 rounded-full bg-cta"
              />
            </div>

            <ul className="space-y-3">
              {STEPS.map(({ icon: Icon, label, detail, time, live }, i) => (
                <motion.li
                  key={label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: DURATION.reveal,
                    ease: EASE_OUT,
                    // continues the left column's stagger so the whole hero
                    // reads as one motion, not two competing ones
                    delay: reduce ? 0 : (i + 4) * STAGGER,
                  }}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md ${
                      live
                        ? "bg-cta text-on-cta"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-body font-medium text-card-foreground">
                        {label}
                      </span>
                      <span className="shrink-0 text-small text-muted-foreground">
                        {time}
                      </span>
                    </span>
                    <span className="mt-1 block text-small text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
