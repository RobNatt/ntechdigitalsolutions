import SignInCard from "@/components/SignInCard";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <Link href="/" className="mb-6 text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to home
      </Link>
      <SignInCard />
    </main>
  );
}
