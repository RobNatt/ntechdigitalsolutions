"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const FEATURES = [
  {
    title: "Conversion-First Design",
    description: "Every page is structured to generate action, not just look good.",
  },
  {
    title: "Built for Speed & SEO",
    description: "Fast-loading experiences optimized for search visibility.",
  },
  {
    title: "Transparent Reporting",
    description: "Clear dashboards and measurable performance tracking.",
  },
  {
    title: "AI-Enhanced Workflows",
    description: "Automations that reduce repetitive operational work.",
  },
  {
    title: "Focused on ROI",
    description: "Every system is designed around measurable business outcomes.",
  },
  {
    title: "Lean & Efficient",
    description: "No bloated retainers or unnecessary complexity.",
  },
] as const;

export function HomeWhyChooseNtech() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-t border-neutral-200/60 bg-white py-20 md:py-28 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="why-choose-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="why-choose-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            Why Businesses Choose NTech
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Built for measurable growth, not vanity metrics.
          </p>
        </header>

        <ul className="mt-16 grid list-none gap-6 sm:mt-20 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 md:gap-x-14 md:gap-y-10">
          {FEATURES.map((item, index) => (
            <li key={item.title}>
              <motion.article
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 18 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.25, margin: "0px 0px -48px 0px" },
                      transition: {
                        duration: 0.5,
                        delay: Math.min(index * 0.06, 0.3),
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    })}
                className="group h-full rounded-xl border border-neutral-200/90 bg-white px-5 py-5 transition duration-300 ease-out hover:border-neutral-300 hover:bg-neutral-50/90 hover:shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/60 dark:hover:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
              >
                <div className="flex gap-4">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 text-neutral-500 transition duration-300 group-hover:border-neutral-300 group-hover:bg-white group-hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-400 dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-900 dark:group-hover:text-neutral-200"
                    aria-hidden
                  >
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium tracking-tight text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
