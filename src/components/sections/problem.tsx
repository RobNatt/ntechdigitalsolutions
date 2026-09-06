"use client";

import { PhoneMissed, SearchX, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * Chapter 1 of the scroll story: the problem.
 *
 * Framing rule from the sprint notes, and it is not optional here: never lead
 * with what is wrong with the visitor's business. That was tried and it read as
 * criticism rather than a solution. So this chapter describes a situation the
 * visitor recognises, in their words, and lets them decide it applies. It never
 * says "your website is bad".
 *
 * ALL COPY IS PLACEHOLDER. The three items below are shaped from the
 * hypothesised pains in customers.md — which are explicitly marked UNTESTED.
 * They are framed as recognisable situations, never as claims about results or
 * statistics we do not have.
 */

interface Problem {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COPY = {
  overline: "Placeholder — chapter one",
  heading: "Placeholder chapter heading about the situation",
  lead: "Placeholder lead paragraph. One or two sentences that describe the day, not the deficiency — something the visitor nods at rather than defends against.",
  problems: [
    {
      icon: PhoneMissed,
      title: "Placeholder — missed calls",
      body: "Placeholder body copy describing what happens to a call that comes in while you are already on a job.",
    },
    {
      icon: SearchX,
      title: "Placeholder — hard to find",
      body: "Placeholder body copy about what someone sees when they go looking for you and cannot find much.",
    },
    {
      icon: Star,
      title: "Placeholder — thin reviews",
      body: "Placeholder body copy about the gap between the work you actually do and what shows up online.",
    },
  ] satisfies Problem[],
} as const;

export function Problem() {
  return (
    <section
      id="solutions"
      aria-labelledby="problem-heading"
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal tier="chapter" index={0}>
          <p className="text-overline uppercase text-muted-foreground">
            {COPY.overline}
          </p>
        </Reveal>

        <Reveal tier="chapter" index={1}>
          <h2
            id="problem-heading"
            className="mt-6 max-w-[20ch] text-h1 text-balance font-heading text-foreground"
          >
            {COPY.heading}
          </h2>
        </Reveal>

        <Reveal tier="chapter" index={2}>
          <p className="mt-6 max-w-[60ch] text-body-lg text-muted-foreground">
            {COPY.lead}
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {COPY.problems.map(({ icon: Icon, title, body }, i) => (
            // index continues the stagger from the heading above, so the whole
            // chapter reads as one motion rather than two groups.
            <Reveal
              key={title}
              as="li"
              tier="reveal"
              index={i + 3}
              className="h-full rounded-lg border border-border bg-card p-8 shadow-sm"
            >
              <Icon
                aria-hidden="true"
                className="size-6 text-cta"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 text-h4 font-heading text-card-foreground">
                {title}
              </h3>
              <p className="mt-3 text-body text-muted-foreground">{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
