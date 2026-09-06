"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CallDemo } from "@/components/sections/call-demo";
import { LocalTime } from "@/components/local-time";

/*
 * Hero — chapter 0: the intro hook, and the origin of the current.
 *
 * Deliberately NOT a centred card. Type holds the left seven columns, and the
 * product artifact holds the right five, offset downward so the columns never
 * share a baseline.
 *
 * The artifact plays a scene rather than listing outcomes — see call-demo.tsx.
 *
 * The charge that runs the whole page originates at this section's base, but
 * the trace itself lives in `seam-trace.tsx`, rendered by chapter one. It has
 * to be ONE element crossing the boundary — split across two sections, the node
 * sat in the hero and the line started in chapter one with a gap between them.
 * The hero clips its overflow, so the piece that spans the seam cannot live
 * here.
 *
 * ALL COPY IS PLACEHOLDER and claims nothing that isn't true.
 */

const COPY = {
  overline: "Omaha, Nebraska",
  headlineA: "You built the business. It still needs a digital office.",
  headlineB: "It doesn't need to be you.",
  sub: "One connected system — website, phone, follow-up, social, and reviews — running your digital office so you don't have to be the one answering it in real time.",
  primaryCta: "Book a Call",
  secondaryCta: "See how it works",
} as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Decorative layers only. Never text, never controls.
  const bloomY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  // The charge leaves as you scroll out — energising over the last third.

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="surface-dark grain relative isolate flex min-h-screen items-center overflow-hidden px-6 py-16 md:px-12 md:py-20 lg:px-20"
    >
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: bloomY }}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
      >
        <div className="absolute left-[-10%] top-[-20%] h-[95vh] w-[95vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.20),transparent_60%)] blur-[100px]" />
        <div className="absolute right-[-15%] top-[10%] h-[75vh] w-[75vh] rounded-full bg-[radial-gradient(circle,rgba(120,113,108,0.16),transparent_62%)] blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(to_top,rgba(12,10,9,0.95),transparent)]" />
      </motion.div>

      {/* THE HANDOFF. The hero doesn't end, it dissolves — the dark washes out
          into chapter one's ground so the seam is a transition rather than a
          cut. The trace below sits above this and crosses it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-64 bg-[linear-gradient(to_bottom,transparent_0%,rgba(250,250,249,0.02)_14%,rgba(250,250,249,0.07)_27%,rgba(250,250,249,0.16)_39%,rgba(250,250,249,0.30)_50%,rgba(250,250,249,0.47)_61%,rgba(250,250,249,0.65)_71%,rgba(250,250,249,0.81)_81%,rgba(250,250,249,0.93)_91%,#FAFAF9_100%)]"
      />

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Type column — seven of twelve, never centred. */}
        <div className="lg:col-span-7">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              {COPY.overline}
              <span aria-hidden="true" className="text-border-strong">
                &middot;
              </span>
              <LocalTime />
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1
              id="hero-heading"
              className="mt-6 text-display font-heading text-foreground"
            >
              {COPY.headlineA}
              <span className="block text-muted-foreground">
                {COPY.headlineB}
              </span>
            </h1>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[52ch] text-body-lg text-muted-foreground">
              {COPY.sub}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={3}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/book-a-call"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.primaryCta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-md border border-border-strong px-8 py-4 text-body font-medium text-foreground transition-[transform,background-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {COPY.secondaryCta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Artifact column — five of twelve, pushed down so the columns don't
            share a baseline. The product actually doing something. */}
        <motion.div
          style={reduce ? undefined : { y: artY }}
          className="lg:col-span-5 lg:translate-y-12"
        >
          <CallDemo />
        </motion.div>
      </div>

    </section>
  );
}
