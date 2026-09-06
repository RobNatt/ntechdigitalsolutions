"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT } from "@/lib/motion";

/*
 * The climax CTA — and the end of the current.
 *
 * The charge that runs down the spine in chapter three doesn't stop there. It
 * carries into this section, travels down the same centre line, and lands in
 * the CTA, which lights as it arrives. The button becomes the last node in the
 * infrastructure.
 *
 * That's the point of doing it this way rather than inventing a fifth unrelated
 * effect: the page reads as one system with a destination, and the thing the
 * visitor is asked to click is literally where the system terminates.
 *
 * Centred on purpose. The current runs down the centre line in chapter three,
 * so the landing has to sit under it or the connection doesn't read.
 *
 * No form. The sales motion is a walk-in with the site already built — this
 * page survives the look-up, it doesn't farm leads.
 *
 * ALL COPY IS PLACEHOLDER. Nothing claims a client, a result, or a testimonial.
 */

const COPY = {
  overline: "Placeholder — closing",
  heading: "Placeholder closing line that asks for one thing",
  sub: "Placeholder supporting line. Short. It removes the last objection rather than adding a new pitch.",
  primaryCta: "Placeholder CTA",
  secondary: "Placeholder — quiet alternative",
} as const;

export function Climax() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [arrived, setArrived] = useState(reduce);

  // The current enters at the top of the section and lands on the CTA.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 15%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const next = p >= 0.92;
    setArrived((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="climax-heading"
      className="surface-dark grain relative isolate px-6 py-32 text-center md:px-12 md:py-40 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={
            reduce || !arrived ? { opacity: 0.55 } : { opacity: [0.55, 1, 0.8] }
          }
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-[-45%] mx-auto h-[110vh] w-[110vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.24),transparent_60%)] blur-[110px]"
        />
      </div>

      {/* The current arriving. Continues the centre line from chapter three. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-px -translate-x-1/2"
      >
        <span className="absolute inset-0 bg-border" />
        <motion.span
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-cta/30 to-cta"
        />
      </div>

      <div className="mx-auto max-w-[1280px] pt-16">
        <Reveal tier="chapter" index={0}>
          <p className="text-overline uppercase text-muted-foreground">
            {COPY.overline}
          </p>
        </Reveal>

        <Reveal tier="chapter" index={1}>
          <h2
            id="climax-heading"
            className="mx-auto mt-10 max-w-[16ch] text-display font-heading text-foreground"
          >
            {COPY.heading}
          </h2>
        </Reveal>

        <Reveal tier="chapter" index={2}>
          <p className="mx-auto mt-10 max-w-[46ch] text-body-lg text-muted-foreground">
            {COPY.sub}
          </p>
        </Reveal>

        <Reveal tier="chapter" index={3}>
          <div className="mt-16 flex flex-col items-center gap-8">
            {/* The last node. The current lands here and the button charges.
                Every layer animates opacity and scale only — a box-shadow
                animation would be a paint property, which the motion rules
                don't allow, and this composites far better anyway. */}
            <span className="relative inline-flex isolate">
              {/* Sustained halo — swells on arrival, then holds. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  arrived
                    ? { opacity: [0, 1, 0.85], scale: [0.8, 1.2, 1] }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.9, ease: EASE_OUT, times: [0, 0.45, 1] }
                }
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.75),transparent_70%)] blur-2xl"
              />

              {/* One-shot shockwave — the charge actually arriving. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  arrived && !reduce
                    ? { opacity: [0.85, 0], scale: [0.9, 1.9] }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="pointer-events-none absolute -inset-2 -z-10 rounded-md border border-cta"
              />

              {/* Afterglow — it keeps shining once charged. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  arrived && !reduce
                    ? { opacity: [0.45, 0.95, 0.45] }
                    : { opacity: arrived ? 0.5 : 0 }
                }
                transition={
                  arrived && !reduce
                    ? {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.9,
                      }
                    : { duration: 0.3 }
                }
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.55),transparent_72%)] blur-xl"
              />

              <a
                href="#contact"
                className="group relative inline-flex items-center justify-center gap-2 rounded-md bg-cta px-10 py-5 text-body-lg font-medium text-on-cta transition-transform duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.primaryCta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
            </span>

            <a
              href="#problem"
              className="text-body text-muted-foreground underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {COPY.secondary}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
