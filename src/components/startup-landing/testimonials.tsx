"use client";

import { BsStarFill } from "react-icons/bs";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const TESTIMONIALS = [
  {
    quote:
      "N-Tech built us a website and lead funnel in under two weeks. Within the first month, our inbound calls tripled. The AI follow-up system alone has been worth every penny.",
    initials: "MR",
    name: "Mike R.",
    title: "Owner, Riverside Plumbing",
  },
  {
    quote:
      "We went from barely showing up on Google to ranking #1 for our top keyword in 60 days. The site is fast, looks incredible on mobile, and leads come in while I sleep.",
    initials: "SL",
    name: "Sarah L.",
    title: "Owner, Bloom Salon Studio",
  },
  {
    quote:
      "I was skeptical about AI automation, but N-Tech made it seamless. The dashboard shows me exactly where every lead comes from and what they're worth. Game changer for our firm.",
    initials: "JM",
    name: "James M.",
    title: "Managing Partner, Martinez Law",
  },
] as const;

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative isolate w-full overflow-hidden bg-neutral-50 py-20 md:py-24 dark:bg-neutral-900"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          — Client results
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl dark:text-neutral-100">
          <span className="block">Real businesses.</span>
          <span className="block">Real growth.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.initials}
              className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/80 dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-0.5" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <BsStarFill
                      key={i}
                      className="h-4 w-4 text-amber-400 dark:text-amber-400/90"
                    />
                  ))}
                </div>
                <span
                  className="select-none font-serif text-5xl leading-none text-neutral-200 dark:text-neutral-700"
                  aria-hidden
                >
                  &ldquo;
                </span>
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                {t.quote}
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-neutral-100 pt-6 dark:border-neutral-800">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-inner"
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t.title}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
