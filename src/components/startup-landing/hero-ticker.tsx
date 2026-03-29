"use client";

const TICKER_ITEMS = [
  "AI-Powered Lead Generation",
  "SEO-Optimized Websites",
  "WordPress Development",
  "Automated Lead Funnels",
  "Conversion Tracking",
  "Small Business Growth",
  "AI Lead Automation",
] as const;

export function HeroTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative z-20 mx-auto mb-10 w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-muted/50 py-2.5 shadow-[var(--shadow-derek)] md:mb-16 dark:bg-muted/30"
      role="region"
      aria-label="Service highlights"
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
