"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { getMarketingFunnelNichesForDashboard } from "@/constants/marketing-funnel-pages";

const FUNNEL_NICHES = getMarketingFunnelNichesForDashboard();

export function CeoFunnelPagesSection() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-neutral-100">Funnel pages</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          Quick links to live marketing funnels by niche. Opens the page on this site.
        </p>
      </div>

      <div className="space-y-8">
        {FUNNEL_NICHES.map((section) => (
          <div key={section.niche}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-500">
              {section.niche}
            </h3>
            <ul className="overflow-hidden rounded-xl border border-gray-300/80 bg-white/90 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/80">
              {section.items.map((item) => (
                <li key={item.href} className="border-b border-gray-200/90 last:border-b-0 dark:border-neutral-800">
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-neutral-100 dark:hover:bg-neutral-800/80"
                  >
                    <span className="min-w-0">{item.label}</span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-500"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
