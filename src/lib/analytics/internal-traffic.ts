"use client";

import { ANALYTICS_STORAGE_KEYS } from "@/constants/analytics";

const INTERNAL_METADATA_KEY = "internal_traffic";

export function isAnalyticsOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ANALYTICS_STORAGE_KEYS.internalOptOut) === "1";
  } catch {
    return false;
  }
}

export function setAnalyticsOptOut(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      localStorage.setItem(ANALYTICS_STORAGE_KEYS.internalOptOut, "1");
      return;
    }
    localStorage.removeItem(ANALYTICS_STORAGE_KEYS.internalOptOut);
  } catch {
    /* ignore storage failures */
  }
}

export function getInternalAnalyticsMetadata(): Record<string, boolean> {
  return isAnalyticsOptedOut() ? { [INTERNAL_METADATA_KEY]: true } : {};
}
