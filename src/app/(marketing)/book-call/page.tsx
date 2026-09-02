import type { Metadata } from "next";
import { PageShell } from "@/components/ntech/PageShell";
import { ActivityLog, ActivityRow } from "@/components/ntech/primitives";
import { BookingEmbed } from "@/components/ntech/BookingEmbed";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const bookDesc =
  "Book a 15-minute call with N-Tech Digital Solutions. We walk through what's leaking leads in your business today and give you the monthly retainer figure before you commit to anything.";

export const metadata: Metadata = {
  title: "Book a Call | N-Tech Digital Solutions",
  description: bookDesc,
  alternates: { canonical: canonicalUrl("/book-call") },
  openGraph: ogForPath("/book-call", "Book a Call | N-Tech Digital Solutions", bookDesc),
};

/** What the call itself does, so nobody books blind. */
const AGENDA = [
  {
    stamp: "00:00",
    channel: "call" as const,
    action: "We go through where your leads are leaking today",
    outcome: "Missed calls, follow-up, reviews",
  },
  {
    stamp: "00:07",
    channel: "crm" as const,
    action: "We show what the system looks like on your business specifically",
    outcome: "Not a generic demo",
  },
  {
    stamp: "00:12",
    channel: "calendar" as const,
    action: "You get the monthly retainer figure",
    outcome: "Before you commit",
  },
];

export default function BookCallPage() {
  return (
    <PageShell
      eyebrow="Book With Us"
      title="Fifteen minutes. You leave with the number."
      lede="No pitch deck and no obligation. We look at what's leaking in your business today, show you what the system would do about it, and tell you what it costs."
      close="none"
    >
      <p className="type-data text-[0.75rem] uppercase text-muted-ink">What the call covers</p>
      <ActivityLog label="What happens on the call" className="mt-3">
        {AGENDA.map((row) => (
          <ActivityRow key={row.action} {...row} state="done" />
        ))}
      </ActivityLog>

      <div className="mt-10">
        <BookingEmbed />
      </div>
    </PageShell>
  );
}
