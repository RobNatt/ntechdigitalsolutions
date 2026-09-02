import type { Metadata } from "next";
import { PageShell } from "@/components/ntech/PageShell";
import { ChannelChip } from "@/components/ntech/primitives";
import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { ReceptionistDemoCta } from "@/components/ntech/ReceptionistDemoCta";
import { SITE_CONTACT_EMAIL, SITE_SERVICE_AREAS } from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const contactDesc =
  "Reach N-Tech Digital Solutions about missed calls, slow lead follow-up, or getting more Google reviews — Omaha metro and Lincoln, NE.";

export const metadata: Metadata = {
  title: "Contact | N-Tech Digital Solutions",
  description: contactDesc,
  alternates: { canonical: canonicalUrl("/contact") },
  openGraph: ogForPath("/contact", "Contact | N-Tech Digital Solutions", contactDesc),
};

type ContactPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const sp = await searchParams;
  const planInterest = typeof sp.plan === "string" && sp.plan.trim() ? sp.plan.trim() : undefined;

  return (
    <PageShell
      eyebrow="Contact"
      title="Tell us which row never completed."
      lede="Missed calls, slow follow-up, inconsistent reviews, or all three. Send it over and we'll reply by email with what we'd do about it."
      close="none"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
          <h2 className="type-heading text-[1.25rem] text-ink">Send a message</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-ink">
            This form runs on the same lead automation we install for clients: it emails our team
            immediately and sends you a confirmation. You are not waiting on someone to check an
            inbox.
          </p>
          <div className="mt-6">
            <MarketingInquiryForm planInterest={planInterest} />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="type-data text-[0.75rem] uppercase text-muted-ink">Email</p>
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="mt-2 block text-[0.9375rem] text-ink underline underline-offset-4"
            >
              {SITE_CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <p className="type-data text-[0.75rem] uppercase text-muted-ink">Call the receptionist</p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-ink">
              It is the same one we install. Calling it is the fastest way to hear what it does.
            </p>
            <div className="mt-3">
              <ReceptionistDemoCta />
            </div>
          </div>

          <div>
            <p className="type-data text-[0.75rem] uppercase text-muted-ink">Where we work</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{SITE_SERVICE_AREAS}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ChannelChip tone="muted">Omaha, NE</ChannelChip>
              <ChannelChip tone="muted">Lincoln, NE</ChannelChip>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
