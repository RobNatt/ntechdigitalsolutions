"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AnalyticsTracker = dynamic(
  () => import("./AnalyticsTracker").then((m) => ({ default: m.AnalyticsTracker })),
  { ssr: false }
);

const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

/** Loads first-party + Vercel analytics after hydration so they stay off the critical path. */
export function DeferredAnalyticsRoot() {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <Analytics />
    </>
  );
}
