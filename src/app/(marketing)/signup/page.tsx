import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ntech/PageShell";
import { canonicalUrl } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  title: "Sign Up | N-Tech Digital Solutions",
  description:
    "Create an N-Tech Digital Solutions account or register interest for client dashboards and tools.",
  alternates: { canonical: canonicalUrl("/signup") },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <PageShell
      eyebrow="Sign up"
      title="Client accounts are provisioned after kickoff."
      lede="We create your workspace once your system is being installed, so there is nothing to register for yet."
      close="none"
    >
      <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ink">
        <p>
          The fastest way to get started is to{" "}
          <Link href="/book-call" className="font-semibold underline underline-offset-4">
            book a call
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold underline underline-offset-4">
            send us a message
          </Link>
          .
        </p>
        <p className="text-muted-ink">
          Already invited?{" "}
          <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
            Log in
          </Link>{" "}
          instead.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-rule-strong bg-white p-6">
        <p className="type-data text-[0.75rem] uppercase text-muted-ink">Handoff</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
          TODO(client): wire self-serve registration here (Supabase auth sign-up or magic link) if
          client accounts ever become self-provisioned. Page is noindex until then.
        </p>
      </div>
    </PageShell>
  );
}
