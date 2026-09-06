"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { RefObject } from "react";

/*
 * The charge leaving the hero, as ONE element.
 *
 * This used to be two pieces — a node and a stub inside the hero, and a
 * separate receiving line at the top of chapter one. That was the bug: the node
 * sat at the hero's base and the visible line began further down in chapter
 * one, with a gap between them. Two elements can't be made to look like one
 * continuous charge across a section boundary, because each is clipped and
 * driven separately.
 *
 * So it's a single element now, rendered by chapter one and pulled UPWARD with
 * a negative offset so it reaches back over the hero's base. Chapter one
 * doesn't clip its overflow; the hero does, which is why this can't live there.
 *
 * The node exists before the trace does. The line is not drawn until the charge
 * makes it — there is no unlit rail, because a rail visible ahead of the
 * current is exactly what made the trace look like it started somewhere else.
 */

interface SeamTraceProps {
  /** The section this is rendered inside — drives the fill. */
  target: RefObject<HTMLElement | null>;
}

export function SeamTrace({ target }: SeamTraceProps) {
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 95%", "start 30%"],
  });

  // Node first, then the line draws out of it.
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);
  const fill = useTransform(scrollYProgress, [0.16, 1], [0, 1]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-180px] z-10 h-[340px] w-px -translate-x-1/2"
    >
      {/* The line. Grows downward out of the node, across the seam. */}
      <motion.span
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,var(--color-cta)_0%,var(--color-cta)_55%,rgba(161,98,7,0.35)_82%,transparent_100%)]"
      />

      {/* The origin node, sitting in the hero's base. */}
      <motion.span
        style={reduce ? { opacity: 1 } : { opacity: nodeOpacity }}
        className="absolute -top-3 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-cta bg-[#0C0A09]"
      >
        <motion.span
          animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          className="size-2 rounded-full bg-cta"
        />
      </motion.span>
    </div>
  );
}
