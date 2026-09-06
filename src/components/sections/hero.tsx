"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { EASE_IN_OUT } from "@/lib/motion";

/*
 * Hero — chapter 0 of the scroll story: the intro hook.
 *
 * Its one job is to make the visitor want to keep scrolling. It does not try
 * to explain the offer; that's what the chapters below it are for. So the
 * close is a scroll cue, not a hard sell.
 *
 * ALL COPY BELOW IS PLACEHOLDER. It is deliberately written to claim nothing
 * that isn't true — no client counts, no results, no testimonials — because
 * the design system forbids that and there are no clients yet. Swap the words,
 * keep the shape.
 */

const COPY = {
  overline: "Omaha, Nebraska",
  headline: "Placeholder headline that earns the next scroll",
  sub: "Placeholder subheading. Two lines at most, saying plainly what this is and who it is for, in the register a real person would use out loud.",
  primaryCta: "Placeholder CTA",
  secondaryCta: "Secondary action",
  cue: "Keep scrolling",
} as const;

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Tier 4 parallax, decorative layer only — never text, never controls.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      {/* Decorative only, hidden from assistive tech. Transform-only parallax. */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
      >
        {/* Glass needs something behind it or the translucency is invisible on a
            near-white ground. These are the refraction subject. Palette only:
            gold is --cta, warm dark is --primary. */}
        <div className="absolute left-[8%] top-[-15%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(161,98,7,0.28),transparent_62%)] blur-3xl" />
        <div className="absolute right-[-12%] top-[8%] h-[65vh] w-[65vh] rounded-full bg-[radial-gradient(circle,rgba(28,25,23,0.20),transparent_66%)] blur-3xl" />
        <div className="absolute bottom-[-25%] left-[35%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(120,113,108,0.22),transparent_68%)] blur-3xl" />
      </motion.div>

      <div className="mx-auto max-w-[1280px]">
        {/* The glass panel — the one place translucency is used. */}
        <div className="mx-auto max-w-[68ch] rounded-lg border border-white/50 bg-white/70 p-8 shadow-glass backdrop-blur-[20px] backdrop-saturate-[1.8] md:p-12 lg:p-16">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <p className="text-overline uppercase text-muted-foreground">
              {COPY.overline}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1
              id="hero-heading"
              className="mt-6 text-display text-balance font-heading text-foreground"
            >
              {COPY.headline}
            </h1>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[60ch] text-body-lg text-muted-foreground">
              {COPY.sub}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={3}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta shadow-sm transition-[transform,box-shadow,background-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.primaryCta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </a>

              <a
                href="#solutions"
                className="inline-flex items-center justify-center rounded-md border border-border-strong px-8 py-4 text-body font-medium text-foreground transition-[transform,background-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.secondaryCta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Scroll cue — the actual hook into the next chapter. */}
        <Reveal trigger="mount" tier="reveal" index={4} className="mt-16 flex justify-center">
          <a
            href="#solutions"
            className="group inline-flex flex-col items-center gap-2 rounded-md px-4 py-2 text-small text-muted-foreground transition-colors duration-[180ms] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {COPY.cue}
            <motion.span
              aria-hidden="true"
              animate={reduce ? undefined : { y: [0, 5, 0] }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 1.8,
                      ease: EASE_IN_OUT,
                      repeat: Infinity,
                      repeatDelay: 0.4,
                    }
              }
            >
              <ChevronDown className="size-5" />
            </motion.span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
