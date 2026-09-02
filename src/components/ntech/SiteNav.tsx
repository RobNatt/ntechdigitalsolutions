"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ctaSecondary } from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Infrastructure", href: "/infrastructure" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  /* The nav carries the current's position: how far down the log you are. */
  useEffect(() => {
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    }
    frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-field/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
        >
          <Image
            src="/ntech-mark.png"
            alt=""
            width={445}
            height={353}
            className="h-7 w-auto object-contain"
            priority
          />
          <span className="type-heading text-[0.9375rem] tracking-tight text-ink">
            N-Tech <span className="text-muted-ink">Digital Solutions</span>
          </span>
          <span className="sr-only">N-Tech Digital Solutions — home</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={item.href === "/blog" ? false : undefined}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center rounded px-3 text-[0.875rem] text-muted-ink transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
                pathname === item.href && "text-ink"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/book-call" className={cn(ctaSecondary, "ml-2 px-4 py-2.5 text-[0.875rem]")}>
            Book With Us
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rule-strong text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {/* The current's position in the log. */}
      <div aria-hidden className="h-px w-full bg-transparent">
        <div
          className="h-px bg-live transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-rule bg-field px-4 pb-5 pt-2 md:hidden">
          <nav aria-label="Main" className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.href === "/blog" ? false : undefined}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-3.5 text-[1rem] text-ink"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/book-call"
              onClick={() => setOpen(false)}
              className={cn(ctaSecondary, "mt-4")}
            >
              Book With Us
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
