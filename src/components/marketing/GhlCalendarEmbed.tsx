import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_GHL_CALENDAR_URL } from "@/constants/site";
import { TrackedPhoneLink } from "@/components/marketing/TrackedPhoneLink";

/**
 * Embeds the GHL booking calendar when NEXT_PUBLIC_GHL_CALENDAR_URL is set. Falls back to a
 * phone/email CTA so /book-call never breaks pre-launch while the real link is pending.
 */
export function GhlCalendarEmbed() {
  if (SITE_GHL_CALENDAR_URL) {
    return (
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <iframe
          src={SITE_GHL_CALENDAR_URL}
          title="Book a call"
          className="h-[720px] w-full border-0"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/90 p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Our booking calendar is coming online shortly. In the meantime, reach us directly and
        we&apos;ll get you scheduled by hand.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SITE_BUSINESS_PHONE ? (
          <TrackedPhoneLink
            phone={SITE_BUSINESS_PHONE}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          />
        ) : null}
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}`}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Email {SITE_CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
