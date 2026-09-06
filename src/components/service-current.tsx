"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/*
 * The current, on a service page.
 *
 * The home page's whole visual argument is one charge running from the hero,
 * through the chapters, into the CTA. A service page that dropped the motif
 * would read as a different site. This is the same construction — no unlit
 * rail, a node first, then a gold line drawing out of it on scroll — carrying
 * the seam between the dark hero and the light section beneath it.
 *
 * Deliberately shorter and quieter than the home page's version. A service page
 * is a detail view; the full circuit belongs to the story, not the spec sheet.
 */

export function ServiceCurrent() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 35%"],
  });
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const fill = useTransform(scrollYProgress, [0.18, 1], [0, 1]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-140px] z-10 h-[260px] w-px -translate-x-1/2"
    >
      <motion.span
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,var(--color-cta)_0%,var(--color-cta)_55%,rgba(161,98,7,0.3)_82%,transparent_100%)]"
      />
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
