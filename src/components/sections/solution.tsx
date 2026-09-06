"use client";

import { Bot, Globe, MessagesSquare, Share2, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * Chapter 3: the solution.
 *
 * The offer is called "The Scalable Digital Infrastructure", so this chapter is
 * built as literal infrastructure: a vertical spine with gold nodes and pieces
 * branching off it, alternating sides. Not a five-column card grid — the shape
 * of the section carries the idea, which is what stops it reading as a
 * template. This layout would make no sense for another business, which is the
 * test it has to pass.
 *
 * The five pieces are real (from offers.md). ALL DESCRIPTIVE COPY IS
 * PLACEHOLDER, and no pricing is shown — that is a conversation, not a header.
 */

interface Piece {
  icon: LucideIcon;
  name: string;
  body: string;
}

const PIECES: Piece[] = [
  { icon: Globe, name: "Website", body: "Placeholder — the branded site, connected to everything below it rather than sitting on its own." },
  { icon: MessagesSquare, name: "Follow-up automations", body: "Placeholder — what happens in the minutes after a lead comes in, without anyone remembering to do it." },
  { icon: Bot, name: "AI receptionist", body: "Placeholder — answers calls from the site and catches the ones the business line misses." },
  { icon: Share2, name: "Social management", body: "Placeholder — four posts a week, pointing back at the site." },
  { icon: Star, name: "Review generator", body: "Placeholder — reaches past customers; happy ones go public, unhappy ones come to you first." },
];

const COPY = {
  overline: "Chapter three",
  heading: "Placeholder heading for the whole stack",
  lead: "Placeholder lead. One or two sentences on why the pieces are worth more connected than they are apart.",
} as const;

export function Solution() {
  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[52ch]">
          <Reveal tier="chapter" index={0}>
            <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              {COPY.overline}
            </p>
          </Reveal>
          <Reveal tier="chapter" index={1}>
            <h2
              id="solution-heading"
              className="mt-8 text-h1 text-balance font-heading text-foreground"
            >
              {COPY.heading}
            </h2>
          </Reveal>
          <Reveal tier="chapter" index={2}>
            <p className="mt-8 text-body-lg text-muted-foreground">{COPY.lead}</p>
          </Reveal>
        </div>

        {/* The spine. One continuous line, nodes on it, pieces branching off. */}
        <div className="relative mt-24 md:mt-32">
          <span
            aria-hidden="true"
            className="absolute left-[11px] top-0 h-full w-px bg-gradient-to-b from-transparent via-border-strong to-transparent md:left-1/2"
          />

          <ul className="space-y-12 md:space-y-0">
            {PIECES.map(({ icon: Icon, name, body }, i) => {
              const right = i % 2 === 1;
              return (
                <Reveal
                  key={name}
                  as="li"
                  tier="reveal"
                  index={i}
                  className="relative md:grid md:grid-cols-2 md:gap-16"
                >
                  {/* node on the spine */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 flex size-6 items-center justify-center rounded-full border border-cta bg-background md:left-1/2 md:-translate-x-1/2"
                  >
                    <span className="size-2 rounded-full bg-cta" />
                  </span>

                  <div
                    className={`pl-12 md:pl-0 md:py-12 ${
                      right
                        ? "md:col-start-2 md:pl-16"
                        : "md:col-start-1 md:pr-16 md:text-right"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`size-6 text-cta ${right ? "" : "md:ml-auto"}`}
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-6 text-h3 font-heading text-foreground">
                      {name}
                    </h3>
                    <p
                      className={`mt-4 max-w-[42ch] text-body text-muted-foreground ${
                        right ? "" : "md:ml-auto"
                      }`}
                    >
                      {body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
