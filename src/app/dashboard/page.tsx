"use client";

import { HolographicDashboardTabs } from "@/components/dashboard/HolographicDashboardTabs";

export default function DashboardPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-8">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06]">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.28)_1px,transparent_1px)] bg-[length:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]"
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const seed = (i * 17 + 31) % 100;
          return (
            <div
              key={i}
              className="absolute h-1 w-1 animate-pulse rounded-full bg-neutral-400 dark:bg-neutral-600"
              style={{
                left: `${(seed * 7) % 100}%`,
                top: `${(seed * 13) % 100}%`,
                animationDelay: `${(seed % 3)}s`,
                animationDuration: `${2 + (seed % 3)}s`,
              }}
            />
          );
        })}
      </div>

      <HolographicDashboardTabs variant="ceo" />
    </main>
  );
}
