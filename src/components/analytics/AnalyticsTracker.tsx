"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VID = "ntech_vid";
const SID = "ntech_sid";
const PV_DEDUPE = "ntech_pv_ts";

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VID);
    if (existing && existing.length > 8) return existing;
    const v = randomId();
    localStorage.setItem(VID, v);
    return v;
  } catch {
    return randomId();
  }
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SID);
    if (existing && existing.length > 8) return existing;
    const s = randomId();
    sessionStorage.setItem(SID, s);
    return s;
  } catch {
    return randomId();
  }
}

function parseUtm(search: string): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  const p = new URLSearchParams(search);
  return {
    utmSource: p.get("utm_source"),
    utmMedium: p.get("utm_medium"),
    utmCampaign: p.get("utm_campaign"),
  };
}

/**
 * First-party pageview + SPA navigation tracking. Set NEXT_PUBLIC_ANALYTICS_WRITE_KEY
 * to the write_key from analytics_site_keys for this deployment’s company.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const writeKey = process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY?.trim();

  useEffect(() => {
    if (!writeKey) return;

    const path =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    try {
      const prev = sessionStorage.getItem(PV_DEDUPE);
      const key = path;
      if (prev) {
        const [k, t] = prev.split("|");
        const ts = Number(t);
        if (k === key && !Number.isNaN(ts) && Date.now() - ts < 2500) return;
      }
      sessionStorage.setItem(PV_DEDUPE, `${key}|${Date.now()}`);
    } catch {
      /* ignore */
    }

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const utm = parseUtm(searchParams?.toString() ?? "");

    const payload = {
      writeKey,
      path,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      sessionId,
      visitorId,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      eventType: "pageview",
    };

    const body = JSON.stringify(payload);
    void fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* ignore */
    });
  }, [pathname, searchParams, writeKey]);

  return null;
}
