"use client";

import dynamic from "next/dynamic";

export const CursorReactiveLazy = dynamic(
  () =>
    import("./CursorReactiveEnvironment").then((m) => ({
      default: m.CursorReactiveEnvironment,
    })),
  { ssr: false, loading: () => null }
);
