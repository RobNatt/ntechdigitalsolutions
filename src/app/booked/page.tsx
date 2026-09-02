import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Mail } from "lucide-react";
import { ChannelChip, ctaOnDark } from "@/components/ntech/primitives";
import { canonicalUrl } from "@/lib/seo-metadata";
import { SITE_CONTACT_EMAIL } from "@/constants/site";

/**
 * The booking-confirmation page — the site's ONE distinct visual register.
 *
 * It earns dark on three grounds, not one:
 *  1. It is the only screen a visitor sits still on to watch video, where a
 *     dark surround is the correct viewing condition rather than a mood.
 *  2. The visitor has crossed from browsing into a scheduled commitment.
 *  3. Per the pricing disclosure, it is the only page permitted to show a price.
 *
 * Every other page on the site stays on the light field. Not indexed — this is
 * a post-conversion page, not an entry point.
 */
export const metadata: Metadata = {
  title: "You're booked | N-Tech Digital Solutions",
  description:
    "Your call with N-Tech Digital Solutions is confirmed. Watch the walkthrough before we talk.",
  alternates: { canonical: canonicalUrl("/booked") },
  robots: { index: false, follow: false },
};

const BEFORE_THE_CALL = [
  "Roughly how many calls a week go unanswered — a guess is fine",
  "Who currently follows up on form submissions, and how fast",
  "Your Google Business Profile, if you know whether you have access",
] as const;

export default function BookedPage() {
  return (
    <main id="main" className="min-h-screen bg-ink text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/ntech-mark.png"
            alt=""
            width={445}
            height={353}
            className="h-8 w-auto object-contain"
          />
          <span className="type-heading text-[0.9375rem] tracking-tight text-white">
            N-Tech <span className="text-white/50">Digital Solutions</span>
          </span>
          <span className="sr-only">— home</span>
        </Link>

        {/* The current completes its circuit: the visitor is now a row in N-Tech's own log. */}
        <div className="mt-14 flex items-center gap-3">
          <span aria-hidden className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-live opacity-40 motion-safe:animate-ping" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-live" />
          </span>
          <ChannelChip tone="onDark">Calendar · Booked</ChannelChip>
        </div>

        <h1 className="type-display mt-6 text-[2.25rem] sm:text-[3rem]">
          You&apos;re booked.{" "}
          <span className="text-white/50">That row just completed in our log too.</span>
        </h1>

        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/70">
          A confirmation is on its way to your inbox. Before we talk, the walkthrough below covers
          the whole system end to end — it is the same thing we would otherwise spend the first ten
          minutes of the call on.
        </p>

        {/*
          Video slot. Renders nothing until a real URL exists — a "coming soon"
          card on a page selling operational readiness argues against itself.
        */}
        {process.env.NEXT_PUBLIC_VSL_EMBED_URL ? (
          <div className="mt-12 overflow-hidden rounded-xl border border-white/15 bg-black">
            <iframe
              src={process.env.NEXT_PUBLIC_VSL_EMBED_URL}
              title="N-Tech system walkthrough"
              className="aspect-video w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-white/25 p-6">
            <p className="type-data text-[0.75rem] uppercase text-white/50">Handoff</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/80">
              TODO(client): set <code className="type-data">NEXT_PUBLIC_VSL_EMBED_URL</code> to the
              walkthrough video embed URL.
            </p>
          </div>
        )}

        {/* The only page permitted to show a price. */}
        <section aria-labelledby="retainer" className="mt-12 border-l-2 border-live pl-5 sm:pl-7">
          <p className="type-data text-[0.75rem] uppercase text-white/50">
            What we will quote you on the call
          </p>
          <h2 id="retainer" className="type-heading mt-3 text-[1.5rem]">
            One flat monthly retainer. No build fee.
          </h2>
          <p className="type-data mt-5 rounded-lg border border-dashed border-white/25 px-4 py-3 text-[0.8125rem] text-white/60">
            TODO(client): case-study phase monthly retainer figure. This page is the only place on
            the site where a price may appear.
          </p>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/70">
            It covers all five components. Paid ad management and ad spend sit outside it, and we
            only raise those after the infrastructure is running.
          </p>
        </section>

        <section aria-labelledby="prep" className="mt-12">
          <h2 id="prep" className="type-heading text-[1.25rem]">
            Worth having to hand
          </h2>
          <ul className="mt-5 space-y-3">
            {BEFORE_THE_CALL.map((line) => (
              <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/80">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-live" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/60">
            None of it is required. If you turn up with nothing we will work it out on the call.
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-8 sm:flex-row">
          <Link href="/infrastructure" className={ctaOnDark}>
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Read the system breakdown
          </Link>
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-live"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Need to reschedule?
          </a>
        </div>
      </div>
    </main>
  );
}
