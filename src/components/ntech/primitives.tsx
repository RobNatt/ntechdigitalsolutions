import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   Motif: the lead activity row.
   The artifact N-Tech's own team reads all day, and the literal
   output of what they sell:
     7:42 PM · Missed call · AI answered · Booked Tue 9:00 AM
   Every card, badge and CTA on this site is cut from this shape.
   ============================================================ */

export type RowChannel = "call" | "form" | "crm" | "social" | "review" | "calendar";

export type RowState =
  /** Reached by the current — the system did its job. */
  | "done"
  /** The leak: the current never got here. */
  | "failed"
  /** Waiting for the current to arrive. */
  | "pending";

export const CHANNEL_LABEL: Record<RowChannel, string> = {
  call: "Call",
  form: "Form",
  crm: "CRM",
  social: "Social",
  review: "Review",
  calendar: "Calendar",
};

/**
 * The row's channel column, extracted as the site's only badge shape.
 * Used for eyebrows, nav affordances and FAQ tags — no other pill exists.
 */
export function ChannelChip({
  children,
  tone = "default",
  className,
  as: As = "span",
}: {
  children: ReactNode;
  tone?: "default" | "current" | "muted" | "onDark";
  className?: string;
  as?: "span" | "div";
}) {
  return (
    <As
      className={cn(
        "type-data inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[0.6875rem] uppercase leading-none",
        tone === "default" && "border-rule-strong bg-white text-ink",
        tone === "current" && "border-live/40 bg-live/10 text-ink",
        tone === "muted" && "border-rule bg-transparent text-muted-ink",
        tone === "onDark" && "border-white/20 bg-white/5 text-white/80",
        className
      )}
    >
      {children}
    </As>
  );
}

/** The current's head: the cyan node that arrives when a stage completes. */
export function CurrentNode({ state, className }: { state: RowState; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex h-2 w-2 shrink-0 rounded-full",
        state === "done" && "bg-live",
        state === "pending" && "bg-rule-strong",
        state === "failed" && "bg-transparent ring-1 ring-inset ring-muted-ink/50",
        className
      )}
    >
      {state === "done" ? (
        <span className="absolute inset-0 rounded-full bg-live opacity-30 motion-safe:animate-ping" />
      ) : null}
    </span>
  );
}

export type ActivityRowProps = {
  /** Mono timestamp in the gutter — the rail the current travels. */
  stamp: string;
  channel: RowChannel;
  /** What happened. */
  action: string;
  /** The right-hand result column. */
  outcome?: string;
  state?: RowState;
  className?: string;
  /** Index, used only to stagger the appear animation. */
  index?: number;
  animate?: boolean;
  /**
   * Keep the stacked layout regardless of viewport. The wide row keys off
   * viewport breakpoints, so inside a narrow column it would still try to lay
   * out four across and wrap every cell.
   */
  compact?: boolean;
};

export function ActivityRow({
  stamp,
  channel,
  action,
  outcome,
  state = "done",
  className,
  index = 0,
  animate = false,
  compact = false,
}: ActivityRowProps) {
  return (
    <li
      className={cn(
        /* Each row is its own grid, so the channel column is a FIXED width — an
         auto column would size per row and the log would not line up. */
      "grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 border-b border-rule py-3 last:border-b-0 sm:grid-cols-[5.25rem_6rem_1fr_auto] sm:items-center sm:gap-x-4",
        className
      )}
      style={
        animate
          ? {
              animation: "ntech-row-in 320ms cubic-bezier(0.2, 0.6, 0.2, 1) both",
              animationDelay: `${index * 90}ms`,
            }
          : undefined
      }
    >
      <span className="type-data col-start-1 row-start-1 flex items-center gap-2 text-[0.75rem] text-muted-ink tabular-nums">
        <CurrentNode state={state} />
        {stamp}
      </span>

      <span className={cn("col-start-2 row-start-1", !compact && "sm:col-start-2 sm:justify-self-start")}>
        <ChannelChip tone={state === "failed" ? "muted" : "default"}>
          {CHANNEL_LABEL[channel]}
        </ChannelChip>
      </span>

      <span
        className={cn(
          "col-span-2 col-start-1 row-start-2 text-[0.9375rem] leading-snug text-ink",
          !compact && "sm:col-span-1 sm:col-start-3 sm:row-start-1"
        )}
      >
        {action}
      </span>

      {outcome ? (
        <span
          className={cn(
            "type-data col-span-2 col-start-1 row-start-3 text-[0.75rem]",
            !compact && "sm:col-span-1 sm:col-start-4 sm:row-start-1 sm:text-right",
            state === "done" && "text-ink",
            state === "pending" && "text-muted-ink",
            state === "failed" && "text-muted-ink"
          )}
        >
          {outcome}
        </span>
      ) : null}
    </li>
  );
}

/**
 * Corner tick marks — taken from Slot C, which frames its panels this way.
 * Reserved for the log, the motif's home, rather than applied to every card.
 */
function CornerTicks() {
  const base = "pointer-events-none absolute h-2 w-2 border-muted-ink/40";
  return (
    <span aria-hidden>
      <span className={cn(base, "-left-px -top-px border-l border-t")} />
      <span className={cn(base, "-right-px -top-px border-r border-t")} />
      <span className={cn(base, "-bottom-px -left-px border-b border-l")} />
      <span className={cn(base, "-bottom-px -right-px border-b border-r")} />
    </span>
  );
}

/** A log: rows stacked against the gutter rail the current runs down. */
export function ActivityLog({
  children,
  label,
  live = false,
  className,
}: {
  children: ReactNode;
  label: string;
  live?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <CornerTicks />
      <ul
        aria-label={label}
        {...(live ? { "aria-live": "polite" as const, "aria-atomic": false } : {})}
        className="rounded-xl border border-rule bg-white px-4 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:px-5"
      >
        {children}
      </ul>
    </div>
  );
}

/* ============================================================
   CTAs. The primary is Learn More; Book With Us is the secondary
   everywhere except the page close, where it leads.
   ============================================================ */

const ctaBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[0.9375rem] font-semibold leading-none transition-colors min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

export const ctaPrimary = cn(
  ctaBase,
  "bg-action text-white hover:bg-[#195e9d] focus-visible:outline-ink"
);

export const ctaSecondary = cn(
  ctaBase,
  "border border-rule-strong bg-white text-ink hover:border-ink hover:bg-field-sunken"
);

export const ctaOnDark = cn(
  ctaBase,
  "bg-white text-ink hover:bg-white/90 focus-visible:outline-live"
);

/**
 * The row's outcome cell, scaled up into a section close:
 * left rule, mono stamp, the outcome sentence, the button.
 */
export function OutcomeBlock({
  stamp,
  heading,
  body,
  children,
  className,
}: {
  stamp: string;
  heading: string;
  body?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-l-2 border-live bg-white py-6 pl-5 pr-5 sm:pl-7 sm:pr-7",
        className
      )}
    >
      <p className="type-data text-[0.75rem] uppercase text-muted-ink">{stamp}</p>
      <h2 className="type-heading mt-3 text-[var(--text-step-2)] text-ink sm:text-[var(--text-step-3)]">
        {heading}
      </h2>
      {body ? (
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-muted-ink">{body}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

/** Section wrapper: consistent rhythm, hairline separation, mono section index. */
export function Section({
  id,
  index,
  eyebrow,
  children,
  className,
  bleed = false,
  width = "max-w-5xl",
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
  width?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 border-t border-rule", className)}
    >
      <div className={cn("mx-auto w-full px-4 sm:px-6", width, bleed ? "py-0" : "py-14 sm:py-20")}>
        {eyebrow ? (
          <p className="type-data mb-6 flex items-center gap-2.5 text-[0.75rem] uppercase text-muted-ink">
            {index ? <span className="text-muted-ink">{index}</span> : null}
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  children,
  trailing,
  className,
}: {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "type-heading text-[var(--text-step-3)] text-ink sm:text-[var(--text-step-4)]",
        className
      )}
    >
      {children}
      {trailing ? <span className="text-muted-ink"> {trailing}</span> : null}
    </h2>
  );
}
