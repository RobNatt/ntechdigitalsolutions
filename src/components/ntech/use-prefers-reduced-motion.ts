"use client";

import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reads the reduced-motion preference without a setState-in-effect.
 * Every timed sequence on this site (the hero log, the circuit current) renders
 * complete and still when this is true.
 */
export function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const list = window.matchMedia(QUERY);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
