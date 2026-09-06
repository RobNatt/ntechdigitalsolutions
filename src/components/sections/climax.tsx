"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT } from "@/lib/motion";

/*
 * The climax CTA — and the end of the current.
 *
 * The charge that runs down the spine in chapter three carries into this
 * section, trails all the way down the centre line behind the type, and lands
 * in the CTA. The trail then fades out and the button holds a double-beat
 * pulse: the energy is no longer in the wire, it's in the button.
 *
 * That's why this rather than a fifth unrelated effect — the page reads as one
 * system with a destination, and the thing the visitor is asked to click is
 * literally where the system terminates.
 *
 * Centred on purpose. The current runs down the centre line in chapter three,
 * so the landing has to sit under it or the connection doesn't read.
 *
 * No form. The sales motion is a walk-in with the site already built — this
 * page survives the look-up, it doesn't farm leads.
 *
 * The copy below is Rob's, from homepage-copy.md, and is no longer
 * placeholder. Nothing here claims a client, a result, or a testimonial,
 * and nothing may until there are clients to name — the terms page commits
 * to guaranteeing the work rather than the outcome, and this section is
 * where a page like this usually breaks that.
 */

const COPY = {
  overline: "Ready when you are",
  heading: "Let's get your whole digital office running.",
  sub: "Fifteen minutes on the phone. No pressure, nothing to sign today.",
  primaryCta: "Book a Call",
  secondary: "Not ready yet? Email hello@ntechdigitalsolutions.com",
} as const;

export function Climax() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const [arrived, setArrived] = useState(reduce);

  // The trail has to reach the button exactly, so measure the gap rather than
  // guessing a height. Re-measured on resize because the heading rewraps.
  const [trailHeight, setTrailHeight] = useState(0);
  useEffect(() => {
    const measure = () => {
      const section = ref.current;
      const cta = ctaRef.current;
      if (!section || !cta) return;
      const top = section.getBoundingClientRect().top;
      const target = cta.getBoundingClientRect().top;
      setTrailHeight(Math.max(0, target - top));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

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
          animate={{ opacity: arrived ? 0.95 : 0.5 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-[-45%] mx-auto h-[110vh] w-[110vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.26),transparent_60%)] blur-[110px]"
        />
      </div>

      {/* The pool the trail vanishes into. Sits ABOVE the trail and BELOW the
          type, so the current visibly slips behind the copy and is lost. Soft
          and elliptical so it reads as depth, not a rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[18%] -z-[5] mx-auto h-[42%] w-[min(880px,90%)] rounded-[50%] bg-[radial-gradient(ellipse,rgba(12,10,9,0.97)_35%,rgba(12,10,9,0.75)_60%,transparent_78%)] blur-2xl"
      />

      {/* The trail. Runs the full distance from the section top to the button,
          behind the type, then fades once the charge has landed — the energy is
          in the button now, not in the wire. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: arrived ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ height: trailHeight }}
        className="pointer-events-none absolute left-1/2 top-0 -z-[6] w-px -translate-x-1/2"
      >
        <span className="absolute inset-0 bg-border" />
        <motion.span
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-cta/20 via-cta/70 to-cta"
        />
      </motion.div>

      <div className="mx-auto max-w-[1280px] pt-16">
        {/* Contrast is what actually moves the eye: the copy steps back as the
            button ignites. 0.75 is the floor — at 0.62 the sub-copy and overline
            fall to 3.59:1 and fail AA for body text. At 0.75 they hold 4.79:1.
            Never dim text past its contrast budget; dim decoration instead. */}
        <motion.div
          animate={{ opacity: arrived && !reduce ? 0.75 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        >
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
        </motion.div>

        <Reveal tier="chapter" index={3}>
          <div className="mt-16 flex flex-col items-center gap-8">
            {/* The last node. Every layer animates opacity and scale only — an
                animated box-shadow is a paint property, outside the motion
                rules, and it composites badly on a phone. */}
            <motion.span
              ref={ctaRef}
              className="relative inline-flex isolate"
              initial={false}
              animate={
                arrived && !reduce
                  ? { scale: [1, 1.07, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.55, ease: EASE_OUT, times: [0, 0.35, 1] }}
            >
              {/* Ignition flash — short, hard, and brighter than anything else
                  on the page for a quarter second. This is the thing that pulls
                  the eye; the sustained glow only keeps it there. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  arrived && !reduce
                    ? { opacity: [0, 1, 0], scale: [0.6, 1.5, 1.8] }
                    : { opacity: 0, scale: 0.6 }
                }
                transition={{ duration: 0.5, ease: "easeOut", times: [0, 0.25, 1] }}
                className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,214,140,0.95),rgba(217,119,6,0.6)_45%,transparent_70%)] blur-2xl"
              />
              {/* Outer bloom — the wide field. Double-beat once charged. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  reduce
                    ? { opacity: arrived ? 0.7 : 0, scale: 1 }
                    : arrived
                      ? {
                          opacity: [0.55, 1, 0.7, 1, 0.55],
                          scale: [1, 1.12, 1.04, 1.12, 1],
                        }
                      : { opacity: 0, scale: 0.8 }
                }
                transition={
                  reduce || !arrived
                    ? { duration: 0.4 }
                    : {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.9,
                      }
                }
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.7),transparent_70%)] blur-3xl"
              />

              {/* Core halo — the swell on arrival, then it holds hot. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                  arrived
                    ? { opacity: [0, 1, 0.95], scale: [0.8, 1.25, 1] }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.9, ease: EASE_OUT, times: [0, 0.45, 1] }
                }
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.95),transparent_68%)] blur-2xl"
              />

              {/* Two shockwave rings, offset — the charge arriving with weight. */}
              {[0, 0.18].map((delay) => (
                <motion.span
                  key={delay}
                  aria-hidden="true"
                  initial={false}
                  animate={
                    arrived && !reduce
                      ? { opacity: [0.9, 0], scale: [0.9, 2.1] }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ duration: 1, ease: "easeOut", delay }}
                  className="pointer-events-none absolute -inset-2 -z-10 rounded-md border border-cta"
                />
              ))}

              <a
                href="/book-a-call"
                className="group relative inline-flex items-center justify-center gap-2 rounded-md bg-cta px-10 py-5 text-body-lg font-medium text-on-cta transition-transform duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.primaryCta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
            </motion.span>

            <a
              href="mailto:hello@ntechdigitalsolutions.com"
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
