import type { ReactNode } from "react";

type MarketingPageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MarketingPageShell({ title, subtitle, children }: MarketingPageShellProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </p>
        ) : null}
      </header>
      <div className="space-y-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </main>
  );
}
