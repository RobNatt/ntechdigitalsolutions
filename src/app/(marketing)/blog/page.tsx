import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Blog | N-Tech Digital Solutions",
  description:
    "Notes on lead generation, web performance, automation, and growing a local business online.",
};

const UPCOMING = [
  {
    title: "What belongs on your homepage above the fold",
    date: "Draft",
  },
  {
    title: "Lead forms that don't leak: a short checklist",
    date: "Draft",
  },
  {
    title: "When to automate vs. when to keep it human",
    date: "Draft",
  },
] as const;

export default function BlogPage() {
  return (
    <MarketingPageShell
      title="Blog"
      subtitle="Practical articles for owners who care about conversion, not jargon. The archive is under construction."
    >
      <p>
        Subscribe from the site footer when the newsletter goes live, or{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          reach out
        </Link>{" "}
        if you want a topic covered.
      </p>
      <h2 className="pt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
        Upcoming posts
      </h2>
      <ul className="mt-4 list-none space-y-4 p-0">
        {UPCOMING.map((post) => (
          <li
            key={post.title}
            className="flex flex-col gap-1 border-b border-neutral-200 pb-4 dark:border-neutral-800 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="font-medium text-neutral-900 dark:text-white">{post.title}</span>
            <span className="text-sm text-neutral-500">{post.date}</span>
          </li>
        ))}
      </ul>
    </MarketingPageShell>
  );
}
