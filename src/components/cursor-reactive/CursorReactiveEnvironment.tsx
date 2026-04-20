"use client";

import { useEffect, useRef, useState } from "react";

const GLOW_SIZE = 250;
const HALF = GLOW_SIZE / 2;

/**
 * Cursor-follow gradient orb + click ripples (from cinematic-site-components cursor-reactive).
 * Home page only; disabled for reduced motion and coarse pointers.
 */
export function CursorReactiveEnvironment() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mx = useRef(0);
  const my = useRef(0);
  const gx = useRef(0);
  const gy = useRef(0);
  const ripples = useRef<
    { x: number; y: number; r: number; alpha: number }[]
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const glow = glowRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
    };

    const onClick = (e: MouseEvent) => {
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        alpha: 0.48,
      });
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const tick = () => {
      gx.current += (mx.current - gx.current) * 0.12;
      gy.current += (my.current - gy.current) * 0.12;

      if (glow) {
        glow.style.transform = `translate(${gx.current - HALF}px, ${gy.current - HALF}px)`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const rip = ripples.current[i]!;
        rip.r += 4;
        rip.alpha -= 0.006;
        if (rip.alpha <= 0) {
          ripples.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${rip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123, 97, 255, ${rip.alpha * 0.55})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
        aria-hidden
      >
        <div
          ref={glowRef}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 229, 255, 0.16) 0%, rgba(123, 97, 255, 0.09) 38%, transparent 68%)",
            transform: `translate(-${HALF}px, -${HALF}px)`,
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[30]"
        aria-hidden
      />
    </>
  );
}
