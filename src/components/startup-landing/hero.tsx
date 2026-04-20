"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { HeroTicker } from "./hero-ticker";
import { HeroDiscoveryLeadPanel } from "./home-discovery-lead";

const HEADLINE_WORDS = "Websites built to bring you customers.".split(" ");

export function Hero() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-50 px-4 py-28 dark:bg-neutral-900 md:px-8 md:py-44">
      <BackgroundGrids />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
          <div className="min-w-0 flex-1 lg:max-w-[min(100%,52rem)]">
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

            <div className="relative z-20 mx-auto mt-6 max-w-2xl space-y-4 px-4 text-center text-base/relaxed text-gray-600 dark:text-gray-200 lg:mx-0 lg:max-w-none lg:px-0 lg:text-left md:text-lg">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08 }}
              >
                We start with the website, because that&apos;s where your customer learns about your business, and they do it very quickly.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.14 }}
              >
                Then, we build a strategic plan around your SEO and GEO because this is how you&apos;re going to get in front of them,{" "}
                <strong className="font-semibold text-gray-900 dark:text-white">FOR FREE</strong>.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.2 }}
              >
                At this point, we add in a lead capture system with automation—so you don&apos;t miss a single sign-up from someone who wants to work with you, and you don&apos;t have to monitor every
                incoming chat to follow up with your leads.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.26 }}
              >
                If this isn&apos;t enough, we take control of your social media marketing and Google marketing strategies and maximize the cost per click by creating dedicated funnels through the three
                key marketing hooks: emotional pain to relief, trust funnel and evidence, and math and logic.
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.34 }}
              className="relative z-20 mx-auto mt-6 max-w-2xl px-4 text-center text-sm text-gray-600 dark:text-gray-300 lg:mx-0 lg:px-0 lg:text-left md:text-base"
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.42 }}
              className="mb-2 mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 px-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:mx-0 lg:justify-start lg:px-0 md:mb-4 md:mt-12"
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
