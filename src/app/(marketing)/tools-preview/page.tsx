import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Tools Preview | N-Tech Digital Solutions",
  description:
    "A preview of dashboards, widgets, and internal tools we use to run lead systems for clients.",
};

export default function ToolsPreviewPage() {
  return (
    <MarketingPageShell
      title="Tools preview"
      subtitle="We&apos;re polishing a set of client-facing previews for reporting, lead flow, and campaign health. Here&apos;s what to expect."
    >
      <p>
        This area will showcase interactive previews — think pipeline snapshots, form performance, and
        lightweight KPI views — without exposing live client data.
      </p>
      <p>
        If you&apos;re evaluating us for a build, ask for a guided walkthrough on{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Contact
        </Link>{" "}
        and we&apos;ll share the current demo environment.
      </p>
      <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
        Status: placeholder page for review — full tool previews ship with your engagement or as a
        packaged add-on.
      </p>
    </MarketingPageShell>
  );
}
