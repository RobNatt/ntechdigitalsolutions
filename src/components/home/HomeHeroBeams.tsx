"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { CONSTANTS } from "@/constants/links";
import { cn } from "@/lib/utils";

const VIEW_WORK_PATH = "/dental-patient-growth-case-study";

const HERO_TRUST_POINTS = [
  "Fast turnaround",
  "SEO-focused builds",
  "AI-powered automation",
  "Omaha-based / US-based",
  "Trusted by local businesses",
] as const;

export function HomeHeroBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const trustLoop = reduceMotion ? [...HERO_TRUST_POINTS] : [...HERO_TRUST_POINTS, ...HERO_TRUST_POINTS];

  return (
    <section
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 px-4 py-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 md:px-8 md:py-40"
    >
      <BackgroundGrids />
      <CollisionMechanism
        beamOptions={{
          initialX: -400,
          translateX: 600,
          duration: 7,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        beamOptions={{
          initialX: -200,
          translateX: 800,
          duration: 4,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        beamOptions={{
          initialX: 200,
          translateX: 1200,
          duration: 5,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        containerRef={containerRef}
        parentRef={parentRef}
        beamOptions={{
          initialX: 400,
          translateX: 1400,
          duration: 6,
          repeatDelay: 3,
        }}
      />

      <p className="relative z-50 mx-auto mb-2 max-w-4xl text-center text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
        N-Tech Digital Solutions
      </p>
      <h1 className="relative z-50 mx-auto mt-2 mb-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-balance text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
        <Balancer>Digital Systems Built to Grow Local Businesses</Balancer>
      </h1>
      <p className="relative z-50 mx-auto mt-4 max-w-2xl px-4 text-center text-base/relaxed text-gray-600 md:text-lg dark:text-neutral-300">
        a conversion optimized website, ads traffic and a dashboard to track it all.
      </p>
      <div
        id="offer-path"
        className="relative z-50 mt-8 mb-5 flex w-full max-w-xl flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:flex-wrap"
      >
        <Link
          href={CONSTANTS.STRATEGY_QUALIFICATION_PATH}
          className="group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white no-underline shadow-sm transition hover:bg-emerald-700 sm:w-56"
        >
          Book a Strategy Call
          <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        </Link>
        <Link
          href={VIEW_WORK_PATH}
          className="shadow-input group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-sky-800 bg-white px-4 py-2 text-sm font-semibold leading-6 text-sky-950 no-underline transition hover:-translate-y-0.5 dark:border-sky-500 dark:bg-neutral-900 dark:text-sky-100 sm:w-56"
        >
          View Our Work
        </Link>
      </div>

      <nav
        ref={containerRef}
        aria-label="Trust highlights"
        className="relative z-50 mx-auto mb-12 w-full max-w-4xl px-4 md:mb-20"
      >
        <ul className="sr-only">
          {HERO_TRUST_POINTS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <div
          aria-hidden
          className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/70 py-2.5 shadow-sm backdrop-blur-sm dark:border-neutral-700/90 dark:bg-neutral-900/60"
        >
          <div
            className={cn(
              "flex items-center gap-0",
              reduceMotion
                ? "w-full max-w-full flex-wrap justify-center gap-x-4 gap-y-2 py-1"
                : "animate-trust-marquee w-max pr-8 md:pr-12",
            )}
          >
            {trustLoop.map((label, i) => (
              <span
                key={reduceMotion ? label : `${label}-${i}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-neutral-700 sm:text-sm dark:text-neutral-200",
                  reduceMotion ? "px-1" : "pl-6 sm:pl-8 md:pl-10",
                )}
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className="whitespace-nowrap">{label}</span>
                {!reduceMotion ? (
                  <span
                    className="pl-4 text-neutral-300 select-none sm:pl-6 dark:text-neutral-600"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : i < trustLoop.length - 1 ? (
                  <span
                    className="pl-2 text-neutral-300 select-none dark:text-neutral-600"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </section>
  );
}

const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-neutral-100 to-transparent dark:via-neutral-800">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
    </div>
  );
};

type CollisionMechanismProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  beamOptions?: {
    initialX?: number;
    translateX?: number;
    initialY?: number;
    translateY?: number;
    rotate?: number;
    className?: string;
    duration?: number;
    delay?: number;
    repeatDelay?: number;
  };
};

function CollisionMechanism({ parentRef, containerRef, beamOptions = {} }: CollisionMechanismProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
          beamRef.current.style.opacity = "0";
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);
    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      const t1 = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        if (beamRef.current) {
          beamRef.current.style.opacity = "1";
        }
      }, 2000);

      const t2 = setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    return undefined;
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          x: beamOptions.initialX ?? 0,
          y: typeof beamOptions.initialY === "number" ? beamOptions.initialY : -200,
          rotate: beamOptions.rotate ?? -45,
        }}
        variants={{
          animate: {
            x: beamOptions.translateX ?? 700,
            y: typeof beamOptions.translateY === "number" ? beamOptions.translateY : 800,
            rotate: beamOptions.rotate ?? -45,
          },
        }}
        transition={{
          duration: beamOptions.duration ?? 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay ?? 0,
          repeatDelay: beamOptions.repeatDelay ?? 0,
        }}
        className={cn(
          "absolute top-20 left-96 m-auto h-14 w-px rounded-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates ? (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x + 20}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

const Explosion = ({ className, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const spans = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        initialX: 0,
        initialY: 0,
        directionX: ((index * 17 + 13) % 80) - 40,
        directionY: -10 - (index % 35),
        duration: 0.5 + ((index * 7) % 10) / 10,
      })),
    []
  );

  return (
    <div {...rest} style={style} className={cn("absolute z-50 h-2 w-2", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-[4px] w-10 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: span.duration, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-orange-500 to-yellow-500"
        />
      ))}
    </div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
};
