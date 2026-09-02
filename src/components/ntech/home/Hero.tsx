"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ActivityLog,
  ActivityRow,
  ChannelChip,
  ctaPrimary,
  type ActivityRowProps,
} from "@/components/ntech/primitives";
import { ReceptionistDemoCta } from "@/components/ntech/ReceptionistDemoCta";
import { usePrefersReducedMotion } from "@/components/ntech/use-prefers-reduced-motion";

/**
 * The hero's claim and its evidence are the same object: a call arriving at
 * 7:42 on a Friday and reaching a booked appointment while you watch.
 */
const SEQUENCE: ActivityRowProps[] = [
  { stamp: "7:42 PM", channel: "call", action: "Incoming call", outcome: "No answer" },
  { stamp: "7:42 PM", channel: "call", action: "AI receptionist picks up", outcome: "Answered" },
  { stamp: "7:43 PM", channel: "crm", action: "Caller details captured", outcome: "Saved to CRM" },
  { stamp: "7:44 PM", channel: "calendar", action: "Appointment offered and taken", outcome: "Booked Tue 9:00 AM" },
];

const STEP_MS = 1400;

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(1);

  /* Reduced motion gets the finished log, not an animated one. */
  const visible = reducedMotion ? SEQUENCE.length : revealed;

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setRevealed((n) => (n >= SEQUENCE.length ? n : n + 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section className="bg-field">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <ChannelChip tone="current">Fri 7:42 PM · Omaha</ChannelChip>

        <h1 className="type-display mt-6 max-w-3xl text-[2.75rem] text-ink sm:text-[3.5rem] lg:text-[4.25rem]">
          Your phone rang at 7:42 on a Friday.{" "}
          <span className="text-muted-ink">Nobody picked up.</span>
        </h1>

        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-ink">
          N-Tech installs five connected systems for local service businesses in the Omaha metro and
          Lincoln — a website, an AI receptionist, lead-form automation, social media management, and
          Google review automation — so the call above ends the way the log below does.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/infrastructure"
            aria-label="Learn More about the five connected systems"
            className={ctaPrimary}
          >
            Learn More
          </Link>
          <ReceptionistDemoCta />
        </div>

        <ActivityLog
          label="What happens to a missed call once the system is installed"
          live
          className="mt-12"
        >
          {SEQUENCE.slice(0, visible).map((row, i) => (
            <ActivityRow
              key={row.action}
              {...row}
              state={i === 0 ? "failed" : "done"}
              index={i}
              animate={!reducedMotion}
            />
          ))}
        </ActivityLog>

        <p className="type-data mt-4 text-[0.75rem] text-muted-ink">
          Two minutes, start to finish. No one at the business touched a thing.
        </p>
      </div>
    </section>
  );
}
