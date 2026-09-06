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
  heading: "The phone doesn't know you're elbow-deep in a job.",
  lead: "You're on a ladder, under a sink, halfway through something that needs both hands. The phone doesn't wait for a good time to ring.",
  rows: [
    {
      n: "01",
      title: "The call that rings out",
      body: "It rings. Nobody's near it. It goes to voicemail, or it just goes unanswered — and whoever called is already dialing the next name on their list.",
    },
    {
      n: "02",
      title: "The search that finds nothing",
      body: "Someone searches for exactly what you do, right now. They land on a page with no way to reach you, or a form that goes nowhere — and they're on to the next result before you'd have even seen the notification.",
    },
    {
      n: "03",
      title: "The work nobody can see",
      body: "You know the work is good. A stranger scrolling on their phone has no way to know that yet — nothing to look at, nothing anyone else has said, nothing that tells them you're the one to call.",
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
