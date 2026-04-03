import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "About | N-Tech Digital Solutions",
  description:
    "N-Tech Digital Solutions builds websites, lead systems, and automation for businesses that want measurable growth.",
};

export default function AboutPage() {
  return (
    <MarketingPageShell
      title="About"
      subtitle="We&apos;re a small team obsessed with systems: clear messaging, fast sites, and pipelines that don&apos;t depend on heroics."
    >
      <p>
        Based in Omaha, we work with local and regional businesses that are ready to invest in a web
        presence and lead flow that compounds — not one-off pages that sit still after launch.
      </p>
      <p>
        Our projects usually combine design, engineering, and light process design so your team
        actually uses what we ship.
      </p>
      <p>
        Curious if we&apos;re a fit?{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Contact us
        </Link>{" "}
        or{" "}
        <Link
          href="/services"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          browse services
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}
