import { ActivityLog, ActivityRow, Section, SectionHeading } from "@/components/ntech/primitives";

/**
 * The four leaks, drawn from N-Tech's own description of what its buyers lose.
 * Rendered in the failed state: the current never reaches these rows.
 * This is the one screen on the page with no CTA — naming the problem and
 * then immediately selling is what the buyer is braced for.
 */
const LEAKS = [
  { stamp: "7:42 PM", channel: "call", action: "Missed call", outcome: "Never returned" },
  { stamp: "9:15 AM", channel: "form", action: "Form fill", outcome: "Followed up 2 days later" },
  { stamp: "1:03 PM", channel: "social", action: "Comment on a post", outcome: "Never replied to" },
  { stamp: "5:30 PM", channel: "review", action: "Job finished, customer happy", outcome: "Never asked for a review" },
] as const;

export function Leaks() {
  return (
    <Section index="01" eyebrow="Where the money goes" className="bg-field-sunken">
      <SectionHeading>
        Four rows that never completed.
        <span className="text-muted-ink"> Every local business has all four.</span>
      </SectionHeading>

      <ActivityLog label="Four common lead leaks" className="mt-9">
        {LEAKS.map((leak) => (
          <ActivityRow key={leak.action} {...leak} state="failed" />
        ))}
      </ActivityLog>

      <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-muted-ink">
        None of these are marketing problems. They all happen after the lead already found you.
      </p>
    </Section>
  );
}
