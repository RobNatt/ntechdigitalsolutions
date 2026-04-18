"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Marketing funnel routes (same origin) — open in this tab from the CEO dashboard. */
const FUNNEL_PAGE_GROUPS = [
  {
    title: "Conversion",
    items: [{ href: "/free-patient-flow-audit", label: "Free Patient Flow Audit™" }],
  },
  {
    title: "Dental funnel landings",
    items: [
      { href: "/dental-patient-growth-case-study", label: "Dental patient growth case study" },
      { href: "/why-dental-practices-trust-ntech-digital", label: "Why dental practices trust N-Tech" },
      { href: "/new-patient-leak-funnel", label: "New patient leak funnel" },
      { href: "/why-dental-website-isnt-booking-patients", label: "Why your dental website isn't booking patients" },
      { href: "/why-agencies-fail-dentists", label: "Why agencies fail dentists" },
      { href: "/cost-of-lost-patients", label: "Cost of lost patients" },
      { href: "/dental-roi-calculator", label: "Dental ROI calculator" },
    ],
  },
  {
    title: "PatientFlow™ offers",
    items: [
      { href: "/patientflow-foundation", label: "PatientFlow Foundation™" },
      { href: "/patientflow-lead-machine", label: "PatientFlow Lead Machine™" },
      { href: "/patientflow-growth-system", label: "PatientFlow Growth System™" },
      { href: "/patientflow-premium-partner", label: "Premium Growth Partner™" },
    ],
  },
] as const;

export function CeoFunnelPagesSection() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-neutral-100">Funnel pages</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          Quick links to live marketing funnels. Opens the page on this site.
        </p>
      </div>

      <div className="space-y-8">
        {FUNNEL_PAGE_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-500">
              {group.title}
            </h3>
            <ul className="overflow-hidden rounded-xl border border-gray-300/80 bg-white/90 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/80">
              {group.items.map((item) => (
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
