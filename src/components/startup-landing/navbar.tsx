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

/** Primary CTA link — highlighted in the nav. */
const PRIMARY_NAV_HREF = CONSTANTS.BOOK_CALL_PATH;

function trackNavCta(href: string) {
  if (href === "/contact" || href === PRIMARY_NAV_HREF) {
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
      placement: "nav",
      href,
    });
  }
}

/** Past this scroll offset the header gains a solid background + shadow. */
const SCROLL_PILL_THRESHOLD = 72;

export const Navbar = () => {
  const navItems = [
    { name: "Infrastructure", link: "/infrastructure" },
    { name: "Pricing", link: "/pricing" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
    { name: "Book a Call", link: PRIMARY_NAV_HREF },
  ];

  /** Page scroll — do not pass `target: navbarRef`: a fixed header’s target scroll offset barely moves, so shrink never triggered. */
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount scroll sync for header pill; scroll listener updates after
    setVisible(window.scrollY > SCROLL_PILL_THRESHOLD);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > SCROLL_PILL_THRESHOLD);
  });

  return (
    // will-change promotes the header to its own compositor layer so it stays visually
    // pinned during fast/momentum scroll instead of lagging a frame behind (the "duplicate
    // header" artifact reported on the live site).
    <div className="w-full fixed top-0 inset-x-0 z-50 [will-change:transform] [transform:translateZ(0)]">
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between gap-6 border-b px-4 py-3 transition-[background-color,box-shadow,border-color] duration-200 ease-out lg:flex lg:gap-10",
        visible
          ? "border-neutral-200/75 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-950"
          : "border-transparent bg-transparent shadow-none",
      )}
    >
      <div className="relative z-20 min-w-0 shrink-0">
        <Logo compact={visible} />
      </div>

      <nav
        aria-label="Main"
        className="flex min-w-0 flex-1 flex-row items-center justify-center gap-1 text-sm font-medium xl:gap-2"
      >
        {navItems.map((navItem, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            onClick={() => trackNavCta(navItem.link)}
            className={cn(
              "relative whitespace-nowrap px-3 py-2 text-xs text-neutral-700 xl:px-4 xl:text-sm dark:text-neutral-200",
              (navItem.link === "/contact" || navItem.link === PRIMARY_NAV_HREF) &&
                "!ml-1 rounded-full bg-neutral-900 !text-white hover:!text-white dark:bg-white dark:!text-neutral-900",
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

      <div className="relative z-20 flex shrink-0 items-center gap-3 md:gap-4">
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
    </div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative z-50 flex w-full flex-col items-center border-b px-4 py-2.5 transition-[background-color,box-shadow,border-color] duration-200 ease-out lg:hidden",
          visible
            ? "border-neutral-200/75 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-950"
            : "border-transparent bg-transparent shadow-none",
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
              className="flex rounded-lg absolute top-16 bg-white dark:bg-neutral-950 inset-x-0 z-50 flex-col items-start justify-start gap-6 w-full px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            >
              {navItems.map((navItem, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  onClick={() => {
                    trackNavCta(navItem.link);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative text-neutral-600 dark:text-neutral-300",
                    (navItem.link === "/contact" || navItem.link === PRIMARY_NAV_HREF) &&
                      "rounded-full bg-neutral-900 px-4 py-2 !text-white dark:bg-white dark:!text-neutral-900"
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
      </div>
    </>
  );
};
