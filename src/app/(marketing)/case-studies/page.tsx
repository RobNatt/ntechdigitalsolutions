import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Case Studies | N-Tech Digital Solutions",
  description:
    "Selected stories from websites, lead systems, and automations we've shipped for local and regional businesses.",
};

const PLACEHOLDER_STUDIES = [
  {
    title: "Local services — lead routing",
    teaser:
      "Form + CRM handoff, SMS alerts, and a single dashboard so the owner could respond within minutes.",
  },
  {
    title: "B2B — funnel refresh",
    teaser:
      "Restructured offer pages, clearer CTAs, and event tracking that finally showed which channel paid off.",
  },
  {
    title: "E-commerce adjacent — quote requests",
    teaser:
      "High-intent quote flow with automated follow-up sequences and calendar booking for sales calls.",
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <MarketingPageShell
      title="Case studies"
      subtitle="Detailed write-ups and metrics are being prepared for publication. Below are the narratives we&apos;re fleshing out for review."
    >
      <ul className="list-none space-y-8 p-0">
        {PLACEHOLDER_STUDIES.map((s) => (
          <li
            key={s.title}
            className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/40"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{s.title}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">{s.teaser}</p>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-500">Full case study — coming soon.</p>
          </li>
        ))}
      </ul>
      <p>
        Want something similar?{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Start a project conversation
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}
