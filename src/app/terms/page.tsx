import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms you agree to when working with N-Tech Digital Solutions, including what we do, what we don't promise, and who owns what.",
};

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="6 September 2026"
      intro="These are the terms you're agreeing to when you work with us. We've written them to be read rather than skipped — if any of it is unclear, ask before you sign anything."
    >
      <Section heading="Who we are">
        <p>
          N-Tech Digital Solutions, based in Omaha, Nebraska. Referred to below
          as &quot;we&quot; or &quot;us&quot;. You are &quot;you&quot; or
          &quot;the client&quot;.
        </p>
      </Section>

      <Section heading="What we do">
        <p>
          We build and manage digital infrastructure for local businesses:
          websites, follow-up automations, an AI receptionist, social media
          management, and review generation. What you receive depends on what
          you&apos;ve agreed to — the specific services, deliverables, and
          amounts are set out separately in your quote or agreement, and that
          document governs if it conflicts with anything here.
        </p>
      </Section>

      <Section heading="No guarantee of results">
        <p>
          <strong>
            We do not guarantee results. No specific number of leads, calls,
            bookings, reviews, rankings, followers, or revenue is promised, and
            nothing on our website or in a conversation should be read as such a
            promise.
          </strong>
        </p>
        <p>
          What we guarantee is the work: that we build what we said we&apos;d
          build and run what we said we&apos;d run. What happens as a result
          depends on your market, your pricing, your capacity, your competition,
          how you handle the leads that arrive, and a great many other things
          outside our control.
        </p>
        <p>
          Anyone in this industry promising you a specific outcome is either
          guessing or lying. We&apos;d rather tell you that up front than have
          you find out later.
        </p>
      </Section>

      <Section heading="What we need from you">
        <p>
          The work depends on you holding up your end. That means giving us the
          access, information, and approvals we need in reasonable time, and
          making sure anything you hand us — logos, photos, copy, footage — is
          yours to use. Delays on your side move the timeline; they don&apos;t
          pause the fee.
        </p>
        <p>
          You&apos;re responsible for what your business says and does. We
          produce work on your behalf, but you remain accountable for your own
          claims, your own compliance, and your own customer relationships.
        </p>
      </Section>

      <Section heading="Fees and payment">
        <p>
          Services are billed monthly in advance unless your agreement says
          otherwise. Prices, terms, and any minimum commitment are set out in
          your quote.
        </p>
        <p>
          If payment stops, the services stop. We&apos;ll tell you before that
          happens.
        </p>
      </Section>

      <Section heading="Ending the arrangement">
        <p>
          Either of us can end an ongoing service by giving notice as set out in
          your agreement. Work already delivered and fees already due remain
          payable. We won&apos;t hold your accounts, domains, or content hostage
          on the way out.
        </p>
      </Section>

      <Section heading="Who owns what">
        <p>
          Once you&apos;ve paid for it, the work we produce specifically for you
          — your site&apos;s content, your branding, your copy — is yours.
        </p>
        <p>
          We keep ownership of our own methods, templates, systems, and any
          underlying tools we use across clients. Third-party platforms such as
          GoHighLevel remain subject to their own terms, and access to them
          depends on an active subscription.
        </p>
      </Section>

      <Section heading="Third-party services">
        <p>
          Parts of what we deliver run on platforms we don&apos;t control,
          including GoHighLevel, Google, and social media networks. If one of
          them changes its rules, pricing, or availability, that affects what we
          can deliver, and it isn&apos;t something we can be held liable for.
        </p>
      </Section>

      <Section heading="Text messages">
        <p>
          Where you or your customers provide a phone number and agree to be
          contacted, the systems we run may send text messages — confirmations,
          follow-ups, appointment reminders, review requests.
        </p>
        <p>
          Message and data rates may apply. Recipients can reply{" "}
          <strong>STOP</strong> to opt out at any time, and that opt-out is
          honoured. Delivery depends on carriers and is not guaranteed.
        </p>
        <p>
          <strong>
            If we operate messaging on your behalf, you are responsible for
            having obtained proper consent from the people being contacted.
          </strong>{" "}
          We&apos;ll build the system to handle consent and opt-outs correctly,
          but we can&apos;t verify how a number reached your list in the first
          place.
        </p>
      </Section>

      <Section heading="Disclaimer of warranties">
        <p>
          Our services are provided as they are. We don&apos;t warrant that they
          will be uninterrupted, error-free, or that they will produce any
          particular result — see the section above on results.
        </p>
        <p>
          Third-party platforms we build on, including GoHighLevel, Google, and
          the social networks, carry their own terms and their own uptime. We
          can&apos;t warrant something we don&apos;t operate.
        </p>
      </Section>

      <Section heading="Indemnification">
        <p>
          You agree to cover us against claims arising from the content you give
          us to publish, the claims your business makes, and your own compliance
          obligations — including consent for anyone you ask us to contact.
        </p>
        <p>
          Put plainly: we&apos;re responsible for the work we do. You&apos;re
          responsible for what your business says and who it says it to.
        </p>
      </Section>

      <Section heading="Limitation of liability">
        <p>
          We&apos;re liable for doing the work we agreed to do. We aren&apos;t
          liable for lost profits, lost business, or other indirect losses. Our
          total liability is limited to the fees you paid us in the three months
          before the issue arose.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          These terms are governed by the laws of the State of Nebraska, and any
          dispute will be handled in the courts of Douglas County, Nebraska.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          We may update these terms. If we do, the date at the top changes. If a
          change materially affects an active client, we&apos;ll tell you
          directly rather than expecting you to notice.
        </p>
      </Section>
    </LegalPage>
  );
}
