"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * The climax CTA. Full-bleed dark, one instruction, nothing competing with it.
 *
 * Deliberately no form here. The sales motion is a walk-in with a finished site
 * already built — this page's job is to survive the look-up afterwards, not to
 * capture leads it was never going to get. One primary action, one quiet
 * alternative.
 *
 * ALL COPY IS PLACEHOLDER. Nothing here claims a client, a result, or a
 * testimonial, because there aren't any yet.
 */

const COPY = {
  overline: "Placeholder — closing",
  heading: "Placeholder closing line that asks for one thing",
  sub: "Placeholder supporting line. Short. It removes the last objection rather than adding a new pitch.",
  primaryCta: "Placeholder CTA",
  secondary: "Placeholder — quiet alternative",
} as const;

export function Climax() {
  return (
    <section
      id="contact"
      aria-labelledby="climax-heading"
      className="surface-dark grain relative isolate overflow-hidden px-6 py-32 md:px-12 md:py-40 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-40%] -z-10 mx-auto h-[110vh] w-[110vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.22),transparent_60%)] blur-[110px]"
      />

      <div className="mx-auto max-w-[1280px]">
        <Reveal tier="chapter" index={0}>
          <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
            <span aria-hidden="true" className="h-px w-12 bg-cta" />
            {COPY.overline}
          </p>
        </Reveal>

        <Reveal tier="chapter" index={1}>
          <h2
            id="climax-heading"
            className="mt-10 max-w-[14ch] text-display font-heading text-foreground"
          >
            {COPY.heading}
          </h2>
        </Reveal>

        <Reveal tier="chapter" index={2}>
          <p className="mt-10 max-w-[46ch] text-body-lg text-muted-foreground">
            {COPY.sub}
          </p>
        </Reveal>

        <Reveal tier="chapter" index={3}>
          <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-10 py-5 text-body-lg font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {COPY.primaryCta}
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
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
