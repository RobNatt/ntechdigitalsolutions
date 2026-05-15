"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const FEATURES = [
  {
    title: "Built for Conversion",
    description: "Every website is designed to turn visitors into measurable business opportunities.",
  },
  {
    title: "Traffic With Intent",
    description: "Targeted advertising campaigns focused on attracting qualified customers.",
  },
  {
    title: "Clear Performance Tracking",
    description: "Monitor leads, campaigns, and customer activity through live dashboards.",
  },
  {
    title: "Fast & Modern Systems",
    description: "Clean, responsive experiences optimized for speed and usability.",
  },
  {
    title: "Data-Driven Decisions",
    description: "Real insights that help improve marketing performance over time.",
  },
  {
    title: "Simple & Scalable",
    description: "Lean systems designed to grow without unnecessary complexity.",
  },
] as const;

export function HomeWhyChooseNtech() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-t border-neutral-200/50 bg-white py-24 md:py-32 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="why-choose-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="why-choose-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            Why Businesses Choose Our Website Development Company
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Built to create measurable growth through connected website development services and digital systems.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Conversion-focused sites, targeted ads, and live lead views are wired as one flow—so you can
            see what drove what, without juggling disconnected tools.
          </p>
        </header>

        <ul className="mt-16 grid list-none gap-7 sm:mt-24 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10 md:gap-x-16 md:gap-y-12">
          {FEATURES.map((item, index) => (
            <li key={item.title}>
              <motion.article
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 16 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.22, margin: "0px 0px -40px 0px" },
                      transition: {
                        duration: 0.48,
                        delay: Math.min(index * 0.055, 0.28),
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    })}
                className="group h-full rounded-xl border border-neutral-200/80 bg-white px-6 py-6 transition duration-300 ease-out hover:border-neutral-300/90 hover:bg-neutral-50/80 hover:shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:px-7 sm:py-7 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/55 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
              >
                <div className="flex gap-4">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200/70 bg-neutral-50/90 text-neutral-500 transition duration-300 group-hover:border-neutral-300 group-hover:bg-white group-hover:text-neutral-600 dark:border-neutral-700/90 dark:bg-neutral-900/70 dark:text-neutral-400 dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-900 dark:group-hover:text-neutral-300"
                    aria-hidden
                  >
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium tracking-tight text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
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
