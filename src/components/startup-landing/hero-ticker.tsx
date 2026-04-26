"use client";

const TRUST_STRIP_ITEMS = [
  "12 Omaha businesses.",
  "Avg 3.4× lead increase in 90 days",
  "Rank top 5 in Google first month of Lead Machine",
] as const;

export function HeroTicker() {
  const loop = [...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS];

  return (
    <div
      className="relative z-20 mx-auto mb-10 w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-muted/50 py-2.5 shadow-[var(--shadow-derek)] md:mb-16 dark:bg-muted/30"
      role="region"
      aria-label="Results and trust highlights"
    >
      <div className="animate-hero-ticker flex w-max gap-8 md:gap-12">
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-flex shrink-0 items-center gap-8 md:gap-12"
          >
            <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
              {label}
            </span>
            <span
              aria-hidden
              className="select-none text-muted-foreground/50"
            >
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
