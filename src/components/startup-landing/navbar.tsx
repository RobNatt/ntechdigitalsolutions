"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
  }[];
  visible: boolean;
}

function trackNavCta(href: string) {
  if (href === "/contact" || href === "/growth-system") {
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
      placement: "nav",
      href,
    });
  }
}

/** Past this offset the bar becomes a floating glass pill. */
const SCROLL_PILL_THRESHOLD = 72;

export const Navbar = () => {
  const navItems = [
    { name: "Services", link: "/services" },
    { name: "Growth System", link: "/growth-system" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  /** Page scroll — do not pass `target: navbarRef`: a fixed header’s target scroll offset barely moves, so shrink never triggered. */
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(window.scrollY > SCROLL_PILL_THRESHOLD);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > SCROLL_PILL_THRESHOLD);
  });

  return (
    <motion.div className="w-full fixed top-0 inset-x-0 z-50">
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      animate={{ y: visible ? 14 : 0 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 30,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden flex-row items-center justify-between gap-4 transition-[width,background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out lg:flex",
        visible
          ? "w-[min(94vw,72rem)] max-w-[min(94vw,72rem)] rounded-full border border-neutral-200/75 bg-white/90 py-3 pl-5 pr-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-950/90"
          : "w-full max-w-7xl border-transparent bg-transparent py-2.5 shadow-none backdrop-blur-none dark:bg-transparent",
        "px-4",
      )}
    >
      <div className="relative z-20 min-w-0 shrink-0">
        <Logo />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex flex-row items-center justify-center gap-1 text-sm font-medium lg:gap-2"
        >
          {navItems.map((navItem, idx: number) => (
            <Link
              onMouseEnter={() => setHovered(idx)}
              onClick={() => trackNavCta(navItem.link)}
              className={cn(
                "relative px-3 py-2 text-xs text-neutral-700 lg:px-4 lg:text-sm dark:text-neutral-200",
                (navItem.link === "/contact" || navItem.link === "/growth-system") && "btn-primary",
              )}
              key={`link=${idx}`}
              href={navItem.link}
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-neutral-100/90 dark:bg-neutral-800/90"
                />
              )}
              <span className="relative z-20">{navItem.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative z-20 flex shrink-0 items-center gap-2 md:gap-3">
        <ModeToggle />
        <Link
          href="/signup"
          className="hidden text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white md:inline lg:text-sm"
        >
          Sign up
        </Link>
        <Button as={Link} href={CONSTANTS.LOGIN_LINK} variant="secondary" className="hidden md:block">
          Login
        </Button>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        animate={{
          y: visible ? 14 : 0,
          borderRadius: open ? 12 : 9999,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 30,
        }}
        className={cn(
          "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-center bg-transparent px-0 py-2 transition-[width,background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out lg:hidden",
          visible
            ? "w-[min(94vw,40rem)] max-w-[min(94vw,40rem)] border border-neutral-200/75 bg-white/90 px-3 py-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-950/90"
            : "border-transparent shadow-none backdrop-blur-none",
        )}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <Logo />
          {open ? (
            <IconX
              className="text-black dark:text-white"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className="text-black dark:text-white"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex rounded-lg absolute top-16 bg-white dark:bg-neutral-950 inset-x-0 z-50 flex-col items-start justify-start gap-4 w-full px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            >
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  onClick={() => {
                    trackNavCta(navItem.link);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative text-neutral-600 dark:text-neutral-300",
                    (navItem.link === "/contact" || navItem.link === "/growth-system") &&
                      "btn-primary"
                  )}
                >
                  <motion.span className="block">{navItem.name} </motion.span>
                </Link>
              ))}
              <Button
                as={Link}
                onClick={() => setOpen(false)}
                href="/signup"
                variant="secondary"
                className="block w-full md:hidden"
              >
                Sign up
              </Button>
              <Button
                as={Link}
                onClick={() => setOpen(false)}
                href={CONSTANTS.LOGIN_LINK}
                variant="primary"
                className="block w-full md:hidden"
              >
                Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
