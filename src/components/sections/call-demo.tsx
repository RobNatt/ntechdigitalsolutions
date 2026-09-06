"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquare, Phone, PhoneIncoming } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/*
 * The hero artifact — the product actually working, on a loop.
 *
 * It plays a scene: a call comes in, Stuart picks it up, he books the job.
 *
 * IT MUST NEVER SHOW A MISSED CALL. This panel is labelled as the receptionist
 * working — a missed call here contradicts the entire product. The missed call,
 * the text sent 45 minutes too late, the job that went to whoever answered
 * first: that is the PAIN, and it belongs in the problem chapter, not in the
 * shot that proves the thing works.
 *
 * Everything is placeholder. The number is a 555 reserved-for-fiction number so
 * it can never route to a real person, and nothing here claims a real customer,
 * a real booking, or a statistic.
 *
 * Under reduced motion the sequence doesn't run — the finished state is shown
 * with all three rows resolved.
 */

type Phase = "ringing" | "answering" | "booked";

// What Stuart says when he picks up. COPY PLACEHOLDER — needs Rob's pass.
const REPLY =
  "Thanks for calling — I can get you booked in. What do you need done?";

// Phase durations in ms. The reply phase is longer because it types.
const TIMING: Record<Phase, number> = {
  ringing: 1800,
  answering: 3200,
  booked: 3000,
};
const ORDER: Phase[] = ["ringing", "answering", "booked"];

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
    if (reduce || phase !== "answering") return;
    const perChar = Math.max(12, (TIMING.answering - 900) / REPLY.length);
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
          AI Receptionist — Live
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
          ? "Demonstration: an incoming call was answered automatically and a booking was made."
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
              <PhoneIncoming className="size-4" strokeWidth={1.75} />
            )}
          </motion.span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                {ringing ? "Incoming call" : "Answered"}
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                10:42am
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              {ringing ? "(402) 555-0147" : "Picked up on the second ring"}
            </span>
          </span>
        </li>

        {/* 2 — the reply, typing itself */}
        <motion.li
          initial={false}
          animate={{
            opacity: reached("answering") ? 1 : 0.25,
            y: reached("answering") ? 0 : 6,
          }}
          transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
          className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors duration-300 ${
            phase === "answering" ? "border-cta/40" : "border-border"
          }`}
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ${
              reached("answering")
                ? "bg-cta text-on-cta"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <MessageSquare className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-body font-medium text-card-foreground">
                Stuart takes it
              </span>
              <span className="shrink-0 text-small text-muted-foreground">
                live
              </span>
            </span>
            <span className="mt-1 block min-h-[2.6em] text-small text-muted-foreground">
              {REPLY.slice(0, typed)}
              {phase === "answering" && typed < REPLY.length && (
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
                10:44am
              </span>
            </span>
            <span className="mt-1 block text-small text-muted-foreground">
              Tuesday 9:00am — on the calendar before the call ends
            </span>
          </span>
        </motion.li>
      </ul>
    </div>
  );
}
