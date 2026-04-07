"use client";

import { ANALYTICS_STORAGE_KEYS } from "@/constants/analytics";

const MAX_METADATA_JSON = 1800;
const MAX_KEYS = 12;
const MAX_KEY_LEN = 64;
const MAX_STR_VAL = 240;

function parseUtmFromSearch(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const p = new URLSearchParams(search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
      const v = p.get(key);
      if (v) out[key] = v.trim().slice(0, 120);
    }
  } catch {
    /* ignore */
  }
  return out;
}

function sanitizeMetadata(
  raw: Record<string, unknown> | undefined
): Record<string, string | number | boolean> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string | number | boolean> = {};
  let n = 0;
  for (const [k0, v] of Object.entries(raw)) {
    if (n >= MAX_KEYS) break;
    const k = k0.slice(0, MAX_KEY_LEN);
    if (!k) continue;
    if (typeof v === "string") {
      out[k] = v.slice(0, MAX_STR_VAL);
      n++;
    } else if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
      n++;
    } else if (typeof v === "boolean") {
      out[k] = v;
      n++;
    }
  }
  return out;
}

/**
 * Fire a custom analytics event (same pipeline as pageviews). No-op without write key or ids.
 */
export function trackClientAnalyticsEvent(
  eventType: string,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const writeKey = process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY?.trim();
  if (!writeKey) return;

  let visitorId = "";
  let sessionId = "";
  try {
    visitorId = localStorage.getItem(ANALYTICS_STORAGE_KEYS.visitorId) ?? "";
    sessionId = sessionStorage.getItem(ANALYTICS_STORAGE_KEYS.sessionId) ?? "";
  } catch {
    return;
  }
  if (visitorId.length < 5 || sessionId.length < 5) return;

  const path = `${window.location.pathname}${window.location.search || ""}`;
  const utm = parseUtmFromSearch(window.location.search);
  const merged = sanitizeMetadata({ ...utm, ...metadata });
  let metadataPayload: Record<string, string | number | boolean> = merged;
  try {
    const s = JSON.stringify(metadataPayload);
    if (s.length > MAX_METADATA_JSON) {
      metadataPayload = { truncated: true };
    }
  } catch {
    metadataPayload = {};
  }

  const et = eventType.trim().slice(0, 64);
  if (!et || et.toLowerCase() === "inquiry_submit") return;

  void fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writeKey,
      path: path.slice(0, 2048),
      referrer: document.referrer ? document.referrer.slice(0, 2048) : null,
      sessionId,
      visitorId,
      eventType: et,
      metadata: metadataPayload,
    }),
    keepalive: true,
  }).catch(() => {
    /* ignore */
  });
}
