import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ntech/primitives";
import { HOME_FAQ_ITEMS } from "@/constants/home-faq";

/** Disclosure rows cut from the activity row: mono index in the gutter. */
export function Faq() {
  return (
    <Section index="06" eyebrow="Questions" className="bg-field">
      <SectionHeading>Before you book.</SectionHeading>

      <div className="mt-9 rounded-xl border border-rule bg-white px-4 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:px-6">
        {HOME_FAQ_ITEMS.map((item, i) => (
          <details
            key={item.question}
            className="group border-b border-rule last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-start gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action sm:gap-4">
              <span className="type-data mt-0.5 shrink-0 text-[0.75rem] text-muted-ink tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="type-heading flex-1 text-[1rem] text-ink">{item.question}</span>
              <Plus
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-ink transition-transform duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="pb-5 pl-0 text-[0.9375rem] leading-relaxed text-muted-ink sm:pl-[3.25rem]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
