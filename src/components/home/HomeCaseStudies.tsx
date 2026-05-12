"use client";

import { Check } from "lucide-react";

type CaseStudy = {
  industry: string;
  imageSrc: string;
  imageAlt: string;
  badges: readonly { label: string }[];
  challenge: string;
  solution: string;
  results: readonly string[];
};

const CASE_STUDIES: readonly CaseStudy[] = [
  {
    industry: "Roofing Company",
    imageSrc: "/roof-mockup.png",
    imageAlt: "Roofing company website preview in a browser frame",
    badges: [{ label: "+42% form fills" }, { label: "Core Web Vitals" }],
    challenge: "Outdated website with poor mobile conversion.",
    solution: "Redesigned the site with conversion-focused layouts and local SEO optimization.",
    results: [
      "+42% increase in lead submissions",
      "Faster mobile load times",
      "Improved local search visibility",
    ],
  },
  {
    industry: "HVAC Company",
    imageSrc: "/customer-dashboard-preview.png",
    imageAlt: "Lead and campaign dashboard preview",
    badges: [{ label: "Attribution" }, { label: "CPL trending down" }],
    challenge: "Running ads without clear lead tracking.",
    solution: "Built landing pages, reporting dashboards, and campaign tracking systems.",
    results: [
      "Lower cost per lead",
      "Clear attribution tracking",
      "Increased qualified inquiries",
    ],
  },
  {
    industry: "Dental Practice",
    imageSrc: "/new-site.png",
    imageAlt: "Modern dental practice website preview",
    badges: [{ label: "Bookings up" }, { label: "Mobile UX" }],
    challenge: "Low online visibility and outdated branding.",
    solution: "Modern website redesign with SEO-focused structure and optimized conversion paths.",
    results: [
      "Increased appointment requests",
      "Better mobile engagement",
      "Improved search rankings",
    ],
  },
];

function PreviewChrome() {
  return (
    <div
      className="flex h-9 shrink-0 items-center gap-2 border-b border-neutral-200/80 bg-neutral-100/95 px-3 dark:border-neutral-700/80 dark:bg-neutral-900/90"
      aria-hidden
    >
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
      </div>
      <div className="ml-1 flex min-w-0 flex-1 items-center rounded-md border border-neutral-200/80 bg-white/90 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950/80">
        <span className="truncate text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
          preview · live environment
        </span>
      </div>
    </div>
  );
}

export function HomeCaseStudies() {
  return (
    <section
      className="border-t border-neutral-200/60 bg-neutral-50 py-20 md:py-28 dark:border-neutral-800 dark:bg-neutral-900/40"
      aria-labelledby="case-studies-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="case-studies-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            Recent Growth Projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Real systems designed to improve visibility, conversion, and business performance.
          </p>
        </header>

        <ul className="mt-14 grid list-none gap-10 md:mt-20 md:grid-cols-3 md:gap-8 lg:mt-24 lg:gap-10">
          {CASE_STUDIES.map((cs) => (
            <li key={cs.industry}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_16px_48px_-20px_rgba(15,23,42,0.12)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)] dark:hover:border-neutral-700 dark:hover:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.45)]">
                <div className="overflow-hidden border-b border-neutral-200/80 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <PreviewChrome />
                  <div className="relative aspect-[16/11] w-full overflow-hidden">
                    <img
                      src={cs.imageSrc}
                      alt={cs.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/25 via-transparent to-transparent opacity-80 dark:from-neutral-950/50" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                      {cs.badges.map((b) => (
                        <span
                          key={b.label}
                          className="inline-flex items-center rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 shadow-sm backdrop-blur-sm dark:border-neutral-600/60 dark:bg-neutral-900/85 dark:text-neutral-100"
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-7 pt-6 md:px-7 md:pb-8 md:pt-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    Industry
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {cs.industry}
                  </h3>

                  <dl className="mt-6 space-y-5 text-sm">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Challenge
                      </dt>
                      <dd className="mt-1.5 leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {cs.challenge}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Solution
                      </dt>
                      <dd className="mt-1.5 leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {cs.solution}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Results
                      </dt>
                      <dd className="mt-2">
                        <ul className="space-y-2">
                          {cs.results.map((line) => (
                            <li
                              key={line}
                              className="flex items-start gap-2 text-sm leading-snug text-neutral-600 dark:text-neutral-400"
                            >
                              <Check
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
                                strokeWidth={2.5}
                                aria-hidden
                              />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
