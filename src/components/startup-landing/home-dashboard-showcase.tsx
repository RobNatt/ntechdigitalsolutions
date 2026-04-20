"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HolographicDashboardTabs = dynamic(
  () =>
    import("@/components/dashboard/HolographicDashboardTabs").then((m) => ({
      default: m.HolographicDashboardTabs,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[min(68vh,640px)] w-full items-center justify-center rounded-3xl border border-neutral-200/70 bg-neutral-100/40 dark:border-neutral-700/80 dark:bg-neutral-800/25 md:h-[min(72vh,720px)]"
        aria-hidden
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-300/80 dark:bg-neutral-600/50" />
      </div>
    ),
  }
);

/** Holographic dashboard demo — lives above pricing on the home page. */
export function HomeDashboardShowcase() {
  return (
    <section
      id="home-dashboard"
      aria-label="Lead dashboard preview"
      className="relative z-10 w-full border-t border-neutral-200/80 bg-neutral-50 py-14 dark:border-neutral-800 dark:bg-neutral-900 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-1 sm:px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <HolographicDashboardTabs className="h-[min(68vh,640px)] md:h-[min(72vh,720px)]" />
        </motion.div>
      </div>
    </section>
  );
}
