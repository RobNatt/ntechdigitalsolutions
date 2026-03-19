import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        404 — Page not found
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
      >
        Go to homepage
      </Link>
    </main>
  );
}
