import Link from "next/link";
import React from "react";
import { CONSTANTS } from "@/constants/links";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Footer() {
  const pages = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  const socials = [
    {
      title: "Facebook",
      href: "#",
    },
    {
      title: "Instagram",
      href: "#",
    },
    {
      title: "Twitter",
      href: "#",
    },
    {
      title: "LinkedIn",
      href: "#",
    },
  ];
  const legals = [
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      title: "Terms of Service",
      href: "/terms-and-conditions",
    },
    {
      title: "Cookie Policy",
      href: "#",
    },
  ];

  const signups = [
    { title: "Sign up", href: "/signup" },
    { title: "Login", href: "/login" },
    {
      title: "Book a demo",
      href: CONSTANTS.CONTACT_PATH,
    },
  ];
  return (
    <div className="border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-neutral-950 w-full relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl md:px-8">
        <p
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-3xl font-bold uppercase leading-tight text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text sm:text-5xl md:text-7xl lg:text-9xl dark:from-neutral-950 dark:to-neutral-800"
        >
          N-Tech Digital Solutions
        </p>

        <div className="relative z-10 flex flex-col items-start justify-between text-sm text-neutral-500 sm:flex-row">
        <div>
          <div className="mr-0 md:mr-4  md:flex mb-4">
            <Logo />
          </div>

          <div className="mt-2 ml-2">
            &copy; {new Date().getFullYear()} N-Tech Digital Solutions. All rights
            reserved.
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 lg:grid-cols-4 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Pages
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {pages.map((page, idx) => (
                <li key={"pages" + idx} className="list-none">
                  <Link
                    className={cn(
                      "transition-colors hover:text-text-neutral-800 ",
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

          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Socials
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {socials.map((social, idx) => (
                <li key={"social" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href={social.href}
                  >
                    {social.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Legal
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {legals.map((legal, idx) => (
                <li key={"legal" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href={legal.href}
                  >
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Register
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {signups.map((auth, idx) => (
                <li key={"auth" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
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
