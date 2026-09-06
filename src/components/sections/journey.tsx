"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  // Centring the panel needs its real height: a full-height sticky wrapper
  // releases a whole viewport before the parent ends, which is why the panel
  // used to abandon the last step. Sticking the panel itself, at a computed
  // offset, keeps it pinned to the very bottom of the column.
  const panelRef = useRef<HTMLDivElement>(null);
  const firstStepRef = useRef<HTMLLIElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);
  // The card's travel has to be bounded by the descriptions, not by the list
  // box. The list carries 15vh of padding and each step centres its text in a
  // 70vh block, so the list starts long before the first description and ends
  // long after the last — and a sticky element travels its parent's whole
  // content box, which is why the card appeared above the first description
  // and was still there below the last. Padding the card's column by the same
  // dead space makes its range start and end with the text.
  const [colPad, setColPad] = useState({ top: 0, bottom: 0 });
  const padRef = useRef({ top: 0, bottom: 0 });
  const [nodeTops, setNodeTops] = useState<number[]>([]);
  useEffect(() => {
    const measure = () => {
      // Align the panel's TOP EDGE with the step heading's top edge. Matching
      // centres looked correct on paper and wrong on screen: the panel is
      // taller than the step text, so a shared centre puts the panel's top
      // ~110px above the heading and the two columns read as misaligned.
      // Two columns side by side share a top edge, not a midpoint.
      const content = firstStepRef.current
        ?.firstElementChild as HTMLElement | null;
      const contentH = content?.getBoundingClientRect().height ?? 0;
      setStickyTop(Math.max(24, window.innerHeight / 2 - contentH / 2));

      const ol = stepsRef.current;
      const lastLi = ol?.lastElementChild as HTMLElement | null;
      const lastContent = lastLi?.firstElementChild as HTMLElement | null;
      // Stacked layout below lg — no second column, so no dead space to match.
      if (
        !ol ||
        !content ||
        !lastLi ||
        !lastContent ||
        window.innerWidth < 1024
      ) {
        setColPad({ top: 0, bottom: 0 });
        return;
      }
      // getBoundingClientRect includes transforms, and the descriptions sit
      // inside Reveal, which holds them at translateY(24px) until they animate
      // in — so every rect-based measurement here was reading a position that
      // moves depending on whether the element has been seen. offsetTop and
      // offsetHeight are pure layout values and ignore transforms entirely.
      // Both elements share an offsetParent (the grid wrapper is `relative`),
      // so these offsets are directly comparable.
      const colEl = colRef.current;
      if (!colEl) return;

      // Node positions, measured. They used to sit at even fractions of the
      // section, which only held while every step was an identical 70vh block.
      // Now the last step has no trailing room, so the fractions drift.
      setNodeTops(
        Array.from(ol.children).map((li) => {
          const c = (li as HTMLElement).firstElementChild as HTMLElement | null;
          return c ? c.offsetTop + c.offsetHeight / 2 : 0;
        }),
      );

      const next = {
        top: content.offsetTop - colEl.offsetTop,
        bottom:
          colEl.offsetTop +
          colEl.offsetHeight -
          (lastContent.offsetTop + lastContent.offsetHeight),
      };
      // Applying this padding changes the grid row height, which restretches
      // the list the measurement came from — so one pass lands short. Re-check
      // on the next frame after any change; the chain stops as soon as the
      // numbers hold still.
      if (
        Math.abs(next.top - padRef.current.top) > 0.5 ||
        Math.abs(next.bottom - padRef.current.bottom) > 0.5
      ) {
        padRef.current = next;
        setColPad(next);
        requestAnimationFrame(measure);
      }
    };
    const ro = new ResizeObserver(measure);
    if (panelRef.current) ro.observe(panelRef.current);
    if (firstStepRef.current) ro.observe(firstStepRef.current);
    // The list too: padding the card's column changes the grid row height,
    // which restretches the list — so the numbers the padding was derived from
    // go stale the moment it's applied. Observing the list lets it re-measure
    // and settle instead of landing ~24px out at the bottom.
    if (stepsRef.current) ro.observe(stepsRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The current runs the gutter between the two columns.
  const traceFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

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

        <div className="relative mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* The current, running the gutter. Chapter two was the only section
              off the circuit; now the charge threads it too. Nodes light as the
              panel advances, so the trace and the panel tell the same story. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
          >
            <motion.span
              style={{ scaleY: reduce ? 1 : traceFill }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-cta/50 via-cta to-cta/70"
            />
            {COPY.steps.map((s2, i) => (
              <span
                key={s2.n}
                style={{ top: nodeTops[i] ?? 0, opacity: nodeTops.length ? 1 : 0 }}
                className={`absolute left-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background transition-[border-color,box-shadow] duration-300 ${
                  i <= active
                    ? "border-cta shadow-[0_0_0_4px_rgba(217,119,6,0.12),0_0_16px_rgba(217,119,6,0.45)]"
                    : "border-border-strong/50"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full transition-colors duration-300 ${
                    i <= active ? "bg-cta" : "bg-border-strong"
                  }`}
                />
              </span>
            ))}
          </div>
          {/* Pinned panel. Advances as the steps on the right come into view. */}
          {/* NO self-start / self-* here. A sticky element travels only within its
              parent's box, and self-start shrinks the grid item to content
              height — leaving nowhere to stick. It must stretch to the full
              row height, which is the grid default. */}
          {/* Equal halves. The old 5-of-12 against 6-of-12 left a dead column
              between them: the right side ran 110px wider than the left with a
              157px gutter, so the two columns read as unrelated rather than
              paired. */}
          <div
            ref={colRef}
            style={{ paddingTop: colPad.top, paddingBottom: colPad.bottom }}
          >
            {/* The panel itself is the sticky element, offset so its centre
                lands on the viewport midline. The steps are centred in their own
                blocks and the list is padded by half the leftover viewport, so
                every step's centre crosses that same midline — they start
                together and finish together. */}
            <div className="lg:sticky" style={{ top: `${stickyTop}px` }}>
              <div ref={panelRef} className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-[20px] backdrop-saturate-150 md:p-12">
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
          <ol ref={stepsRef}>
            {COPY.steps.map(({ n, title, body }, i) => (
              <li
                key={n}
                ref={i === 0 ? firstStepRef : undefined}
                // Scroll room lives BELOW each step, not around it. Centring
                // text in a 70vh block pushed the first description ~330px
                // clear of the heading and left the same dead space trailing
                // the last one. The final step carries no trailing room, so
                // the section ends where its text ends.
                className="flex flex-col justify-start border-t border-border py-16 first:border-t-0 first:pt-0 lg:py-0 lg:pb-[46vh] lg:last:pb-0" 
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
