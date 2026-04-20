"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { HeroTicker } from "./hero-ticker";
import { HeroDiscoveryLeadPanel } from "./home-discovery-lead";

const HolographicDashboardTabs = dynamic(
  () =>
    import("@/components/dashboard/HolographicDashboardTabs").then((m) => ({
      default: m.HolographicDashboardTabs,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[min(68vh,640px)] w-full items-center justify-center rounded-3xl border border-neutral-200/70 bg-neutral-100/40 dark:border-neutral-700/80 dark:bg-neutral-800/25 md:h-[min(72vh,720px)]"
        aria-hidden
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-300/80 dark:bg-neutral-600/50" />
      </div>
    ),
  }
);

const HEADLINE_WORDS =
  "Turn Clicks Into Paying Customers. On Autopilot.".split(" ");

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-50 px-4 py-28 dark:bg-neutral-900 md:px-8 md:py-44"
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

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
          <div className="min-w-0 flex-1 lg:max-w-[min(100%,52rem)]">
            <div className="flex justify-center lg:justify-start">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-800 dark:text-sky-100">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                AI-Driven Growth Systems for Small Business
              </div>
            </div>

            <div className="text-balance relative z-20 mx-auto mb-6 mt-3 max-w-4xl text-center text-3xl font-semibold tracking-tight text-gray-700 dark:text-neutral-300 lg:mx-0 lg:text-left md:text-7xl">
              <Balancer>
                <motion.h1 className="text-[inherit]">
                  {HEADLINE_WORDS.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.h1>
              </Balancer>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.42 }}
              className="relative z-20 mx-auto mt-8 max-w-3xl px-4 text-center text-lg font-semibold tracking-tight text-sky-950 dark:text-sky-100 lg:mx-0 lg:max-w-none lg:px-0 lg:text-left md:text-2xl"
            >
              <Balancer>
                Web design, SEO &amp; lead systems for Omaha, Lincoln &amp; the Nebraska metro — we
                deliver nationwide too.
              </Balancer>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.5 }}
              className="relative z-20 mx-auto mt-4 max-w-2xl px-4 text-center text-sm text-gray-600 dark:text-gray-300 lg:mx-0 lg:px-0 lg:text-left md:text-base"
            >
              <Link
                href="/omaha-web-design"
                className="font-medium text-sky-800 underline decoration-sky-400/50 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-500/40"
              >
                Omaha web design
              </Link>
              <span className="text-gray-400 dark:text-gray-500"> · </span>
              <Link
                href="/omaha-seo"
                className="font-medium text-sky-800 underline decoration-sky-400/50 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-500/40"
              >
                SEO Omaha
              </Link>
              <span className="text-gray-400 dark:text-gray-500"> · </span>
              <Link
                href="/digital-marketing-omaha-ne"
                className="font-medium text-sky-800 underline decoration-sky-400/50 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-500/40"
              >
                Digital marketing Omaha
              </Link>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.58 }}
              className="relative z-20 mx-auto mt-6 max-w-2xl px-4 text-center text-base/6 text-gray-600 dark:text-gray-200 lg:mx-0 lg:px-0 lg:text-left md:text-lg"
            >
              N-Tech builds the same stack as our packages — from Foundation
              (SEO-ready sites and WordPress training) through Growth (funnels, CRM,
              local SEO) to Pro (automation, content, and ongoing optimization) — so
              you can focus on running your business.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.78 }}
              className="mb-2 mt-12 flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 px-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:mx-0 lg:justify-start lg:px-0 md:mb-4 md:mt-14"
            >
              <Button
                as={Link}
                href={CONSTANTS.CONTACT_PATH}
                variant="dark"
                className="w-full text-center sm:w-auto sm:min-w-[11rem]"
                onClick={() =>
                  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                    placement: "hero",
                    cta: "get_in_touch",
                  })
                }
              >
                Get in touch
              </Button>
              <Button
                as={Link}
                href="/growth-system"
                variant="secondary"
                className="w-full border border-neutral-300 bg-white/90 text-center font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800 sm:w-auto sm:min-w-[11rem]"
                onClick={() =>
                  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                    placement: "hero",
                    cta: "growth_system",
                  })
                }
              >
                Growth System
              </Button>
              <Button
                as={Link}
                href="/#features"
                variant="secondary"
                className="w-full text-center sm:w-auto sm:min-w-[11rem]"
                onClick={() =>
                  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                    placement: "hero",
                    cta: "see_features",
                  })
                }
              >
                See what we build
              </Button>
            </motion.div>
          </div>

          <HeroDiscoveryLeadPanel className="mx-auto shrink-0 lg:mx-0 lg:max-w-[min(100%,26rem)] lg:pt-1 xl:max-w-[28rem]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.88, ease: "easeOut" }}
        className="relative z-20 mt-10 w-full px-4 pt-2 md:mt-14 md:pt-4"
      >
        <HeroTicker />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.96, ease: "easeOut" }}
        ref={containerRef}
        className="relative z-20 mx-auto mt-2 w-full max-w-7xl px-1 sm:px-2 md:mt-4"
      >
        <HolographicDashboardTabs className="h-[min(68vh,640px)] md:h-[min(72vh,720px)]" />
      </motion.div>
    </div>
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

const CollisionMechanism = ({
  parentRef,
  containerRef,
  beamOptions = {},
}: {
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
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
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

        const verticalHit = beamRect.bottom >= containerRect.top - 8;
        const horizontalOverlap =
          beamRect.right >= containerRect.left && beamRect.left <= containerRect.right;

        if (verticalHit && horizontalOverlap) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
          if (beamRef.current) {
            beamRef.current.style.opacity = "0";
          }
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        if (beamRef.current) {
          beamRef.current.style.opacity = "1";
        }
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || -45,
        }}
        variants={{
          animate: {
            /* Long enough path to reach the dashboard on tall viewports (path was too short). */
            translateY: beamOptions.translateY ?? "calc(88vh + 520px)",
            translateX: beamOptions.translateX || "700px",
            rotate: beamOptions.rotate || -45,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-96 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x + 20}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("pointer-events-none absolute z-[100] h-2 w-2", props.className)}>
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
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
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
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
};
