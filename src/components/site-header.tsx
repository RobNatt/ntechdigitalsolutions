"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";

/*
 * Floating pill nav.
 *
 * A detached pill sitting ON the page rather than a bar welded to the top.
 *
 * It starts solid black over the hero and turns bright white on scroll. The
 * mark follows: gold with the traces cut out on the dark pill, and the darker
 * duotone treatment once the pill is light. Both readings of the mark get used,
 * each where it actually works.
 *
 * The centre is deliberately empty. Section links drop in there as the site
 * grows; the pill is already sized to hold them without changing shape.
 *
 * The wordmark is set in Outfit — the site's own heading face — rather than
 * shipped as artwork, so it can never drift out of sync with the page's type.
 */

const BOOKING_URL =
  "https://calendar.ntechdigitalsolutions.com/widget/form/R5cLPJUnb6wNr6YN3QXP";

const LINKS = [
  { label: "The problem", href: "#problem" },
  { label: "How it works", href: "#journey" },
  { label: "What you get", href: "#solution" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);

  // The pill only deepens its shadow once it's genuinely floating over content.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 90;
    setLifted((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.header
      initial={false}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6"
    >
      <nav
        aria-label="Main"
        className={`flex w-full max-w-[820px] items-center gap-2 rounded-full border py-2 pl-3 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ease-out ${
          lifted
            ? "border-black/[0.06] bg-white/95 shadow-[0_10px_40px_rgba(12,10,9,0.16),0_2px_8px_rgba(12,10,9,0.08)]"
            : "border-white/10 bg-[#0C0A09]/90 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        }`}
      >
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-full px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {/* Gold with cut-outs on the black pill; the darker duotone once the
              pill goes white. */}
          <LogoMark
            title="N-Tech Digital Solutions"
            variant={lifted ? "duotone" : "full"}
            className={`h-7 w-7 transition-colors duration-500 ${
              lifted ? "text-[#1C1917]" : "text-cta"
            }`}
          />
          <span
            className={`font-heading text-small font-semibold tracking-[0.14em] transition-colors duration-500 ${
              lifted ? "text-[#1C1917]" : "text-white"
            }`}
          >
            N-TECH
          </span>
        </a>

        {/* Room to grow. More sections slot in here. */}
        <ul className="mx-auto hidden items-center gap-1 md:flex">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`rounded-full px-4 py-2 text-small transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  lifted
                    ? "text-[#57534E] hover:bg-[#0C0A09]/[0.05] hover:text-[#1C1917]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={BOOKING_URL}
          className="ml-auto shrink-0 rounded-full bg-cta px-5 py-2.5 text-small font-medium text-on-cta transition-transform duration-[180ms] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:ml-0"
        >
          Book a Call
        </a>
      </nav>
    </motion.header>
  );
}
