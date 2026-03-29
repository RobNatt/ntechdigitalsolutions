"use client";

import { useEffect } from "react";
import { CONSTANTS } from "@/constants/links";

/**
 * Fire-and-forget POST when the user clicks an element with class `btn-primary`
 * (marketing CTAs only — not Login). Mirrors the static HTML snippet pattern.
 */
export function LeadAgentCtaPing() {
  useEffect(() => {
    const AGENT_URL = CONSTANTS.LEAD_AGENT_SUBMIT_API_URL;

    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest(".btn-primary");
      if (!el || !(el instanceof HTMLElement)) return;

      void fetch(AGENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "CTA Click",
          email: "unknown@pending.com",
          company: "Website Visitor",
          message: `Clicked: "${el.textContent?.trim() ?? ""}" on ${window.location.href}`,
          source: document.referrer || "direct",
        }),
        keepalive: true,
      }).catch(() => {});
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
