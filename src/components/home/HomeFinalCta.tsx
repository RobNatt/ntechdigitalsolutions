"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { GROWTH_SYSTEM_FUNNEL_PATH } from "@/constants/growth-system-offer";

const TRUST_CHIPS = [
  "Conversion-focused websites",
  "Targeted advertising",
  "Lead tracking dashboards",
  "Transparent reporting",
] as const;

export function HomeFinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-t border-slate-800/80 bg-[#0f172a] py-24 text-white md:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Ambient glow + grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {!reduceMotion ? (
          <>
            <motion.div
              className="absolute -left-[20%] top-[-10%] h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-blue-500/25 blur-[100px] md:blur-[120px]"
              animate={{ opacity: [0.45, 0.65, 0.45], scale: [1, 1.06, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-[15%] bottom-[-20%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-cyan-400/15 blur-[90px] md:blur-[110px]"
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        ) : (
          <>
            <div className="absolute -left-[20%] top-[-10%] h-[min(32rem,80vw)] w-[min(32rem,80vw)] rounded-full bg-blue-500/20 blur-[100px] md:blur-[120px]" />
            <div className="absolute -right-[15%] bottom-[-20%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-cyan-400/12 blur-[90px]" />
          </>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[length:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 22 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.35 },
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
              })}
          className="text-center"
        >
          <h2
            id="final-cta-heading"
            className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            Build a Marketing System That Actually Works Together
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 md:text-lg">
            Most businesses rely on disconnected tools that create wasted traffic, missed leads, and unclear
            performance. We combine conversion-focused websites, targeted advertising, and lead tracking dashboards
            into one connected growth system.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href={CONSTANTS.STRATEGY_QUALIFICATION_PATH}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-3.5 text-center text-sm font-semibold text-slate-900 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_40px_-8px_rgba(59,130,246,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Schedule a Strategy Call
            </Link>
            <Link
              href={GROWTH_SYSTEM_FUNNEL_PATH}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-600/90 bg-slate-900/40 px-8 py-3.5 text-center text-sm font-semibold text-slate-200 backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800/60 hover:text-white hover:shadow-[0_0_24px_-4px_rgba(59,130,246,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              View Growth Systems
            </Link>
          </div>

          <ul className="mt-12 flex list-none flex-wrap justify-center gap-2 sm:mt-14 sm:gap-3">
            {TRUST_CHIPS.map((label) => (
              <li key={label}>
                <span className="inline-flex rounded-full border border-slate-600/70 bg-slate-900/30 px-3 py-1.5 text-xs font-medium text-slate-400 backdrop-blur-sm transition duration-200 hover:border-slate-500 hover:text-slate-300 md:text-[13px]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
