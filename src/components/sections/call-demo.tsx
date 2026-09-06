"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquare, PhoneMissed } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/*
 * The hero artifact — two beats, on a loop.
 *
 * Beat one is the miss, and it is the OWNER'S miss: the call that rang out
 * while they were with someone else. That has to stay in — a system catching a
 * call nobody missed isn't a story, and the miss is the part that's relatable.
 *
 * Beat two is the catch, and it belongs to the system.
 *
 * The panel label changes between them, and that is what keeps it honest. The
 * panel is never labelled as the receptionist while showing a missed call: it
 * says "the call you missed", then it says the receptionist caught it.
 *
 * The number is a 555 reserved-for-fiction number and can never route to a real
 * person. Nothing here claims a real customer, booking or statistic.
 */

type Phase = "missed" | "replying" | "booked";

const REPLY =
  "Hi, sorry we missed you — we're with someone right now. What can we help you with?";

const TIMING: Record<Phase, number> = {
  missed: 2400,
  replying: 3400,
  booked: 3200,
};
const ORDER: Phase[] = ["missed", "replying", "booked"];

export function CallDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "booked" : "missed");
  const [typed, setTyped] = useState(reduce ? REPLY.length : 0);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => {
      const next = ORDER[(ORDER.indexOf(phase) + 1) % ORDER.length];
      if (next === "missed") setTyped(0);
      setPhase(next);
    }, TIMING[phase]);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  useEffect(() => {
    if (reduce || phase !== "replying") return;
    const perChar = Math.max(10, (TIMING.replying - 900) / REPLY.length);
    const id = setInterval(() => {
      setTyped((n) => Math.min(n + 1, REPLY.length));
    }, perChar);
    return () => clearInterval(id);
  }, [phase, reduce]);

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  const caught = phase !== "missed";

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-[20px] backdrop-saturate-150">
      <div className="flex items-center justify-between gap-4 px-3 pb-4 pt-2">
        {/* The label is where the honesty lives. Beat one owns the miss; beat
            two hands it to the system. It must never say "receptionist" over a
            missed call. */}
        <span className="text-overline uppercase text-muted-foreground">
          {caught
            ? "Your AI receptionist, catching it live"
            : "The call you missed"}
        </span>
        <motion.span
          aria-hidden="true"
          animate={
            reduce || !caught ? { opacity: 0.35 } : { opacity: [1, 0.3, 1] }
          }
          transition={
            reduce || !caught
              ? { duration: 0.4 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          className="size-2 shrink-0 rounded-full bg-cta"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {reached("booked")
          ? "Demonstration: a missed call was answered automatically and a booking was made."
          : ""}
      </p>

      <ul className="space-y-3" aria-hidden="true">
        {/* Beat one — the miss. Yours. */}
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
                10:42am
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              (402) 555-0147 — rang out while you were with someone else
            </span>
          </span>
        </li>

        {/* Beat two — the catch. The system's. */}
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
                Answered automatically
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                moments later
              </span>
            </span>
            <span className="mt-1 block min-h-[3.4em] text-small text-muted-foreground">
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

        {/* The outcome. */}
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
                10:44am
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              On the calendar before you&apos;d even seen the missed-call
              notification
            </span>
          </span>
        </motion.li>
      </ul>
    </div>
  );
}
