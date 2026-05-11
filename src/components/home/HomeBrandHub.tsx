import Link from "next/link";
import { ArrowRight, BarChart3, LayoutTemplate, Megaphone } from "lucide-react";
import {
  GROWTH_SYSTEM_FUNNEL_PATH,
  GROWTH_SYSTEM_OFFER_NAME,
} from "@/constants/growth-system-offer";
import { cn } from "@/lib/utils";

const funnel = GROWTH_SYSTEM_FUNNEL_PATH;
const qualifyHref = `${funnel}#qualify`;

function ctaClassPrimary() {
  return cn(
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-center text-base font-semibold text-white shadow-sm transition sm:w-auto",
    "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
  );
}

function ctaClassSecondary() {
  return cn(
    "inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-sky-800 bg-white/90 px-6 py-3.5 text-center text-base font-semibold text-sky-900 transition sm:w-auto",
    "hover:bg-white dark:border-sky-500 dark:bg-neutral-900/90 dark:text-sky-200 dark:hover:bg-neutral-900"
  );
}

function ctaClassGhost() {
  return cn(
    "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white/80 px-6 py-3.5 text-center text-base font-semibold text-neutral-800 transition sm:w-auto",
    "hover:bg-white dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-900"
  );
}

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 px-4 pb-20 pt-24 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 sm:pb-28 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            N-Tech Digital Solutions
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl sm:leading-tight">
            Built for service businesses that want the phone to ring
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
            We&apos;re a website-first growth partner for roofers, HVAC, plumbers, dental practices,
            and similar operators — not e-commerce or restaurants. When you&apos;re ready to treat
            growth like a system instead of a one-off project, we&apos;ll walk you through our
            flagship offer.
          </p>
          <div
            id="offer-path"
            className="mt-10 flex max-w-xl flex-col items-stretch justify-center gap-3 sm:mx-auto sm:flex-row sm:flex-wrap"
          >
            <Link href={funnel} className={ctaClassPrimary()}>
              Get Started NOW!
              <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </Link>
            <Link href={qualifyHref} className={ctaClassSecondary()}>
              Get quote
            </Link>
            <Link href={funnel} className={ctaClassGhost()}>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            One offer: the full system
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {GROWTH_SYSTEM_OFFER_NAME}
            </span>{" "}
            combines a conversion-focused site and funnel, a lead dashboard your team will
            actually use, and paid traffic plus SEO so demand isn&apos;t a guessing game.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Step 1 — Site + funnel",
              body: "Authority, visibility, positioning, service structure, trust, and CTAs — with an ad funnel that supports conversion.",
              icon: LayoutTemplate,
            },
            {
              title: "Step 2 — Lead dashboard",
              body: "Pipeline stages, sources, notes, and follow-ups so leads don’t die in the inbox.",
              icon: BarChart3,
            },
            {
              title: "Step 3 — Ads + SEO",
              body: "Meta or Google to the site while SEO compounds; paid data informs organic strategy.",
              icon: Megaphone,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <card.icon className="h-6 w-6 text-sky-600 dark:text-sky-400" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-500 dark:text-neutral-400">
          See pricing, the qualifying form, and FAQ placeholders on the{" "}
          <Link href={funnel} className="font-medium text-sky-700 underline underline-offset-2 dark:text-sky-400">
            Growth System page
          </Link>
          . For services and location pages, visit{" "}
          <Link href="/services" className="font-medium text-sky-700 underline underline-offset-2 dark:text-sky-400">
            Services
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
