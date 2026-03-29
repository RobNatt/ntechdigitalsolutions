"use client";

/**
 * Decorative diagonal streaks behind section content (theme-aware).
 */
export function ShootingStarsBackground() {
  const streaks = [
    { top: "8%", left: "78%", delay: "0s", duration: "4.2s" },
    { top: "22%", left: "92%", delay: "1.4s", duration: "5.5s" },
    { top: "38%", left: "65%", delay: "2.8s", duration: "4.8s" },
    { top: "12%", left: "42%", delay: "0.6s", duration: "6s" },
    { top: "52%", left: "88%", delay: "3.2s", duration: "5s" },
    { top: "68%", left: "55%", delay: "1.1s", duration: "4.5s" },
    { top: "30%", left: "28%", delay: "4s", duration: "5.8s" },
  ] as const;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {streaks.map((s, i) => (
        <div
          key={i}
          className="animate-features-shoot absolute h-px w-28 max-w-[40vw] bg-gradient-to-r from-transparent via-sky-500/55 to-transparent dark:via-sky-300/40 motion-reduce:animate-none"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
