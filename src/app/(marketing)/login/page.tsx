import type { Metadata } from "next";
import Link from "next/link";
import SignInCard from "@/components/SignInCard";
import { canonicalUrl } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  title: "Login | N-Tech Digital Solutions",
  description: "Sign in to your N-Tech Digital Solutions account.",
  alternates: { canonical: canonicalUrl("/login") },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-12 lg:py-16">
      <Link
        href="/"
        className="mb-6 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to home
      </Link>
      <SignInCard />
      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
