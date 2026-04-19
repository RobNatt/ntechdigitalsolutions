"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_MIN = 30;
const AUTO_MAX = 70;

export function OldNewSiteSlider() {
  const [position, setPosition] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);
  const userAdjusted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || userAdjusted.current) return;
    let frame = 0;
    const start = performance.now();
    const periodMs = 7000;

    const tick = (now: number) => {
      const t = ((now - start) % periodMs) / periodMs;
      const wave = (Math.sin(t * Math.PI * 2) + 1) / 2;
      setPosition(AUTO_MIN + wave * (AUTO_MAX - AUTO_MIN));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const markUserAdjusted = useCallback(() => {
    userAdjusted.current = true;
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        ref={containerRef}
        className="relative aspect-video w-full select-none overflow-hidden rounded-2xl border shadow-sm"
        style={{ borderColor: "#C1C4C8", backgroundColor: "#2B2E33" }}
      >
        <Image
          src="/old-site.png"
          alt="Previous website design"
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />

        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
          }}
        >
          <Image
            src="/new-site.png"
            alt="Updated website design"
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(43,46,51,0.35)]"
          style={{ left: `${position}%` }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#2B2E33] shadow-md"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M6 4L2 9L6 14M12 4L16 9L12 14"
              stroke="#F5F6F7"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Before
        </div>
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          After
        </div>
      </div>

      <div className="mt-4 px-1">
        <label className="sr-only" htmlFor="before-after-range">
          Compare before and after website designs
        </label>
        <input
          id="before-after-range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={position}
          onChange={(e) => {
            markUserAdjusted();
            setPosition(Number(e.target.value));
          }}
          onPointerDown={markUserAdjusted}
          onKeyDown={markUserAdjusted}
          className="h-2 w-full cursor-ew-resize appearance-none rounded-full bg-[#C1C4C8] accent-[#2B2E33]"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
        />
        <p className="mt-2 text-center text-xs" style={{ color: "#7B7F85" }}>
          Drag the slider to compare the old site with the new design.
        </p>
      </div>
    </div>
  );
}
