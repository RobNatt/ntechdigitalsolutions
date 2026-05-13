"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What exactly does NTech provide?",
    answer:
      "We build connected growth systems that combine conversion-focused websites, targeted advertising, and lead tracking dashboards to help businesses generate and manage more qualified leads.",
  },
  {
    question: "Why combine websites, ads, and dashboards together?",
    answer:
      "Most businesses use disconnected tools that make it difficult to track performance and optimize growth. Our systems are designed to work together so traffic, conversion, and lead tracking remain connected.",
  },
  {
    question: "Do you work with specific industries?",
    answer:
      "We primarily work with service-based businesses and companies looking to improve lead generation, visibility, and operational efficiency through modern digital systems.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Project timelines vary depending on scope, but most website and system builds are completed within a few weeks.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. We offer ongoing support, optimization, reporting, and growth-focused improvements depending on the needs of the business.",
  },
  {
    question: "Will I be able to track leads and performance?",
    answer:
      "Yes. Our dashboards provide visibility into lead activity, campaign performance, and customer engagement in one centralized location.",
  },
  {
    question: "Do I need all three services to work with you?",
    answer:
      "Not necessarily. However, businesses typically see stronger results when websites, advertising, and tracking systems are connected strategically.",
  },
  {
    question: "How do we get started?",
    answer:
      "Start by scheduling a strategy call. We'll learn more about your business, current systems, and growth goals to determine whether we're a strong fit.",
  },
];

export function HomeFaq() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="border-t border-neutral-200/70 bg-neutral-50 py-20 md:py-28 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="home-faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.25 },
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
              })}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="home-faq-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Answers to common questions about our growth systems and process.
          </p>
        </motion.div>

        <div className="mt-12 space-y-3 md:mt-14">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `home-faq-panel-${index}`;
            const buttonId = `home-faq-button-${index}`;

            return (
              <motion.div
                key={item.question}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 12 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.2 },
                      transition: { duration: 0.35, delay: index * 0.04 },
                    })}
                className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  >
                    <span className="text-sm font-medium text-neutral-900 md:text-base dark:text-neutral-100">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300 ${
                        isOpen ? "rotate-180 border-sky-200 text-sky-600 dark:border-sky-800 dark:text-sky-400" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 md:px-6 md:pb-6 md:text-[15px] dark:text-neutral-300">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
