"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { DURATION, EASE_OUT } from "@/lib/motion";

/*
 * Chapter 2: the journey.
 *
 * This is the Apple-product-demo move, and the reason the page stops feeling
 * like a template. The left column pins while the right column scrolls, and the
 * pinned panel advances as each step comes into view — so scrolling drives a
 * sequence rather than just revealing more copy.
 *
 * Motion rules still hold: transform and opacity only, entrances under 600ms,
 * and under reduced motion the panel stops swapping and every step is simply
 * present and readable.
 *
 * ALL COPY IS PLACEHOLDER.
 */

const COPY = {
  overline: "Chapter two",
  heading: "Placeholder heading for how it actually works",
  steps: [
    {
      n: "01",
      title: "Placeholder — it catches the call",
      body: "Placeholder body copy explaining the first move in plain language, the way you'd say it standing in someone's shop.",
      stat: "4 sec",
      statLabel: "Placeholder metric label",
    },
    {
      n: "02",
      title: "Placeholder — it answers like you would",
      body: "Placeholder body copy for the second step. Concrete about what the person on the other end experiences.",
      stat: "24/7",
      statLabel: "Placeholder metric label",
    },
    {
      n: "03",
      title: "Placeholder — it books the work",
      body: "Placeholder body copy for the third step, ending on the outcome rather than the mechanism.",
      stat: "0",
      statLabel: "Placeholder metric label",
    },
  ],
} as const;

export function Journey() {
  const reduce = useReducedMotion();
  const stepsRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const step = COPY.steps[active];

  // Derived from scroll position, not from viewport-enter events. Enter events
  // fire once per entry and don't reverse, so scrolling back up left the panel
  // stranded on the last step — and jumping the scrollbar fired all three at
  // once. Progress is deterministic in both directions.
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const last = COPY.steps.length - 1;
    const i = Math.min(last, Math.max(0, Math.floor(p * COPY.steps.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="surface-dark grain relative isolate px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      {/* The bloom is clipped by THIS wrapper, not by the section. Putting
          overflow-hidden on the section made it the scroll container for the
          sticky panel below, so the panel never stuck. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_62%)] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1280px]">
        <Reveal tier="chapter" index={0}>
          <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
            <span aria-hidden="true" className="h-px w-12 bg-cta" />
            {COPY.overline}
          </p>
        </Reveal>
        <Reveal tier="chapter" index={1}>
          <h2
            id="journey-heading"
            className="mt-8 max-w-[16ch] text-h1 text-balance font-heading text-foreground"
          >
            {COPY.heading}
          </h2>
        </Reveal>

        <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Pinned panel. Advances as the steps on the right come into view. */}
          {/* NO self-start / self-* here. A sticky element travels only within its
              parent's box, and self-start shrinks the grid item to content
              height — leaving nowhere to stick. It must stretch to the full
              row height, which is the grid default. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-[20px] backdrop-saturate-150 md:p-12">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={reduce ? "static" : active}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
                  >
                    <span
                      aria-hidden="true"
                      className="select-none font-heading text-h1 leading-none text-transparent"
                      style={{ WebkitTextStroke: "1px var(--cta)" }}
                    >
                      {step.n}
                    </span>
                    <p className="mt-10 font-heading text-display leading-none text-foreground">
                      {step.stat}
                    </p>
                    <p className="mt-4 text-overline uppercase text-muted-foreground">
                      {step.statLabel}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress rail — which chapter beat you're on. */}
                <div className="mt-12 flex gap-2" aria-hidden="true">
                  {COPY.steps.map((s, i) => (
                    <span
                      key={s.n}
                      className={`h-0.5 flex-1 rounded-full transition-colors duration-[180ms] ${
                        i <= active ? "bg-cta" : "bg-border-strong/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The steps. Each one takes over the pinned panel as it arrives. */}
          <ol ref={stepsRef} className="lg:col-span-6 lg:col-start-7">
            {COPY.steps.map(({ n, title, body }) => (
              <li
                key={n}
                // each step occupies most of a viewport so the panel stays pinned
                // long enough to read as pinned. Without this the column is
                // shorter than the travel needed and it releases immediately.
                className="flex flex-col justify-center border-t border-border py-16 first:border-t-0 first:pt-0 lg:min-h-[70vh] lg:py-0" 
              >
                <Reveal tier="reveal" index={0}>
                  <p className="text-overline uppercase text-cta">{n}</p>
                  <h3 className="mt-6 text-h2 font-heading text-foreground">
                    {title}
                  </h3>
                  <p className="mt-6 max-w-[48ch] text-body-lg text-muted-foreground">
                    {body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
