const STEPS = [
  {
    number: "01",
    title: "Book a call",
    description:
      "We walk through what's leaking leads in your business today — missed calls, slow follow-up, inconsistent reviews — and show you what the system looks like for you specifically.",
  },
  {
    number: "02",
    title: "We build it, free",
    description:
      "Website, AI receptionist, lead automation, social media setup, and review automation — built and configured for your business. No separate build fee, ever.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Your system goes live. Calls get answered, leads get followed up within minutes, and reviews start routing automatically — from day one.",
  },
  {
    number: "04",
    title: "Optimize",
    description:
      "We monitor what's working and refine the system as real results come in, so it keeps getting better the longer you run it.",
  },
] as const;

export function HomeProcessSteps() {
  return (
    <section className="border-t border-neutral-200/70 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            How we get you started
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl dark:text-white">
            Live in four steps
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 md:mt-20">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-600">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-medium text-neutral-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
