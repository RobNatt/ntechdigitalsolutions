"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "framer-motion";

interface IPhoneIllustrationProps {
  children?: React.ReactNode;
}

const screenContentVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
  },
};

const CONTENT_TRANSITION = {
  duration: 0.3,
  ease: "easeOut" as const,
  delay: 0.2,
};

export function IPhoneIllustration({ children }: IPhoneIllustrationProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover="animate"
      initial="initial"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mx-auto w-full max-w-[19rem] shrink-0 sm:max-w-[22rem] md:max-w-[25rem]"
    >
      <div className="relative mx-auto w-56 sm:w-64 md:w-72">
        {/* Left side buttons */}
        <div className="absolute top-[18%] -left-[2px] flex flex-col gap-2.5">
          <div className="h-3.5 w-[2px] rounded-l-sm bg-neutral-300 shadow-[0px_0px_1px_0px_var(--color-neutral-400)] dark:bg-neutral-600 dark:shadow-[0px_0px_1px_0px_var(--color-neutral-500)]" />
          <div className="h-6 w-[2px] rounded-l-sm bg-neutral-300 shadow-[0px_0px_1px_0px_var(--color-neutral-400)] dark:bg-neutral-600 dark:shadow-[0px_0px_1px_0px_var(--color-neutral-500)]" />
          <div className="h-6 w-[2px] rounded-l-sm bg-neutral-300 shadow-[0px_0px_1px_0px_var(--color-neutral-400)] dark:bg-neutral-600 dark:shadow-[0px_0px_1px_0px_var(--color-neutral-500)]" />
        </div>

        {/* Right side — power */}
        <div className="absolute top-[22%] -right-[2px]">
          <div className="h-9 w-[2px] rounded-r-sm bg-neutral-300 shadow-[0px_0px_1px_0px_var(--color-neutral-400)] dark:bg-neutral-600 dark:shadow-[0px_0px_1px_0px_var(--color-neutral-500)]" />
        </div>

        {/* Body */}
        <div className="rounded-[1.75rem] bg-neutral-100 p-[5px] shadow-sm ring-1 ring-black/10 shadow-black/10 dark:bg-neutral-800 dark:shadow-white/5 dark:ring-white/10 md:rounded-[2rem] md:p-1.5">
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.35rem] bg-neutral-950 md:rounded-[1.5rem]">
            <motion.div
              variants={screenContentVariants}
              transition={CONTENT_TRANSITION}
              className="absolute inset-0"
            >
              {children}
            </motion.div>

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
              <DynamicIslandIllustration isActive={isHovered} />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-2.5 mx-auto h-1 w-12 rounded-full bg-neutral-300 md:bottom-3 md:w-14 dark:bg-neutral-600" />
      </div>
    </motion.div>
  );
}

const SPRING_OPTIONS = {
  type: "spring" as const,
  stiffness: 591.79,
  damping: 48.82,
  mass: 2.89,
};

function DynamicIslandIllustration({ isActive = false }: { isActive?: boolean }) {
  const [scope, animate] = useAnimate();
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      hasAnimatedRef.current = false;
      void animate(scope.current, { width: 36, height: 12, borderRadius: 6 }, SPRING_OPTIONS);
      void animate("#iphone-idle-content", { opacity: 1 }, { duration: 0.15 });
      void animate("#iphone-loading-content", { opacity: 0 }, { duration: 0.1 });
      void animate("#iphone-connected-content", { opacity: 0 }, { duration: 0.1 });
      return;
    }

    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const runSequence = async () => {
      await animate("#iphone-idle-content", { opacity: 0 }, { duration: 0.1 });

      void animate(scope.current, { width: 20, height: 12, borderRadius: 6 }, SPRING_OPTIONS);
      await animate("#iphone-loading-content", { opacity: 1 }, { duration: 0.15 });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      await animate("#iphone-loading-content", { opacity: 0 }, { duration: 0.1 });

      void animate(scope.current, { width: 50, height: 12, borderRadius: 8 }, SPRING_OPTIONS);
      await animate("#iphone-connected-content", { opacity: 1 }, { duration: 0.15, delay: 0.1 });
    };

    void runSequence();
  }, [isActive, animate, scope]);

  return (
    <div className="flex h-full w-full items-start justify-center pt-2">
      <div
        ref={scope}
        className="relative overflow-hidden bg-black"
        style={{ width: 36, height: 12, borderRadius: 6 }}
      >
        <div
          id="iphone-idle-content"
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1 }}
        >
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-neutral-800" />
            <div className="h-0.5 w-0.5 rounded-full bg-neutral-700" />
          </div>
        </div>

        <div
          id="iphone-loading-content"
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-px">
            <LoadingDot delay={0} />
            <LoadingDot delay={0.15} />
            <LoadingDot delay={0.3} />
          </div>
        </div>

        <div
          id="iphone-connected-content"
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap text-[4px] font-medium leading-none text-white">
              Growth stack
            </span>
            <div className="flex items-center gap-px">
              <div className="flex h-1 w-2 items-center rounded-sm border border-green-500">
                <div className="h-full w-[85%] bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const [scope, animate] = useAnimate();
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const start = async () => {
      await new Promise((r) => setTimeout(r, delay * 1000));
      while (!cancelledRef.current && scope.current) {
        await animate(scope.current, { opacity: 1 }, { duration: 0.4 });
        if (cancelledRef.current) break;
        await animate(scope.current, { opacity: 0.3 }, { duration: 0.4 });
      }
    };
    void start();
    return () => {
      cancelledRef.current = true;
    };
  }, [animate, scope, delay]);

  return (
    <div
      ref={scope}
      className="h-0.5 w-0.5 rounded-full bg-white"
      style={{ opacity: 0.3 }}
    />
  );
}
