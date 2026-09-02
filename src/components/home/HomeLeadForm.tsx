"use client";

import { useEffect, useRef, useState } from "react";
import { GhlIntakeFlow } from "@/components/marketing/GhlIntakeFlow";
import { cn } from "@/lib/utils";

/** Reveals with a slide-up-and-fade the first time the section enters the viewport. */
function useSlideInReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

export function HomeLeadForm() {
  const { ref, revealed } = useSlideInReveal<HTMLDivElement>();

  return (
    <section
      className="border-t border-neutral-200/70 bg-white py-20 md:py-28 dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby="home-lead-form-heading"
    >
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-xl px-4 transition-all duration-700 ease-out sm:px-6 lg:px-8",
          revealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        )}
      >
        <div className="text-center">
          <h2
            id="home-lead-form-heading"
            className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl dark:text-white"
          >
            Not ready to book a call yet?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Leave your info and we&apos;ll follow up — no obligation.
          </p>
        </div>

        <div className="mt-10">
          <GhlIntakeFlow analyticsSurface="home" />
        </div>
      </div>
    </section>
  );
}
