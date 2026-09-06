"use client";

import { useEffect, useState } from "react";

/*
 * Live local time — Omaha's, not the visitor's.
 *
 * Omaha is the honest choice and the more useful one: a prospect looking N-Tech
 * up wants to know whether anyone is around, and it reinforces that this is a
 * local business rather than a faceless agency. Showing the VISITOR's clock
 * would be a party trick that tells them nothing.
 *
 * The hard line: this shows time and day, which are facts. It never shows
 * anything that looks like a statistic — no calls handled, no jobs booked, no
 * response times — because none of that is real yet and a fabricated number on
 * a site selling honesty is disqualifying.
 *
 * Renders nothing on the server. The server's clock and the visitor's differ,
 * so rendering a time during SSR guarantees a hydration mismatch.
 */

const FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: "America/Chicago",
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

export function LocalTime() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let id: number;
    const tick = () => {
      // Intl gives "Tuesday, 7:42 PM" — tightened to "Tuesday 7:42pm".
      const raw = new Intl.DateTimeFormat("en-US", FORMAT).format(new Date());
      setLabel(raw.replace(",", "").replace(" AM", "am").replace(" PM", "pm"));
      id = window.setTimeout(tick, 30_000);
    };
    // First update runs in a callback, not in the effect body — a synchronous
    // setState there is what the set-state-in-effect rule rejects.
    id = window.setTimeout(tick, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!label) {
    // Reserve the space so the overline doesn't reflow when the clock arrives.
    return <span aria-hidden="true" className="inline-block w-[11ch]" />;
  }

  return <span>{label}</span>;
}
