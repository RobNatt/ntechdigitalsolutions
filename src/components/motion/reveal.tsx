"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DISTANCE, DURATION, EASE_OUT, STAGGER, VIEWPORT } from "@/lib/motion";

type Tier = "reveal" | "chapter";

/**
 * `mount` fires on hydration. `scroll` waits for the element to enter view.
 *
 * Above-the-fold content MUST use `mount`. Scroll triggers depend on
 * IntersectionObserver, which never fires if the element is already in view in
 * a context that isn't compositing — a background tab, a hidden pane, some
 * headless renderers. Content would sit at opacity 0 permanently. The design
 * system forbids content that is invisible by default, so anything visible
 * without scrolling animates on mount instead.
 */
type Trigger = "mount" | "scroll";

interface RevealProps {
  children: ReactNode;
  /** Which motion tier. `reveal` for single elements, `chapter` for section entrances. */
  tier?: Tier;
  /** `mount` for above the fold, `scroll` for everything below it. */
  trigger?: Trigger;
  /** Position in a staggered group. Multiplied by STAGGER (80ms). */
  index?: number;
  className?: string;
}

/**
 * The only entrance primitive in this project.
 *
 * Every rule from design-system.md section 7 is enforced here so components
 * can't drift:
 *
 *  - transform and opacity only. `y` compiles to translateY; no layout props.
 *  - `once: true` — nothing animates twice on the same scroll pass.
 *  - `-10%` viewport margin — the entrance starts as the element arrives and
 *    finishes long before it leaves.
 *  - under 600ms — reveal is 500ms, chapter 550ms.
 *  - reduced motion renders the final state immediately, no animation at all.
 */
export function Reveal({
  children,
  tier = "reveal",
  trigger = "scroll",
  index = 0,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  // No animation at all under reduced motion — final state, immediately.
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const transition = {
    duration: DURATION[tier],
    ease: EASE_OUT,
    delay: index * STAGGER,
  };

  const from = { opacity: 0, y: DISTANCE[tier] };
  const to = { opacity: 1, y: 0 };

  if (trigger === "mount") {
    return (
      <motion.div
        className={className}
        initial={from}
        animate={to}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
      viewport={VIEWPORT}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
