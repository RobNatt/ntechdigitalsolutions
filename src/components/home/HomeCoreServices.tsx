import { Check, LayoutDashboard, Monitor, TrendingUp } from "lucide-react";
import Link from "next/link";
import { GROWTH_SYSTEM_FUNNEL_PATH } from "@/constants/growth-system-offer";

const funnel = GROWTH_SYSTEM_FUNNEL_PATH;

const ICON_WRAP =
  "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400";

const CARDS = [
  {
    title: "Websites",
    description: "High-converting websites designed to turn traffic into qualified leads.",
    bullets: ["Conversion-focused layouts", "Mobile optimized", "Fast & SEO-ready"],
    icon: Monitor,
  },
  {
    title: "SEO & Visibility",
    description: "Increase visibility where customers are actively searching.",
    bullets: ["Local SEO optimization", "Search visibility strategy", "Performance tracking"],
    icon: TrendingUp,
  },
  {
    title: "Automation & Analytics",
    description: "Track performance and automate repetitive business workflows.",
    bullets: ["Live reporting dashboards", "Lead tracking systems", "AI-enhanced automations"],
    icon: LayoutDashboard,
  },
] as const;

export function HomeCoreServices() {
  return (
    <section
      className="border-t border-neutral-200/70 bg-[#f8f9fb] py-20 md:py-28 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="core-services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="core-services-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            The Growth System
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Three connected systems designed to attract, convert, and track business growth.
          </p>
        </div>

        <ul className="mt-16 grid list-none gap-8 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-10">
          {CARDS.map((card) => (
            <li key={card.title}>
              <article className="group relative flex h-full flex-col rounded-xl border border-neutral-200/90 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200/90 hover:shadow-[0_12px_40px_-12px_rgba(37,99,235,0.12),0_4px_16px_-4px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:hover:border-blue-500/35 dark:hover:shadow-[0_12px_40px_-12px_rgba(59,130,246,0.15)]">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${ICON_WRAP} transition duration-300 group-hover:scale-[1.03]`}
                >
                  <card.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-tight text-neutral-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {card.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {card.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-14 max-w-xl text-center text-sm text-neutral-500 dark:text-neutral-400">
          See how it fits together on the{" "}
          <Link
            href={funnel}
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            Growth System
          </Link>{" "}
          page, or explore{" "}
          <Link
            href="/services"
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            Services
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
