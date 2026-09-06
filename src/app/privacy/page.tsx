import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — N-Tech Digital Solutions",
  description:
    "What N-Tech Digital Solutions collects, why, and what we do with it. Short version: we use your details to contact you about your enquiry, and nothing else.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="6 September 2026"
      intro="The short version: we collect the details you give us so we can get back to you about your enquiry. We don't sell them, rent them, or hand them to anyone who doesn't need them to do that job."
    >
      <Section heading="Who we are">
        <p>
          N-Tech Digital Solutions, based in Omaha, Nebraska. You can reach a
          person at{" "}
          <a href="mailto:hello@ntechdigitalsolutions.com">
            hello@ntechdigitalsolutions.com
          </a>
          .
        </p>
      </Section>

      <Section heading="What we collect">
        <p>Only what you choose to give us. That means:</p>
        <ul>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your phone number, if you provide one</li>
          <li>
            Your business name and anything else you type into a form or tell us
            on a call
          </li>
        </ul>
        <p>
          We also receive ordinary technical information that every website
          receives — the kind of browser and device you used, and roughly where
          in the world the request came from. We don&apos;t use it to identify
          you.
        </p>
      </Section>

      <Section heading="Why we collect it">
        <p>
          <strong>
            To contact you about your enquiry. That is the only reason.
          </strong>{" "}
          If you book a call, we use your details to hold that call and follow
          up on it. If you become a client, we use them to do the work you hired
          us for.
        </p>
        <p>
          We do not sell your information. We do not rent it. We do not share it
          with advertisers, data brokers, or anyone else looking to market to
          you.
        </p>
      </Section>

      <Section heading="Who else can see it">
        <p>
          Only the services we use to run the business, and only so far as they
          need to:
        </p>
        <ul>
          <li>
            <strong>GoHighLevel</strong> — our scheduling and customer records
            system. Your booking and contact details are stored there.
          </li>
          <li>
            <strong>Vercel</strong> — hosts this website and processes the
            requests that load it.
          </li>
          <li>
            <strong>Google</strong> — if you email us, that email sits in Google
            Workspace.
          </li>
        </ul>
        <p>
          Each of these has its own privacy policy governing what it does with
          data it processes on our behalf.
        </p>
      </Section>

      <Section heading="Text messages">
        <p>
          If you give us your phone number, we may text you about your enquiry —
          to confirm we&apos;ve got it, arrange a call, or follow up on
          something you asked about. That&apos;s the only reason we&apos;d use
          it.
        </p>
        <ul>
          <li>Message and data rates may apply, per your carrier plan.</li>
          <li>
            Reply <strong>STOP</strong> at any time and we&apos;ll stop texting
            you. Reply <strong>HELP</strong> for help.
          </li>
          <li>Message frequency varies depending on your enquiry.</li>
          <li>
            <strong>
              We do not sell, rent, or share your phone number or your consent
              to be texted with anyone.
            </strong>
          </li>
        </ul>
        <p>
          Carriers don&apos;t guarantee delivery, and neither can we — a message
          can fail for reasons outside anyone&apos;s control.
        </p>
      </Section>

      <Section heading="How we protect it">
        <p>
          We use reasonable administrative, technical, and organisational
          safeguards to protect your information, and we keep the number of
          people and systems that can reach it small.
        </p>
        <p>
          No method of transmission or storage is completely secure, and it
          would be dishonest to claim otherwise. What we can tell you is that we
          don&apos;t hold more than we need, and we don&apos;t keep it longer
          than we need.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <p>
          As long as we&apos;re talking, and for a reasonable period afterwards
          in case you come back. If you&apos;d rather we didn&apos;t, ask and
          we&apos;ll delete it.
        </p>
      </Section>

      <Section heading="Your choices">
        <p>You can, at any time and without giving a reason:</p>
        <ul>
          <li>Ask what we hold about you</li>
          <li>Ask us to correct it</li>
          <li>Ask us to delete it</li>
          <li>Tell us to stop contacting you</li>
        </ul>
        <p>
          Email{" "}
          <a href="mailto:hello@ntechdigitalsolutions.com">
            hello@ntechdigitalsolutions.com
          </a>{" "}
          and we&apos;ll do it. You will not be asked to justify yourself.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          This site does not use advertising or tracking cookies. Anything
          stored in your browser is there to make the site work, not to follow
          you around the internet.
        </p>
      </Section>

      <Section heading="Children">
        <p>
          This site is for businesses. We don&apos;t knowingly collect
          information from anyone under 18.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          If this policy changes, the date at the top changes with it. We
          won&apos;t quietly start doing something different with your
          information.
        </p>
      </Section>
    </LegalPage>
  );
}
