import { Check } from "lucide-react";

const FEATURES = [
  {
    title: "Every Call Gets Answered",
    description: "The AI receptionist picks up what your team can't — nights, weekends, and busy hours included.",
  },
  {
    title: "Leads Followed Up in Minutes",
    description: "Form submissions and calls hit your CRM instantly, with automatic follow-up before the lead goes cold.",
  },
  {
    title: "Social Presence That Converts",
    description: "Facebook and Instagram management with automation that turns engagement into real leads.",
  },
  {
    title: "Your Rating, Protected",
    description: "5-star experiences go public. Everything else is caught privately, before it becomes a review.",
  },
  {
    title: "One Flat Monthly Retainer",
    description: "No separate build fee, no juggling five vendors — one system, one bill.",
  },
  {
    title: "Built to Scale With You",
    description: "The same infrastructure that works for one location is built to expand as you grow.",
  },
] as const;

export function HomeWhyChooseNtech() {
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
            Why Local Businesses Choose N-Tech
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Most agencies sell you a website and leave the rest to hope. We install the infrastructure
            that catches and converts every lead the website generates.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Website, AI receptionist, lead automation, social media, and reviews — wired as one system,
            not five disconnected tools.
          </p>
        </header>

        <ul className="mt-16 grid list-none gap-7 sm:mt-24 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10 md:gap-x-16 md:gap-y-12">
          {FEATURES.map((item, index) => (
            <li key={item.title}>
              <article
                tabIndex={0}
                className="group h-full rounded-xl border border-neutral-200/80 bg-white px-6 py-6 outline-none transition duration-300 ease-out hover:-translate-y-0.5 hover:border-neutral-300/90 hover:bg-neutral-50/80 hover:shadow-[0_2px_12px_rgba(15,23,42,0.05)] focus-visible:-translate-y-0.5 focus-visible:border-neutral-300/90 focus-visible:ring-2 focus-visible:ring-neutral-900/20 sm:px-7 sm:py-7 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/55 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)] dark:focus-visible:ring-white/20"
              >
                <div className="flex gap-4">
                  <div
                    className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200/70 bg-neutral-50/90 text-neutral-500 transition duration-300 group-hover:border-neutral-300 group-hover:bg-white group-hover:text-neutral-600 dark:border-neutral-700/90 dark:bg-neutral-900/70 dark:text-neutral-400 dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-900 dark:group-hover:text-neutral-300"
                    aria-hidden
                  >
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                    <span
                      className="why-status-dot absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium tracking-tight text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="why-card-desc">
                      <p className="overflow-hidden text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        <span className="block pt-2.5">{item.description}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
