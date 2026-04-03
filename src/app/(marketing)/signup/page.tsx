import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Sign Up | N-Tech Digital Solutions",
  description:
    "Create an N-Tech Digital Solutions account or register interest for client dashboards and tools.",
};

export default function SignupPage() {
  return (
    <MarketingPageShell
      title="Sign up"
      subtitle="Client accounts are provisioned after we kick off your project or grant access to a workspace. Use this page as the public entry point while backend registration is wired up."
    >
      <p>
        For now, the fastest way to get started is our{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          contact
        </Link>{" "}
        flow or the structured lead form linked from there.
      </p>
      <p>
        Already invited?{" "}
        <Link
          href="/login"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Log in
        </Link>{" "}
        instead.
      </p>
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
        Placeholder: drop in Supabase auth sign-up, magic link, or your SSO flow when ready.
      </div>
    </MarketingPageShell>
  );
}
