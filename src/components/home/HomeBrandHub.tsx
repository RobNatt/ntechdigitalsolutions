import Link from "next/link";
import { BarChart3, LayoutTemplate, Megaphone } from "lucide-react";
import { GROWTH_SYSTEM_FUNNEL_PATH, GROWTH_SYSTEM_OFFER_NAME } from "@/constants/growth-system-offer";
import { HomeHeroBeams } from "@/components/home/HomeHeroBeams";

const funnel = GROWTH_SYSTEM_FUNNEL_PATH;

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <HomeHeroBeams />

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
