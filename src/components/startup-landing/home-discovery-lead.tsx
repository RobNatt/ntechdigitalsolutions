"use client";

import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { cn } from "@/lib/utils";

type HeroDiscoveryLeadPanelProps = {
  className?: string;
};

/** Compact discovery CTA + form for the hero right column (large screens). */
export function HeroDiscoveryLeadPanel({ className }: HeroDiscoveryLeadPanelProps) {
  return (
    <aside
      className={cn("relative z-20 w-full max-w-md", className)}
      aria-label="Request a discovery call"
    >
      <div className="rounded-2xl border border-neutral-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-700/70 dark:bg-neutral-900/60 sm:p-5">
        <MarketingInquiryForm showBudget analyticsSurface="home_discovery" className="space-y-3.5" />
      </div>
      <p className="mt-2 text-center text-[11px] text-neutral-600 dark:text-neutral-400 lg:text-left">
        Serving Omaha and the Nebraska metro, with remote delivery nationwide.
      </p>
    </aside>
  );
}
