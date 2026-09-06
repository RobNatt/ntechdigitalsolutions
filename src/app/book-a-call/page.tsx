import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Book a Call — N-Tech Digital Solutions",
  description:
    "Fifteen minutes on the phone about your website, your calls, and what's falling through. No pressure, nothing to sign.",
};

/*
 * TEMPORARY: the intake form is removed while A2P verification is pending.
 *
 * Rob's instruction is that exactly one thing on this site collects visitor
 * information until the carrier registration comes back passed, and the
 * GoHighLevel chat widget is the one he kept. So this page no longer collects
 * anything — no iframe, no fields, no POST. The mailto link below opens the
 * visitor's own mail client, which is not collection.
 *
 * The page itself stays, because every "Book a Call" button on the site points
 * here. Deleting it would break the funnel in a dozen places to solve a problem
 * that only needed the form gone.
 *
 * TO RESTORE once A2P passes — put back exactly this, nothing else changed:
 *
 *   import Script from "next/script";
 *
 *   const FORM_ID = "R5cLPJUnb6wNr6YN3QXP";
 *   const FORM_SRC = `https://calendar.ntechdigitalsolutions.com/widget/form/${FORM_ID}`;
 *
 *   <iframe
 *     src={FORM_SRC}
 *     id={`inline-${FORM_ID}`}
 *     title="Infrastructure Intake form"
 *     data-layout="{'id':'INLINE'}"
 *     data-trigger-type="alwaysShow"
 *     data-activation-type="alwaysActivated"
 *     data-deactivation-type="neverDeactivate"
 *     data-form-name="Infrastructure Intake form"
 *     data-height="837"
 *     data-layout-iframe-id={`inline-${FORM_ID}`}
 *     data-form-id={FORM_ID}
 *     data-cookie-consent="true"
 *     data-cookie-consent-provider="auto"
 *     className="block w-full border-none"
 *     style={{ height: 837 }}
 *   />
 *
 *   <Script
 *     src="https://calendar.ntechdigitalsolutions.com/js/form_embed.js"
 *     strategy="lazyOnload"
 *   />
 *
 * form_embed.js is what resizes the iframe to its content — without it the frame
 * stays at its fallback height and the form is clipped, so it isn't optional.
 * The form's own SMS consent checkboxes live in GoHighLevel, not here.
 */

export default function BookACall() {
  return (
    <main className="flex-1">
      <section className="surface-dark grain relative isolate overflow-hidden px-6 pb-20 pt-40 md:px-12 md:pt-48 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.16),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              Book a call
            </p>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1 className="mt-6 max-w-[18ch] text-display font-heading text-foreground">
              Fifteen minutes. Nothing to sign.
            </h1>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[54ch] text-body-lg text-muted-foreground">
              Tell us what you do and what&apos;s falling through — the calls,
              the follow-ups, the people who looked you up and didn&apos;t find
              much. We&apos;ll tell you straight whether we can help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-20 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-[720px]">
          <Reveal tier="chapter" index={0}>
            <div className="rounded-lg border border-border bg-card p-8 md:p-12">
              <p className="text-overline uppercase text-cta">
                Booking form temporarily off
              </p>
              <h2 className="mt-6 text-h2 font-heading text-card-foreground">
                Email us and we&apos;ll get you on the calendar.
              </h2>
              <p className="mt-6 max-w-[52ch] text-body text-muted-foreground">
                We&apos;re finishing carrier verification for our text
                messaging, and until that clears we&apos;re not taking details
                through a form. Nothing about the conversation changes — send a
                line about your business and we&apos;ll come back with times.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="mailto:hello@ntechdigitalsolutions.com?subject=Booking%20a%20call"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Email hello@ntechdigitalsolutions.com
                </a>
              </div>

              <p className="mt-8 text-small text-muted-foreground">
                Prefer to type? The chat in the corner reaches the same inbox.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
