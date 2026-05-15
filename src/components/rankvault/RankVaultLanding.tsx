"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RankVaultLeadForm } from "@/components/rankvault/RankVaultLeadForm";
import { CONSTANTS } from "@/constants/links";

const PROCESS_STEPS = [
  {
    title: "We Build",
    body: "We launch local service sites built to convert inbound search traffic into calls and qualified leads.",
  },
  {
    title: "We Rank",
    body: "We execute SEO and GEO content systems to move those assets into revenue-generating local visibility.",
  },
  {
    title: "You Close Deals",
    body: "Qualified leads route to your business so your team can focus on estimates, bookings, and closed jobs.",
  },
] as const;

const TARGET_INDUSTRIES = [
  "Epoxy flooring",
  "Junk removal",
  "Tree services",
  "Spray foam insulation",
  "Concrete leveling",
  "Commercial cleaning",
  "Parking lot striping",
  "Other local high-ticket services",
] as const;

const REASONS = [
  "Exclusive lead flow by market and service intent",
  "Reduced dependency on ad spend volatility",
  "Search assets that compound over time",
  "Predictable inbound demand with clear routing",
  "Built as done-for-you lead infrastructure, not a one-off site",
] as const;

const FAQ_ITEMS = [
  {
    question: "How does rank and rent work?",
    answer:
      "We build and rank local service websites, then partner with a qualified business in that market to route inbound leads directly to them.",
  },
  {
    question: "Are the leads exclusive?",
    answer:
      "Yes. RankVault engagements are built around exclusive routing for the selected business partner in a target market.",
  },
  {
    question: "Do I own the website?",
    answer:
      "RankVault is an infrastructure model. NTech owns and operates the ranking asset while your business receives the lead flow under the partnership terms.",
  },
  {
    question: "What markets qualify?",
    answer:
      "We prioritize cities and service categories with healthy search demand, buyer intent, and clear commercial opportunity.",
  },
  {
    question: "How long does ranking take?",
    answer:
      "Timelines vary by market competition and site maturity, but rank-and-rent assets are built for long-term compounding gains rather than short bursts.",
  },
  {
    question: "Is this better than Google Ads?",
    answer:
      "They solve different problems. Ads can deliver speed, while RankVault focuses on durable inbound visibility and lead flow without constant paid clicks.",
  },
] as const;

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-pretty text-base leading-relaxed text-slate-300 md:text-lg">{subtitle}</p>
    </div>
  );
}

export function RankVaultLanding() {
  const reduceMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-24 pt-20 sm:px-6 md:pb-28 md:pt-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 14 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.45 },
                })}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">RankVault</p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Exclusive Local Leads. Already Ranked.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
              We build, rank, and optimize local service websites that generate inbound calls and leads. Then we
              partner with businesses to route those opportunities directly to them.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href={CONSTANTS.STRATEGY_QUALIFICATION_PATH}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Book a Strategy Call
              </Link>
              <a
                href="#rankvault-contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Check Availability
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 sm:text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Local SEO systems</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Inbound lead generation</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Performance-led growth</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="How RankVault Works"
            subtitle="A lean 3-step model built for local businesses that want recurring lead flow without a full ad dependency."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">Step {idx + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/40 px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Who This Is For</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              RankVault is designed for local high-ticket service businesses that can convert qualified inbound demand.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TARGET_INDUSTRIES.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Why RankVault</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Done-for-you lead generation infrastructure engineered for long-term local market advantage.
            </p>
            <ul className="mt-8 space-y-3">
              {REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" aria-hidden />
                  <span className="text-sm leading-relaxed text-slate-200">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Straight answers for businesses evaluating rank and rent as part of their local growth strategy."
          />
          <div className="mt-12 space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const open = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-medium text-white md:text-base">{item.question}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden px-5 pb-5 text-sm leading-relaxed text-slate-300 md:px-6">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="rankvault-contact"
        className="border-t border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-20 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Let&apos;s See If Your Market Has Opportunity
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                Share your details and we&apos;ll assess fit, market demand, and lead routing potential.
              </p>
            </div>

            <div className="mt-10">
              <RankVaultLeadForm />
            </div>

            <div className="mt-8 border-t border-white/10 pt-8 text-center">
              <Link
                href={CONSTANTS.STRATEGY_QUALIFICATION_PATH}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-sky-300/40 bg-sky-400/20 px-7 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/30"
              >
                Book Your Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
