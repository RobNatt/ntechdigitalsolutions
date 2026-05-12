"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Balancer from "react-wrap-balancer";
import {
  GROWTH_SYSTEM_FUNNEL_PATH,
} from "@/constants/growth-system-offer";
import { cn } from "@/lib/utils";

const funnel = GROWTH_SYSTEM_FUNNEL_PATH;
const qualifyHref = `${funnel}#qualify`;

export function HomeHeroBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

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
      <h1 className="relative z-50 mx-auto mt-2 mb-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-balance text-gray-700 md:text-6xl lg:text-7xl dark:text-neutral-200">
        <Balancer>
          Built for service businesses that want{" "}
          <span className="relative mx-auto inline-block w-max filter-[drop-shadow(0px_1px_3px_rgba(27,37,80,0.14))]">
            <span className="text-neutral-900 [text-shadow:0_0_rgba(0,0,0,0.06)] dark:text-white">
              <span>the phone to ring.</span>
            </span>
          </span>
        </Balancer>
      </h1>
      <p className="relative z-50 mx-auto mt-4 max-w-2xl px-4 text-center text-base/relaxed text-gray-600 md:text-lg dark:text-neutral-300">
        We&apos;re a website-first growth partner for roofers, HVAC, plumbers, dental practices, and
        similar operators — not e-commerce or restaurants. When you&apos;re ready to treat growth
        like a system instead of a one-off project, we&apos;ll walk you through our flagship offer.
      </p>
      <div
        id="offer-path"
        className="relative z-50 mt-8 mb-10 flex w-full max-w-xl flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:flex-wrap md:mb-20"
      >
        <Link
          href={funnel}
          className="group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white no-underline shadow-sm transition hover:bg-emerald-700 sm:w-52"
        >
          Get Started NOW!
          <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        </Link>
        <Link
          href={qualifyHref}
          className="shadow-input group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-sky-800 bg-white px-4 py-2 text-sm font-semibold leading-6 text-sky-950 no-underline transition hover:-translate-y-0.5 dark:border-sky-500 dark:bg-neutral-900 dark:text-sky-100 sm:w-52"
        >
          Get quote
        </Link>
        <Link
          href={funnel}
          className="group relative z-20 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white/90 px-4 py-2 text-sm font-semibold leading-6 text-neutral-800 no-underline transition hover:bg-white dark:border-neutral-600 dark:bg-neutral-900/90 dark:text-neutral-100 sm:w-52"
        >
          Learn more
        </Link>
      </div>

      <div
        ref={containerRef}
        className="relative z-40 mx-auto max-w-7xl rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg md:p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
      >
        <div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
          {/* Placeholder card — swap asset/content in follow-up */}
          <img
            src="https://assets.aceternity.com/pro/aceternity-landing.webp"
            alt="Preview"
            width={1920}
            height={1080}
            className="rounded-[20px]"
          />
        </div>
      </div>
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
