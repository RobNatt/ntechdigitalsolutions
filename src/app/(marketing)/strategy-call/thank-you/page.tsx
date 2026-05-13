import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { CONSTANTS } from "@/constants/links";

const title = "Thanks for Reaching Out | N-Tech Digital Solutions";

export const metadata: Metadata = {
  title,
  description: "We received your strategy call request and will review your details.",
  robots: { index: false, follow: false },
};

export default function StrategyCallThankYouPage() {
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white px-4 py-20 dark:from-neutral-950 dark:to-neutral-900 sm:py-28">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <Check className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Thanks for Reaching Out
        </h1>
        <p className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          We&apos;ve received your information and will review your project details shortly. If we believe we&apos;re a
          strong fit, a member of our team will contact you directly.
        </p>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">We appreciate your interest in NTech.</p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-xl bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Back to home
        </Link>
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
          Questions in the meantime?{" "}
          <Link href={CONSTANTS.CONTACT_PATH} className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
