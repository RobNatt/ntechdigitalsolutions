import { ChannelChip, Section } from "@/components/ntech/primitives";

/**
 * Slot B puts hard numbers here (20 000+ projects, 4 000+ customers).
 * N-Tech is pre-case-study, so this deliberately is NOT a stat row: it carries
 * only facts that are checkable today. The TODO below marks where real
 * client numbers slot in later without redesigning the section.
 */
const FACTS = [
  { label: "Service area", value: "Omaha metro & Lincoln, NE" },
  { label: "Scope", value: "5 connected systems, 1 retainer" },
  { label: "Who runs it", value: "Robert Nattrass, founder" },
] as const;

export function Specifics() {
  return (
    <Section className="bg-field">
      <dl className="grid gap-8 sm:grid-cols-3">
        {FACTS.map((fact) => (
          <div key={fact.label}>
            <dt className="type-data text-[0.75rem] uppercase text-muted-ink">{fact.label}</dt>
            <dd className="type-heading mt-2.5 text-[1.125rem] text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <p className="type-data mt-8 flex flex-wrap items-center gap-2 text-[0.75rem] text-muted-ink">
        <ChannelChip tone="muted">Handoff</ChannelChip>
        TODO(client): first case-study results — call volume, follow-up time, review count — replace
        this line once the first of the five case studies lands.
      </p>
    </Section>
  );
}
