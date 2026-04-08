"use client";

import dynamic from "next/dynamic";

/** Loads chat UI after hydration so it is not on the critical path for LCP/TBT. */
export const ChatWidgetLazy = dynamic(
  () => import("./chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);
