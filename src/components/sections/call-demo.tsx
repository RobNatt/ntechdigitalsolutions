"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquare, Phone, PhoneMissed } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/*
 * The hero artifact — the product actually working, on a loop.
 *
 * The previous version listed three outcomes side by side, which has no time in
 * it and therefore no drama. This plays the scene instead: a call comes in, it
 * rings out, the reply types itself, the slot fills. Eight seconds. A visitor
 * watches a job get caught while they're still reading the headline.
 *
 * Everything is placeholder. The number is a 555 reserved-for-fiction number so
 * it can never route to a real person, and nothing here claims a real customer,
 * a real booking, or a statistic.
 *
 * Under reduced motion the sequence doesn't run — the finished state is shown
 * with all three rows resolved.
 */

type Phase = "ringing" | "missed" | "replying" | "booked";

const REPLY =
  "Hi, sorry we missed you — we're on a job. What do you need done?";

// Phase durations in ms. The reply phase is longer because it types.
const TIMING: Record<Phase, number> = {
  ringing: 2600,
  missed: 1100,
  replying: 2600,
  booked: 2800,
};
const ORDER: Phase[] = ["ringing", "missed", "replying", "booked"];

export function CallDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "booked" : "ringing");
  const [typed, setTyped] = useState(reduce ? REPLY.length : 0);

  // Advance the scene. The typed reset happens in the timer callback, never in
  // the effect body — a synchronous setState there is a render-loop hazard and
  // the lint rule is right to reject it.
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => {
      const next = ORDER[(ORDER.indexOf(phase) + 1) % ORDER.length];
      if (next === "ringing") setTyped(0);
      setPhase(next);
    }, TIMING[phase]);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  // The reply types itself out.
  useEffect(() => {
    if (reduce || phase !== "replying") return;
    const perChar = Math.max(12, (TIMING.replying - 700) / REPLY.length);
    const id = setInterval(() => {
      setTyped((n) => Math.min(n + 1, REPLY.length));
    }, perChar);
    return () => clearInterval(id);
  }, [phase, reduce]);

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  const ringing = phase === "ringing";

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-[20px] backdrop-saturate-150">
      <div className="flex items-center justify-between px-3 pb-4 pt-2">
        <span className="text-overline uppercase text-muted-foreground">
          Placeholder — live
        </span>
        <motion.span
          aria-hidden="true"
          animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
          transition={
            reduce
              ? undefined
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          className="size-2 rounded-full bg-cta"
        />
      </div>

      {/* Announce the outcome once, not every keystroke. */}
      <p className="sr-only" aria-live="polite">
        {reached("booked")
          ? "Demonstration: a missed call was answered automatically and a booking was made."
          : ""}
      </p>

      <ul className="space-y-3" aria-hidden="true">
        {/* 1 — the call */}
        <li
          className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-[border-color,opacity] duration-300 ${
            ringing ? "border-cta/40" : "border-border opacity-70"
          }`}
        >
          <motion.span
            animate={
              reduce || !ringing ? { scale: 1 } : { scale: [1, 1.12, 1] }
            }
            transition={
              reduce || !ringing
                ? { duration: 0.2 }
                : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
            }
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ${
              ringing ? "bg-cta text-on-cta" : "bg-muted text-muted-foreground"
            }`}
          >
            {ringing ? (
              <Phone className="size-4" strokeWidth={1.75} />
            ) : (
              <PhoneMissed className="size-4" strokeWidth={1.75} />
            )}
          </motion.span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                {ringing ? "Incoming call" : "Missed call"}
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                2:14pm
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              {ringing
                ? "(402) 555-0147 — placeholder"
                : "Placeholder — rang out while you're on a job"}
            </span>
          </span>
        </li>

        {/* 2 — the reply, typing itself */}
        <motion.li
          initial={false}
          animate={{
            opacity: reached("replying") ? 1 : 0.25,
            y: reached("replying") ? 0 : 6,
          }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
          className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors duration-300 ${
            phase === "replying" ? "border-cta/40" : "border-border"
          }`}
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ${
              reached("replying")
                ? "bg-cta text-on-cta"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <MessageSquare className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                Text sent back
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                4 sec later
              </span>
            </span>
            <span className="mt-1 block min-h-[2.6em] text-small text-muted-foreground">
              {REPLY.slice(0, typed)}
              {phase === "replying" && typed < REPLY.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-cta"
                />
              )}
            </span>
          </span>
        </motion.li>

        {/* 3 — the booking */}
        <motion.li
          initial={false}
          animate={{
            opacity: reached("booked") ? 1 : 0.25,
            y: reached("booked") ? 0 : 6,
          }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
          className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors duration-300 ${
            phase === "booked" ? "border-cta/40" : "border-border"
          }`}
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ${
              reached("booked")
                ? "bg-cta text-on-cta"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <CalendarCheck className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                Booked
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                2:21pm
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              Placeholder — slot taken without you touching it
            </span>
          </span>
        </motion.li>
      </ul>
    </div>
  );
}
