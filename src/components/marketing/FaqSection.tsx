import type { FaqItem } from "@/lib/seo-metadata";

export type FaqGroup = { title: string; items: readonly FaqItem[] };

type FaqSectionProps = {
  heading?: string;
  intro?: string;
  items?: readonly FaqItem[];
  groups?: readonly FaqGroup[];
  id?: string;
};

function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mt-3 space-y-2">
      {items.map((item) => (
        <details
          key={item.q}
          className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900/40"
        >
          <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {item.q}
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/**
 * Q&A accordion for core marketing pages. Pass `items` for a flat list or `groups` for the
 * grouped layout (see /about). Pair with `buildFaqJsonLd` (src/lib/seo-metadata.ts) for the
 * matching `FAQPage` schema.
 */
export function FaqSection({
  heading = "Frequently asked questions",
  intro,
  items,
  groups,
  id = "faq",
}: FaqSectionProps) {
  return (
    <section id={id} className="pt-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{heading}</h2>
      {intro ? (
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{intro}</p>
      ) : null}

      {groups ? (
        <div className="mt-5 space-y-5">
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-950/50"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                {group.title}
              </h3>
              <FaqList items={group.items} />
            </div>
          ))}
        </div>
      ) : (
        <FaqList items={items ?? []} />
      )}
    </section>
  );
}
