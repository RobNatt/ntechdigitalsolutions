import type { ReactNode } from "react";
import { MarketingCtaCluster } from "@/components/marketing/MarketingCtaCluster";
import { cn } from "@/lib/utils";

type MarketingPageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Default: show CTA rail after content. Use compact on /contact to avoid duplicate “form” button. */
  cta?: "full" | "compact" | "none";
  /** Wider main column for long-form pages (e.g. services). */
  maxWidthClass?: string;
};

export function MarketingPageShell({
  title,
  subtitle,
  children,
  cta = "full",
  maxWidthClass = "max-w-3xl",
}: MarketingPageShellProps) {
  return (
    <main className={cn("mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16", maxWidthClass)}>
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
      {cta !== "none" ? (
        <MarketingCtaCluster
          className="mt-10"
          compactContact={cta === "compact"}
        />
      ) : null}
    </main>
  );
}
