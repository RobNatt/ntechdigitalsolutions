"use client";

import { Suspense } from "react";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";
import { ContactLeadForm } from "./contact-lead-form";

function FormFallback() {
  return (
    <div className="h-96 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative isolate w-full overflow-hidden border-t border-neutral-200 bg-white py-20 md:py-24 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto max-w-lg px-4 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          — Contact
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-100">
          Let&apos;s talk about your growth system
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Share your details — we&apos;ll route this through our lead agent for
          qualification and follow-up.
        </p>

        <div className="mt-10">
          <Suspense fallback={<FormFallback />}>
            <ContactLeadForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
