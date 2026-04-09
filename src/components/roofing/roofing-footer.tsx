"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { SITE_CONTACT_EMAIL } from "@/constants/site";

const QUICK_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "X (Twitter)", href: "https://twitter.com/", icon: Twitter },
] as const;

const CTA_BTN =
  "inline-flex w-full items-center justify-center rounded-md bg-[#b45309] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a4508] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#b45309] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

const inputClass =
  "min-h-[44px] w-full min-w-0 rounded-md border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none ring-[#b45309]/0 transition focus:border-[#b45309]/50 focus:ring-2 focus:ring-[#b45309]/30";

export function RoofingFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const mailto = `mailto:${SITE_CONTACT_EMAIL}`;

  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="flex flex-col gap-5">
            <Link href="#top" className="inline-flex w-fit items-center gap-3">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#b45309] text-white shadow-inner ring-1 ring-white/10"
                aria-hidden
              >
                <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
                  <path d="M4 14L16 4l12 10v2H4v-2zm2 4h20v10H6V18z" />
                </svg>
              </span>
              <span className="text-lg font-semibold leading-tight tracking-tight text-white">
                Roofing
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
              Premium roofing solutions backed by hometown values and generational expertise.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:border-[#b45309]/40 hover:bg-[#b45309]/15 hover:text-[#fdba73]"
                    aria-label={label}
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Stay Updated
            </h2>
            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              noValidate
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-2">
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  aria-describedby="footer-newsletter-hint"
                />
                <button type="submit" className={CTA_BTN}>
                  Subscribe
                </button>
              </div>
              <p id="footer-newsletter-hint" className="text-xs leading-relaxed text-neutral-500">
                Seasonal tips and maintenance reminders.
              </p>
              {subscribed && (
                <p className="text-sm font-medium text-[#fdba73]" role="status">
                  Thanks — you&apos;re on the list.
                </p>
              )}
            </form>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Quick links
            </h2>
            <nav className="mt-4" aria-label="Footer">
              <ul className="space-y-3 text-sm">
                {QUICK_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-neutral-400 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Connect
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li>
                <a
                  href={mailto}
                  className="group flex gap-3 text-neutral-400 transition hover:text-white"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#fdba73] ring-1 ring-white/10">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400">
                      Email
                    </span>
                    <span className="break-all font-medium text-neutral-200 group-hover:text-white">
                      {SITE_CONTACT_EMAIL}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex gap-3 text-neutral-400">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#fdba73] ring-1 ring-white/10">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Location
                  </span>
                  <span className="font-medium text-neutral-200">
                    Omaha, NE — serving Lincoln &amp; Greater Nebraska
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Roofing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
