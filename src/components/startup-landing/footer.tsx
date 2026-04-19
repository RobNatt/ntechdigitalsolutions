import Link from "next/link";
import React from "react";
import { CONSTANTS } from "@/constants/links";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_SERVICE_AREAS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Footer() {
  const pages = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "SEO services", href: "/seo-services" },
    { title: "Growth System", href: "/growth-system" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  const omahaMetro = [
    { title: "Web design — Omaha", href: "/web-design-omaha-ne" },
    { title: "SEO — Omaha", href: "/seo-services-omaha-ne" },
    { title: "Digital marketing — Omaha", href: "/digital-marketing-omaha-ne" },
  ];

  const legals = [
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms of Service", href: "/terms-and-conditions" },
  ];

  const signups = [
    { title: "Growth System", href: "/growth-system" },
    { title: "Sign up", href: "/signup" },
    { title: "Login", href: "/login" },
    { title: "Book a demo", href: CONSTANTS.CONTACT_PATH },
  ];

  return (
    <div className="relative w-full overflow-hidden border-t border-neutral-100 bg-white px-8 py-20 dark:border-white/[0.1] dark:bg-neutral-950">
      <div className="relative mx-auto max-w-7xl md:px-8">
        <p
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text px-2 text-center text-3xl font-bold uppercase leading-tight text-transparent sm:text-5xl md:text-7xl lg:text-9xl dark:from-neutral-950 dark:to-neutral-800"
        >
          N-Tech Digital Solutions
        </p>

        <div className="relative z-10 flex flex-col items-start justify-between text-sm text-neutral-500 sm:flex-row">
          <div>
            <div className="mb-4 mr-0 md:mr-4 md:flex">
              <Logo />
            </div>
            <p className="ml-2 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {SITE_SERVICE_AREAS}
            </p>
            <p className="ml-2 mt-3 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {SITE_BUSINESS_PHONE ? (
                <>
                  <a
                    href={`tel:${SITE_BUSINESS_PHONE.replace(/\s/g, "")}`}
                    className="hover:text-neutral-900 dark:hover:text-white"
                  >
                    {SITE_BUSINESS_PHONE}
                  </a>
                  <span className="mx-2 text-neutral-300 dark:text-neutral-600">·</span>
                </>
              ) : null}
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="hover:text-neutral-900 dark:hover:text-white"
              >
                {SITE_CONTACT_EMAIL}
              </a>
            </p>
            <p className="ml-2 mt-2 text-[11px] text-neutral-500 dark:text-neutral-500">
              Replies within one business day · HTTPS-secured site
            </p>
            <div className="ml-2 mt-4 text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} N-Tech Digital Solutions. All rights reserved.
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-4">
            <div className="flex w-full flex-col justify-center space-y-4">
              <p className="font-bold text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                Pages
              </p>
              <ul className="list-none space-y-4 text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                {pages.map((page, idx) => (
                  <li key={"pages" + idx} className="list-none">
                    <Link
                      className={cn(
                        "transition-colors hover:text-text-neutral-800",
                        page.href === "/contact" && "btn-primary"
                      )}
                      href={page.href}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col justify-center space-y-4">
              <p className="font-bold text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                Omaha metro
              </p>
              <ul className="list-none space-y-4 text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                {omahaMetro.map((page, idx) => (
                  <li key={`omaha-${idx}`} className="list-none">
                    <Link
                      className="transition-colors hover:text-text-neutral-800"
                      href={page.href}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <p className="font-bold text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                Legal
              </p>
              <ul className="list-none space-y-4 text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                {legals.map((legal, idx) => (
                  <li key={"legal" + idx} className="list-none">
                    <Link
                      className="transition-colors hover:text-text-neutral-800"
                      href={legal.href}
                    >
                      {legal.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <p className="font-bold text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                Register
              </p>
              <ul className="list-none space-y-4 text-neutral-600 transition-colors hover:text-text-neutral-800 dark:text-neutral-300">
                {signups.map((auth, idx) => (
                  <li key={"auth" + idx} className="list-none">
                    <Link
                      className={cn(
                        "transition-colors hover:text-text-neutral-800",
                        auth.href === "/growth-system" && "btn-primary inline-flex w-fit"
                      )}
                      href={auth.href}
                    >
                      {auth.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
