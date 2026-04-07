import { ANALYTICS_STORAGE_KEYS } from "@/constants/analytics";

/** Browser-only: ties form submissions to first-party analytics session/visitor. */
export function readAnalyticsClientIds(): { sessionId?: string; visitorId?: string } {
  if (typeof window === "undefined") return {};
  try {
    const visitorId = localStorage.getItem(ANALYTICS_STORAGE_KEYS.visitorId) ?? undefined;
    const sessionId = sessionStorage.getItem(ANALYTICS_STORAGE_KEYS.sessionId) ?? undefined;
    return {
      ...(visitorId && visitorId.length > 4 ? { visitorId } : {}),
      ...(sessionId && sessionId.length > 4 ? { sessionId } : {}),
    };
  } catch {
    return {};
  }
}
