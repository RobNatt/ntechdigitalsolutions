"use client";

import { useEffect } from "react";

/*
 * Keeps the GoHighLevel chat widget out of React's hidden container.
 *
 * THE PROBLEM: GHL's loader injects a <chat-widget> element into the DOM
 * wherever it happens to land, and on this site it lands inside the
 * `<div hidden>` React uses for streamed content — the one holding the
 * `<!--$--><!--/$-->` Suspense markers. React never reveals that div, because
 * nothing it rendered lives there, so the widget inherits `display: none` and
 * is never painted.
 *
 * It fails silently and convincingly: the script tag is in the served HTML, the
 * loader runs, the config fetches, the custom element upgrades and reports
 * `class="hydrated"`, and every style computes correctly — 58px bubble, fixed
 * position, z-index 99999999. Only the bounding rects give it away, all zero,
 * because a display:none ancestor means the subtree is never rendered. Passing
 * GHL's compliance check and actually showing a launcher are separate things.
 *
 * THE FIX: re-parent the element to <body>, where nothing can hide it. The
 * observer stays connected rather than firing once — the widget arrives late
 * (its load strategy is "interaction", so nothing loads until the visitor
 * scrolls or clicks) and React re-runs reconciliation on navigation, so a
 * one-shot check would race both. The parent comparison makes the callback a
 * no-op in every case except the one that matters, including the append we
 * trigger ourselves.
 */

export function ChatWidgetAnchor() {
  useEffect(() => {
    const reparent = () => {
      const widget = document.querySelector("chat-widget");
      if (widget && widget.parentElement !== document.body) {
        document.body.appendChild(widget);
      }
    };

    reparent();

    const observer = new MutationObserver(reparent);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
