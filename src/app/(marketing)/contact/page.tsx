import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact | N-Tech Digital Solutions",
  description:
    "Reach N-Tech Digital Solutions for project inquiries, partnerships, and support — Omaha and remote-friendly.",
};

type ContactPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const sp = await searchParams;
  const planInterest =
    typeof sp.plan === "string" && sp.plan.trim() ? sp.plan.trim() : undefined;

  return (
    <MarketingPageShell
      title="Contact"
      subtitle="Tell us what you&apos;re trying to fix — traffic, leads, follow-up, or all of the above. We&apos;ll respond with next steps."
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Send a message</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Same details we used to collect on our intake form: your name, email, company (optional),
          phone (optional), and what you need. We email our team immediately and reply to you by email.
        </p>
        <div className="mt-6">
          <MarketingInquiryForm planInterest={planInterest} />
        </div>
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
