"use client";

import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { SeamTrace } from "@/components/motion/seam-trace";

/*
 * Chapter 1: the problem.
 *
 * The first version was three equal icon cards in a row — the single most
 * template-shaped pattern there is. This is editorial instead: full-width rows
 * separated by hairlines, oversized outlined numerals, and a stepped indent so
 * the eye walks down the page rather than scanning a grid.
 *
 * Framing rule from the sprint notes, not optional: never lead with what is
 * wrong with the visitor's business. That was tried and read as criticism. Each
 * row describes a situation they recognise and lets them decide it applies.
 *
 * ALL COPY IS PLACEHOLDER, shaped from the UNTESTED hypotheses in
 * customers.md. No results, no statistics, no claims.
 */

const COPY = {
  overline: "Chapter one",
  heading: "Placeholder chapter heading about the situation",
  lead: "Placeholder lead. One or two sentences describing the day, not the deficiency — something the visitor nods at rather than defends against.",
  rows: [
    {
      n: "01",
      title: "Placeholder — the call that rings out",
      body: "Placeholder body copy, two or three lines, describing what happens to a call that comes in while you're already under a sink. Concrete, not abstract.",
    },
    {
      n: "02",
      title: "Placeholder — the search that finds nothing",
      body: "Placeholder body copy about what someone actually sees when they go looking for you, and what they do about ten seconds later.",
    },
    {
      n: "03",
      title: "Placeholder — the work nobody can see",
      body: "Placeholder body copy about the gap between the standard of work you do and what a stranger can verify before picking up the phone.",
    },
  ],
} as const;

export function Problem() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="problem"
      aria-labelledby="problem-heading"
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      {/* The handoff, as one element reaching back over the hero's base. See
          seam-trace.tsx for why it can't be split across the two sections. */}
      <SeamTrace target={ref} />

      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal tier="chapter" index={0}>
              <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
                <span aria-hidden="true" className="h-px w-12 bg-cta" />
                {COPY.overline}
              </p>
            </Reveal>
            <Reveal tier="chapter" index={1}>
              <h2
                id="problem-heading"
                className="mt-8 text-h1 text-balance font-heading text-foreground"
              >
                {COPY.heading}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <Reveal tier="chapter" index={2}>
              <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                {COPY.lead}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Editorial rows: hairline-separated, stepped indent, huge numerals. */}
        <ul className="mt-24 md:mt-32">
          {COPY.rows.map(({ n, title, body }, i) => (
            <Reveal
              key={n}
              as="li"
              tier="reveal"
              index={i}
              className="border-t border-border py-12 md:py-16"
            >
              <div
                className="grid gap-6 md:grid-cols-12 md:gap-12"
                style={{ paddingLeft: `calc(${i} * 4%)` }}
              >
                <span
                  aria-hidden="true"
                  className="select-none font-heading text-h1 leading-none text-transparent md:col-span-2"
                  style={{ WebkitTextStroke: "1px var(--border-strong)" }}
                >
                  {n}
                </span>
                <h3 className="text-h3 font-heading text-foreground md:col-span-4">
                  {title}
                </h3>
                <p className="max-w-[46ch] text-body text-muted-foreground md:col-span-5 md:col-start-8">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
