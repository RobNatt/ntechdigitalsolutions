"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";

/*
 * Fixed header.
 *
 * It has to survive two surfaces: the dark hero at the top and the light
 * chapters below. So it starts transparent with light type over the hero, and
 * on scroll picks up the page background with dark type. Switching at 80px
 * means it changes while still over the hero, never mid-transition between
 * sections, which would look like a bug.
 *
 * The wordmark is set in Outfit — the site's own heading face — rather than
 * shipped as artwork. It's always crisp, always the right colour, and it can
 * never drift out of sync with the type on the page.
 */

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 80;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {/* On the light surface past the hero this is Rob's preferred
              treatment: solid dark letterform with gold circuitry. Over the
              dark hero that would vanish, so it inverts to a gold mark with
              the traces cut out. Same geometry either way. */}
          <LogoMark
            title="N-Tech Digital Solutions"
            variant={scrolled ? "duotone" : "full"}
            className={`h-8 w-8 transition-colors duration-300 ${
              scrolled ? "text-primary" : "text-cta"
            }`}
          />
          <span
            className={`font-heading text-body font-semibold tracking-[0.14em] transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            N-TECH
          </span>
        </a>

        <a
          href="#contact"
          className={`rounded-md px-5 py-2.5 text-small font-medium transition-[transform,background-color,color] duration-[180ms] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
            scrolled
              ? "bg-cta text-on-cta"
              : "border border-white/25 text-white hover:bg-white/10"
          }`}
        >
          Placeholder CTA
        </a>
      </div>
    </motion.header>
  );
}
