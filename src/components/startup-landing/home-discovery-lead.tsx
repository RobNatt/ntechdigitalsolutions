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
    </aside>
  );
}
