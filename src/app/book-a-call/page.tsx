import type { Metadata } from "next";
import Script from "next/script";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Book a Call — N-Tech Digital Solutions",
  description:
    "Fifteen minutes on the phone about your website, your calls, and what's falling through. No pressure, nothing to sign.",
};

/*
 * The intake form, embedded rather than linked.
 *
 * The CTAs used to send visitors to the GoHighLevel-hosted form, which meant
 * leaving the site at the exact moment they'd decided to act — losing the nav,
 * the branding, and any sense of continuity. Embedding keeps them here.
 *
 * The iframe is GoHighLevel's own; submissions go straight into the CRM, so
 * there's no API route in the middle and nothing that can silently drop a lead.
 *
 * form_embed.js is what resizes the iframe to its content. Without it the frame
 * stays at its fallback height and the form is clipped, so the script isn't
 * optional. Loaded lazily — it isn't needed for first paint.
 */

const FORM_ID = "R5cLPJUnb6wNr6YN3QXP";
const FORM_SRC = `https://calendar.ntechdigitalsolutions.com/widget/form/${FORM_ID}`;

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
        <div className="mx-auto max-w-[860px]">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <iframe
              src={FORM_SRC}
              id={`inline-${FORM_ID}`}
              title="Infrastructure Intake form"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Infrastructure Intake form"
              data-height="837"
              data-layout-iframe-id={`inline-${FORM_ID}`}
              data-form-id={FORM_ID}
              data-cookie-consent="true"
              data-cookie-consent-provider="auto"
              className="block w-full border-none"
              style={{ height: 837 }}
            />
          </div>

          <p className="mx-auto mt-8 max-w-[60ch] text-center text-small text-muted-foreground">
            Form not loading? Email{" "}
            <a
              href="mailto:hello@ntechdigitalsolutions.com"
              className="text-foreground underline underline-offset-4"
            >
              hello@ntechdigitalsolutions.com
            </a>{" "}
            and a person will pick it up.
          </p>
        </div>
      </section>

      <Script
        src="https://calendar.ntechdigitalsolutions.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </main>
  );
}
