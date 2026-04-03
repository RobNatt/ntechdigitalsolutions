import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { CONSTANTS } from "@/constants/links";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact | N-Tech Digital Solutions",
  description:
    "Reach N-Tech Digital Solutions for project inquiries, partnerships, and support — Omaha and remote-friendly.",
};

export default function ContactPage() {
  return (
    <MarketingPageShell
      title="Contact"
      subtitle="Tell us what you&apos;re trying to fix — traffic, leads, follow-up, or all of the above. We&apos;ll respond with next steps."
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Start with the lead form</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          The fastest path is our structured intake — it helps us scope without endless back-and-forth.
        </p>
        <Link
          href={CONSTANTS.LEAD_AGENT_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Open lead form
        </Link>
      </div>
      <div className="space-y-3 pt-4">
        <p>
          <span className="font-semibold text-neutral-900 dark:text-white">Email: </span>
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="text-neutral-700 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-neutral-300 dark:hover:decoration-white"
          >
            {SITE_CONTACT_EMAIL}
          </a>
        </p>
        <p>
          <span className="font-semibold text-neutral-900 dark:text-white">Phone: </span>
          <a
            href={`tel:${SITE_BUSINESS_PHONE.replace(/\s/g, "")}`}
            className="text-neutral-700 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-neutral-300 dark:hover:decoration-white"
          >
            {SITE_BUSINESS_PHONE}
          </a>
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-900 dark:text-white">Location: </span>
          Omaha, Nebraska — serving clients locally and remotely.
        </p>
      </div>
    </MarketingPageShell>
  );
}
