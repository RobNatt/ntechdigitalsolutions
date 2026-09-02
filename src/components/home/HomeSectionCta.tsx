import { GetMoreInfoButton } from "@/components/scheduling/GetMoreInfoButton";

interface HomeSectionCtaProps {
  eyebrow: string;
  heading: string;
  ctaLabel?: string;
}

/** Lightweight CTA band placed at the bottom of alternating homepage sections (never the hero). */
export function HomeSectionCta({ eyebrow, heading, ctaLabel = "Get more info" }: HomeSectionCtaProps) {
  return (
    <div className="border-t border-neutral-200/70 bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:text-left lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {eyebrow}
          </p>
          <p className="mt-1.5 text-lg font-medium tracking-tight text-neutral-900 dark:text-white">{heading}</p>
        </div>
        <GetMoreInfoButton className="inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          {ctaLabel}
        </GetMoreInfoButton>
      </div>
    </div>
  );
}
