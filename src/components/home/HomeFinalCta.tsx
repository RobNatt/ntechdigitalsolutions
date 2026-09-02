"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { GetMoreInfoButton } from "@/components/scheduling/GetMoreInfoButton";

const TRUST_CHIPS = [
  "AI receptionist",
  "Lead automation + CRM",
  "Social media management",
  "Google review automation",
] as const;

export function HomeFinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-t border-neutral-800 bg-black py-24 text-white md:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Ambient glow + grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {!reduceMotion ? (
          <>
            <motion.div
              className="absolute -left-[20%] top-[-10%] h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-white/10 blur-[100px] md:blur-[120px]"
              animate={{ opacity: [0.45, 0.65, 0.45], scale: [1, 1.06, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-[15%] bottom-[-20%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-white/[0.06] blur-[90px] md:blur-[110px]"
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        ) : (
          <>
            <div className="absolute -left-[20%] top-[-10%] h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-white/[0.08] blur-[100px] md:blur-[120px]" />
            <div className="absolute -right-[15%] bottom-[-20%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-white/5 blur-[90px]" />
          </>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="final-cta-heading"
            className="text-balance text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            Stop Losing Customers to Missed Calls and Slow Follow-Up
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-400 md:text-lg">
            Most local businesses rely on disconnected tools — a website here, a CRM there, no one
            watching reviews. We install one connected system: website, AI receptionist, lead
            automation, social media management, and review automation, under one flat monthly retainer.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <GetMoreInfoButton className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 py-3.5 text-center text-sm font-semibold text-black shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Get More Info
            </GetMoreInfoButton>
            <Link
              href="/infrastructure"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-600 bg-neutral-900/40 px-8 py-3.5 text-center text-sm font-semibold text-neutral-200 backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-800/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
            >
              See the System
            </Link>
          </div>

          <ul className="mt-12 flex list-none flex-wrap justify-center gap-2 sm:mt-14 sm:gap-3">
            {TRUST_CHIPS.map((label) => (
              <li key={label}>
                <span className="inline-flex rounded-full border border-neutral-700 bg-neutral-900/30 px-3 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-sm transition duration-200 hover:border-neutral-500 hover:text-neutral-300 md:text-[13px]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
