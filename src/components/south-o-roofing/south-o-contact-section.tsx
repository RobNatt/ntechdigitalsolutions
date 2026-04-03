"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS = [
  "Residential roofing",
  "Commercial roofing",
  "Roof repair",
  "Roof inspection",
  "Gutter system",
  "Skylight installation",
] as const;

/** Matches header “Free Estimate” CTA */
const ESTIMATE_CTA =
  "w-full rounded-md bg-[#b45309] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a4508] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#b45309] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none ring-[#b45309]/0 transition focus:border-[#b45309]/40 focus:ring-2 focus:ring-[#b45309]/25";

export function SouthOContactSection() {
  const hookReduce = useReducedMotion();
  /** SSR + first client paint must match — `useReducedMotion()` can be null/undefined on server. */
  const [reduceMotion, setReduceMotion] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setReduceMotion(hookReduce === true);
  }, [hookReduce]);

  const leftVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };

  const rightVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };

  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-neutral-200"
    >
      <div className="absolute inset-0">
        <Image
          src="/Omaha-scenic.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/70 to-black/55"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/25" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px", amount: 0.2 }}
            transition={transition}
            className="text-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fdba73] sm:text-sm">
              Get In Touch
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.5rem]">
              <span className="block">Ready to Protect</span>
              <span className="mt-1 block">Your Investment?</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              Get your free, no-obligation estimate today. Our team will assess your roof and
              provide a detailed quote — no pressure, no surprises.
            </p>

            <ul className="mt-10 space-y-6">
              <li>
                <Link
                  href="tel:+14025551234"
                  className="group flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#b45309]/90 text-white">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Call Us
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white group-hover:text-[#fdba73]">
                      (402) 555-1234
                    </p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:hello@southoroofing.com"
                  className="group flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Email Us
                    </p>
                    <p className="mt-1 break-all text-lg font-semibold text-white group-hover:text-[#fdba73]">
                      hello@southoroofing.com
                    </p>
                  </div>
                </Link>
              </li>
              <li className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
                  <MapPin className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Service Area
                  </p>
                  <p className="mt-1 font-medium text-white/95">
                    Omaha, Lincoln &amp; Greater Nebraska
                  </p>
                </div>
              </li>
              <li className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
                  <Clock className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Hours
                  </p>
                  <p className="mt-1 font-medium text-white/95">Mon–Sat: 7am – 6pm</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px", amount: 0.2 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="rounded-2xl border border-white/15 bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="text-lg font-semibold text-neutral-900">Request a free estimate</h3>
              <p className="mt-1 text-sm text-neutral-600">
                We&apos;ll respond within one business day.
              </p>
              <p className="mt-3 flex items-start gap-2 border-b border-neutral-100 pb-4 text-xs text-neutral-600">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#b45309]" aria-hidden />
                <span>
                  <span className="font-semibold text-neutral-800">Service area: </span>
                  Omaha, Lincoln &amp; Greater Nebraska
                </span>
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    First name
                    <input name="firstName" required className={fieldClass} autoComplete="given-name" />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Last name
                    <input name="lastName" required className={fieldClass} autoComplete="family-name" />
                  </label>
                </div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    className={fieldClass}
                    autoComplete="email"
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    required
                    className={fieldClass}
                    autoComplete="tel"
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Service need
                  <select name="service" required className={cn(fieldClass, "bg-white")} defaultValue="">
                    <option value="" disabled>
                      Select a service…
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Message
                  <textarea name="message" rows={4} className={cn(fieldClass, "resize-y")} />
                </label>
                <button type="submit" className={ESTIMATE_CTA}>
                  Request free estimate
                </button>
                {sent && (
                  <p className="text-center text-sm font-medium text-green-700" role="status">
                    Thanks — we&apos;ll be in touch. (Connect to your API when ready.)
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
