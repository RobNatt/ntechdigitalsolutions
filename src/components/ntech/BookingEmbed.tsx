import { SITE_CONTACT_EMAIL, SITE_GHL_CALENDAR_URL } from "@/constants/site";
import { ReceptionistDemoCta } from "@/components/ntech/ReceptionistDemoCta";
import { ctaSecondary } from "@/components/ntech/primitives";

/**
 * The booking calendar. GoHighLevel only — Cal.com and Calendly were removed so
 * there is one booking path rather than three competing ones.
 * Falls back to direct contact when the calendar URL is not configured, so the
 * page never points a visitor at a broken embed.
 */
export function BookingEmbed() {
  if (SITE_GHL_CALENDAR_URL) {
    return (
      <div className="overflow-hidden rounded-xl border border-rule bg-white shadow-[0_1px_2px_rgba(14,35,64,0.04)]">
        <iframe
          src={SITE_GHL_CALENDAR_URL}
          title="Book a call with N-Tech Digital Solutions"
          className="h-[720px] w-full border-0"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-rule-strong bg-white p-6">
      <p className="type-data text-[0.75rem] uppercase text-muted-ink">Handoff</p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
        TODO(client): set <code className="type-data">NEXT_PUBLIC_GHL_CALENDAR_URL</code> to the
        GoHighLevel booking calendar. Until then this page routes visitors to email and the
        receptionist line instead of a broken embed.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={`mailto:${SITE_CONTACT_EMAIL}`} className={ctaSecondary}>
          Email {SITE_CONTACT_EMAIL}
        </a>
        <ReceptionistDemoCta />
      </div>
    </div>
  );
}
