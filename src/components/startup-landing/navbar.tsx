"use client";
import { cn } from "@/lib/utils";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
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
    setVisible(window.scrollY > 100);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div className="w-full fixed top-0 inset-x-0 z-50">
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.div>
  );
};

function DesktopNavDropdown({
  navItems,
  open,
  onOpenChange,
}: {
  navItems: NavbarProps["navItems"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (containerRef.current?.contains(e.target as Node)) return;
      onOpenChange(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="relative z-30 flex justify-center">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-800"
        )}
      >
        Menu
        <IconChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-[calc(100%+10px)] z-[70] min-w-[220px] -translate-x-1/2 rounded-xl border border-neutral-200/90 bg-white py-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-950"
          >
            {navItems.map((navItem, idx) => (
              <Link
                role="menuitem"
                key={`dd-${idx}`}
                href={navItem.link}
                onClick={() => {
                  trackNavCta(navItem.link);
                  onOpenChange(false);
                }}
                className={cn(
                  "block px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
                  (navItem.link === "/contact" || navItem.link === "/growth-system") &&
                    "text-sky-700 dark:text-sky-400"
                )}
              >
                {navItem.name}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{ minWidth: visible ? 0 : 800 }}
      className={cn(
        "relative z-[60] mx-auto hidden max-w-7xl flex-row items-center justify-between gap-3 self-start rounded-full bg-transparent px-4 py-2 dark:bg-transparent lg:flex",
        visible && "bg-white/80 dark:bg-neutral-950/80"
      )}
    >
      <div className="relative z-20 min-w-0 shrink-0">
        <Logo />
      </div>

      {!visible ? (
        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
        >
          <div className="pointer-events-auto flex flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 lg:space-x-2">
            {navItems.map((navItem, idx: number) => (
              <Link
                onMouseEnter={() => setHovered(idx)}
                onClick={() => trackNavCta(navItem.link)}
                className={cn(
                  "relative px-3 py-2 text-xs text-neutral-600 dark:text-neutral-300 lg:px-4 lg:text-sm",
                  (navItem.link === "/contact" || navItem.link === "/growth-system") &&
                    "btn-primary"
                )}
                key={`link=${idx}`}
                href={navItem.link}
              >
                {hovered === idx && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
                  />
                )}
                <span className="relative z-20">{navItem.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <DesktopNavDropdown navItems={navItems} open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      )}

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
          backdropFilter: visible ? "blur(10px)" : "none",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: visible ? "90%" : "100%",
          y: visible ? 20 : 0,
          borderRadius: open ? "4px" : "2rem",
          paddingRight: visible ? "12px" : "0px",
          paddingLeft: visible ? "12px" : "0px",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center bg-transparent   max-w-[calc(100vw-2rem)] mx-auto px-0 py-2 z-50",
          visible && "bg-white/80 dark:bg-neutral-950/80"
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
