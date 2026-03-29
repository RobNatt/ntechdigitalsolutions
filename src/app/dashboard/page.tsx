"use client";

import { HolographicDashboardTabs } from "@/components/dashboard/HolographicDashboardTabs";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100, 100, 100, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const seed = (i * 17 + 31) % 100;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-500 rounded-full animate-pulse"
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

      <HolographicDashboardTabs />
    </main>
  );
}
