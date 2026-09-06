"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bot, Globe, MessagesSquare, Share2, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * Chapter 3: the solution.
 *
 * The offer is called "The Scalable Digital Infrastructure", so the section is
 * built as literal infrastructure: a vertical spine with nodes, pieces
 * branching off alternating sides. The shape carries the idea — this layout
 * would make no sense for another business, which is the test it has to pass.
 *
 * THE CURRENT: a charge travels down the spine as you scroll, and each node
 * lights when it arrives. Scroll position drives it directly, so it reads as
 * one continuous system energising rather than five things fading in.
 *
 * Motion rules hold. The travelling line is scaleY (transform) and the nodes
 * change colour and glow — no layout properties. Under reduced motion the whole
 * spine is drawn and every node is lit from the start, with nothing moving.
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
  { icon: Globe, name: "Website", body: "The page that answers \"are you legit\" before anyone picks up the phone." },
  { icon: MessagesSquare, name: "Follow-up automations", body: "Every lead gets a text or email before they forget they reached out." },
  { icon: Bot, name: "AI receptionist", body: "Picks up every call and gets it on the calendar, even when you can't." },
  { icon: Share2, name: "Social management", body: "Your posts stay active, and the people commenting get followed up with." },
  { icon: Star, name: "Review generator", body: "Happy customers get asked at the right moment, in public. Anything less comes to you first, privately." },
];

const COPY = {
  overline: "Chapter three",
  heading: "One system, not five tools",
  lead: "A website nobody looks at, a receptionist with no calendar to book into, reviews nobody follows up on — separately, each piece does less. Connected, they cover for each other.",
} as const;

export function Solution() {
  const reduce = useReducedMotion();
  const spineRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(reduce ? PIECES.length : 0);

  // The current runs while the spine crosses the middle of the viewport.
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ["start 75%", "end 60%"],
  });

  // Transform-only: the gold overlay scales from the top down.
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // The leading edge is positioned with translateY, never `top` — animating a
  // layout property is banned by the motion rules. That needs the spine's
  // pixel height, so measure it and keep it current on resize.
  const [spineHeight, setSpineHeight] = useState(0);
  useEffect(() => {
    const el = spineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setSpineHeight(entry.contentRect.height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // 64px = the head's own height (h-16), so its BOTTOM edge rides the front of
  // the current and the glow trails behind it. Baked into the transform because
  // motion's inline transform would override a Tailwind -translate-y-full.
  const headY = useTransform(fill, (v) => v * spineHeight - 64);

  // A node lights as the current reaches it.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const next = PIECES.reduce(
      (count, _, i) => (p >= (i + 0.5) / PIECES.length ? i + 1 : count),
      0,
    );
    setLit((prev) => (prev === next ? prev : next));
  });

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

        <div ref={spineRef} className="relative mt-24 md:mt-32">
          {/* Unlit rail */}
          <span
            aria-hidden="true"
            className="absolute left-[11px] top-0 h-full w-px bg-border md:left-1/2"
          />
          {/* The current. scaleY from the top — transform only. */}
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : fill }}
            className="absolute left-[11px] top-0 h-full w-px origin-top bg-gradient-to-b from-cta via-cta to-cta/40 md:left-1/2"
          />
          {/* The leading edge — a bright head riding the front of the current. */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ y: headY }}
              className="absolute left-[11px] top-0 z-10 h-16 w-px bg-gradient-to-b from-transparent to-cta blur-[1px] md:left-1/2"
            />
          )}

          <ul className="space-y-12 md:space-y-0">
            {PIECES.map(({ icon: Icon, name, body }, i) => {
              const right = i % 2 === 1;
              const on = i < lit;
              return (
                <Reveal
                  key={name}
                  as="li"
                  tier="reveal"
                  index={i}
                  className="relative md:grid md:grid-cols-2 md:gap-16"
                >
                  {/* Node — lights when the current arrives. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1 z-10 flex size-6 items-center justify-center rounded-full border bg-background transition-[border-color,box-shadow] duration-300 md:left-1/2 md:-translate-x-1/2 ${
                      on
                        ? "border-cta shadow-[0_0_0_4px_rgba(161,98,7,0.14),0_0_18px_rgba(161,98,7,0.5)]"
                        : "border-border"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full transition-colors duration-300 ${
                        on ? "bg-cta" : "bg-border-strong"
                      }`}
                    />
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
                      className={`size-6 transition-colors duration-300 ${
                        on ? "text-cta" : "text-border-strong"
                      } ${right ? "" : "md:ml-auto"}`}
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
