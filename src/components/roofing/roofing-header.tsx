"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

const CTA_CLASS =
  "rounded-md bg-[#b45309] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a4508] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#b45309] focus-visible:ring-offset-2";

export function RoofingHeader() {
  const [solid, setSolid] = useState(false);

  const update = useCallback(() => {
    const hero = document.getElementById("roofing-hero");
    if (!hero) {
      setSolid(false);
      return;
    }
    const half = hero.offsetHeight / 2;
    setSolid(window.scrollY >= half);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300",
        solid ? "bg-white shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-2 sm:h-[4.25rem] sm:min-h-0 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link
          href="#top"
          className={cn(
            "shrink-0 text-sm font-semibold tracking-tight transition-colors sm:text-base",
            solid ? "text-neutral-900" : "text-white"
          )}
        >
          Roofing
        </Link>

        <nav
          className="order-3 flex w-full basis-full items-center justify-center gap-4 overflow-x-auto pt-1 sm:order-none sm:w-auto sm:basis-auto sm:flex-1 sm:justify-center sm:gap-6 sm:pt-0 md:gap-8"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 text-xs font-medium transition-colors sm:text-sm",
                solid
                  ? "text-neutral-800 hover:text-neutral-950"
                  : "text-white/95 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center sm:ml-0">
          <Link href="#contact" className={cn(CTA_CLASS, "whitespace-nowrap text-xs sm:text-sm")}>
            Free Estimate
          </Link>
        </div>
      </div>
    </header>
  );
}
