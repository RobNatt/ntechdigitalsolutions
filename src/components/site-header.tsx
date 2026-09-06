"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";

/*
 * Floating pill nav.
 *
 * A detached pill sitting ON the page rather than a bar welded to the top. It
 * stays bright white on every surface, which solves a problem the old bar had:
 * it no longer has to restyle itself as it crosses from the dark hero to the
 * light chapters, so the mark can stay in its best treatment — dark letterform
 * with gold circuitry — the whole way down.
 *
 * The centre is deliberately empty. Section links drop in there as the site
 * grows; the pill is already sized to hold them without changing shape.
 *
 * The wordmark is set in Outfit — the site's own heading face — rather than
 * shipped as artwork, so it can never drift out of sync with the page's type.
 */

const LINKS = [
  { label: "The problem", href: "#problem" },
  { label: "How it works", href: "#journey" },
  { label: "The stack", href: "#solution" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);

  // The pill only deepens its shadow once it's genuinely floating over content.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 40;
    setLifted((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.header
      initial={false}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6"
    >
      <nav
        aria-label="Main"
        className={`flex w-full max-w-[820px] items-center gap-2 rounded-full border border-black/[0.06] bg-white/95 py-2 pl-3 pr-2 backdrop-blur-xl transition-shadow duration-300 ${
          lifted
            ? "shadow-[0_10px_40px_rgba(12,10,9,0.16),0_2px_8px_rgba(12,10,9,0.08)]"
            : "shadow-[0_4px_20px_rgba(12,10,9,0.10)]"
        }`}
      >
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-full px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {/* The pill is always light, so the mark is always in Rob's preferred
              treatment: solid dark letterform, gold circuitry. */}
          <LogoMark
            title="N-Tech Digital Solutions"
            variant="duotone"
            className="h-7 w-7 text-[#1C1917]"
          />
          <span className="font-heading text-small font-semibold tracking-[0.14em] text-[#1C1917]">
            N-TECH
          </span>
        </a>

        {/* Room to grow. More sections slot in here. */}
        <ul className="mx-auto hidden items-center gap-1 md:flex">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="rounded-full px-4 py-2 text-small text-[#57534E] transition-colors duration-[180ms] hover:bg-[#0C0A09]/[0.05] hover:text-[#1C1917] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="ml-auto shrink-0 rounded-full bg-cta px-5 py-2.5 text-small font-medium text-on-cta transition-transform duration-[180ms] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:ml-0"
        >
          Placeholder CTA
        </a>
      </nav>
    </motion.header>
  );
}
