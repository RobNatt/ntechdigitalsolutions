import Link from "next/link";

const PLACEHOLDER_SLOTS = [1, 2, 3, 4, 5] as const;

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
            Our first five case studies are being written right now.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            We&apos;re intentionally underpricing the system to get honest, verifiable results from real
            businesses before raising rates. Results land here as they come in.
          </p>
        </header>

        <ul className="mt-14 grid list-none gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-5">
          {PLACEHOLDER_SLOTS.map((slot) => (
            <li key={slot}>
              <div className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white/60 p-5 text-neutral-400 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-600">
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Case study {slot}
                </span>
                <span className="text-sm">Results coming soon</span>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <Link
            href="/case-studies"
            className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-2 transition hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
          >
            Want to be one of the first five?
          </Link>
        </p>
      </div>
    </section>
  );
}
