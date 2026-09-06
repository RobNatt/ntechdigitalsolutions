"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PhoneMissed, PhoneOutgoing, XCircle } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/*
 * The hero artifact — the pain, on a loop.
 *
 * This shows what happens TODAY, without a system: the call rings out, you get
 * back to it three quarters of an hour later, and by then they've booked
 * someone else. It is the loss, start to finish, and it ends badly on purpose.
 *
 * THERE IS NO GOLD IN THIS PANEL, and that is a deliberate argument rather than
 * an oversight. Gold means the system throughout the site — the current, the
 * nodes, every CTA. Withholding it here means the hero is literally colourless,
 * and the first gold a visitor sees is the moment the page starts describing
 * the fix. The panel is cold; the solution is warm. Don't "brighten" it.
 *
 * The one exception is the final beat's icon, which uses the destructive token.
 * That is the outcome, and it should land.
 *
 * The number is a 555 reserved-for-fiction number and can never route to a real
 * person. Nothing here claims a real customer or a real statistic — it is a
 * recognisable situation, not a case study.
 */

type Phase = "missed" | "callback" | "lost";

const TIMING: Record<Phase, number> = {
  missed: 2600,
  callback: 3000,
  lost: 3600,
};
const ORDER: Phase[] = ["missed", "callback", "lost"];

export function CallDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "lost" : "missed");

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => {
      setPhase(ORDER[(ORDER.indexOf(phase) + 1) % ORDER.length]);
    }, TIMING[phase]);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-[20px] backdrop-saturate-150">
      <div className="flex items-center justify-between gap-4 px-3 pb-4 pt-2">
        <span className="text-overline uppercase text-muted-foreground">
          What happens without a system
        </span>
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-border-strong"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {reached("lost")
          ? "Illustration: a missed call returned forty-five minutes later, by which time the customer had booked elsewhere."
          : ""}
      </p>

      <ul className="space-y-3" aria-hidden="true">
        {/* 1 — the miss */}
        <li className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <PhoneMissed className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                Missed call
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                2:14pm
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              (402) 555-0147 — rang out while you were with someone else
            </span>
          </span>
        </li>

        {/* 2 — the callback, far too late */}
        <motion.li
          initial={false}
          animate={{
            opacity: reached("callback") ? 1 : 0.25,
            y: reached("callback") ? 0 : 6,
          }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
          className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
        >
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <PhoneOutgoing className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                You call back
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                2:59pm
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              45 minutes later — the first gap you had
            </span>
          </span>
        </motion.li>

        {/* 3 — the loss. The only colour in the panel, and it isn't gold. */}
        <motion.li
          initial={false}
          animate={{
            opacity: reached("lost") ? 1 : 0.25,
            y: reached("lost") ? 0 : 6,
          }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
          className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors duration-500 ${
            phase === "lost" ? "border-destructive/30" : "border-border"
          }`}
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-500 ${
              reached("lost")
                ? "bg-destructive/15 text-destructive"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <XCircle className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                Already booked someone else
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                gone
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              They needed it done today. You were the second call they made.
            </span>
          </span>
        </motion.li>
      </ul>
    </div>
  );
}
