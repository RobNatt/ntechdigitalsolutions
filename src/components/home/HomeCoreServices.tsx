import { AppWindow, Check, ChevronDown, ChevronRight, LayoutDashboard, Megaphone } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { GROWTH_SYSTEM_FUNNEL_PATH } from "@/constants/growth-system-offer";

const funnel = GROWTH_SYSTEM_FUNNEL_PATH;

const ICON_WRAP =
  "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400";

const CARDS = [
  {
    title: "Conversion Websites",
    description: "Modern websites designed to turn traffic into qualified leads.",
    bullets: ["Built for conversion", "Mobile optimized", "Fast & professional"],
    icon: AppWindow,
  },
  {
    title: "Targeted Advertising",
    description: "Strategic ad campaigns built to attract high-intent customers.",
    bullets: ["Google & Meta ads", "Local targeting", "Conversion optimization"],
    icon: Megaphone,
  },
  {
    title: "Lead Dashboards",
    description: "Track leads, monitor performance, and organize customer activity in one place.",
    bullets: ["Live reporting", "Lead management", "Performance tracking"],
    icon: LayoutDashboard,
  },
] as const;

function FlowConnector() {
  return (
    <div
      className="flex shrink-0 items-center justify-center py-1 md:w-14 md:self-stretch md:py-0 lg:w-16"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center md:hidden">
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-200/80 to-transparent dark:via-blue-800/45" />
        <div className="my-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-100/90 bg-blue-50/80 text-blue-600 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-400">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-200/80 to-transparent dark:via-blue-800/45" />
      </div>
      <div className="hidden h-full flex-col items-center justify-center md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100/90 bg-white text-blue-600 shadow-sm ring-4 ring-[#f8f9fb] dark:border-blue-900/60 dark:bg-neutral-900 dark:text-blue-400 dark:ring-neutral-950">
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export function HomeCoreServices() {
  return (
    <section
      className="border-t border-neutral-200/70 bg-[#f8f9fb] py-20 md:py-32 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="core-services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="core-services-heading"
            className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-[2.5rem] lg:leading-tight dark:text-white"
          >
            Website Development Services Built as One Growth System
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            A website design company framework with three connected systems that drive traffic, convert visitors, and
            track growth.
          </p>
        </div>

        <div className="relative mt-16 md:mt-24">
          <div className="flex flex-col items-stretch gap-10 md:flex-row md:items-stretch md:justify-center md:gap-6 lg:gap-10 xl:gap-14">
            {CARDS.map((card, index) => (
              <Fragment key={card.title}>
                {index > 0 ? <FlowConnector /> : null}
                <article className="group relative flex min-w-0 flex-1 flex-col rounded-xl border border-neutral-200/90 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200/90 hover:shadow-[0_16px_48px_-16px_rgba(37,99,235,0.14),0_4px_20px_-4px_rgba(15,23,42,0.08)] md:max-w-none lg:p-9 dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:hover:border-blue-500/40 dark:hover:shadow-[0_16px_48px_-16px_rgba(59,130,246,0.18)]">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${ICON_WRAP} transition duration-300 group-hover:scale-[1.04]`}
                  >
                    <card.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-6 text-lg font-medium tracking-tight text-neutral-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {card.description}
                  </p>
                  <ul className="mt-7 space-y-2.5 border-t border-neutral-100 pt-6 dark:border-neutral-800/80">
                    {card.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400"
                      >
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
              </Fragment>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-16 max-w-xl text-center text-sm text-neutral-500 dark:text-neutral-400 md:mt-20">
          Explore{" "}
          <Link
            href="/services/websites-and-leads"
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            website development services
          </Link>
          ,{" "}
          <Link
            href={funnel}
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            targeted advertising
          </Link>
          , and{" "}
          <Link
            href="/services/automation-and-crm"
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            lead tracking dashboards
          </Link>
          . See how it fits together on the{" "}
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
