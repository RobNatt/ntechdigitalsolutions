"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ntech/use-prefers-reduced-motion";
import Link from "next/link";
import { Bot, Globe2, MessageSquareText, Share2, Star } from "lucide-react";
import {
  ChannelChip,
  CurrentNode,
  ctaPrimary,
  Section,
  SectionHeading,
} from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

/**
 * The borrowed mechanic: a current travelling block to block, so the system is
 * mid-execution while you read rather than diagrammed.
 *
 * Gimmick test, re-derived for N-Tech: this buyer's blocker is "does it run
 * when nobody's watching?" and the company has no case studies to answer with.
 * Watching the current complete is the only proof available. It is the
 * substitute for the testimonial, not decoration.
 *
 * Advanced on intersection at a fixed rate — NOT scroll-scrubbed. Scrubbing
 * ties the motion to thumb speed and reads as a toy; this completes whether the
 * visitor stops or keeps going.
 *
 * Copy is lifted from /infrastructure so no new claim is introduced here.
 */
const STAGES = [
  {
    id: "website",
    icon: Globe2,
    channel: "Website",
    name: "Someone lands on the site",
    output: "Lead form + Call Now on every page",
  },
  {
    id: "ai-receptionist",
    icon: Bot,
    channel: "Call",
    name: "They call instead of typing",
    output: "AI receptionist answers, books, logs",
  },
  {
    id: "lead-automation",
    icon: MessageSquareText,
    channel: "CRM",
    name: "Or they submit the form",
    output: "Instant CRM entry + SMS/email confirm",
  },
  {
    id: "social-media",
    icon: Share2,
    channel: "Social",
    name: "Someone comments on a post",
    output: "Automated outreach into the same pipeline",
  },
  {
    id: "review-automation",
    icon: Star,
    channel: "Review",
    name: "The job gets finished",
    output: "5-star routed public, the rest routed private",
  },
] as const;

const ADVANCE_MS = 1150;

export function Circuit() {
  const reducedMotion = usePrefersReducedMotion();
  const [advanced, setAdvanced] = useState(-1);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  /* Reduced motion gets the completed circuit immediately. */
  const active = reducedMotion ? STAGES.length - 1 : advanced;

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        setAdvanced(0);
        interval = setInterval(() => {
          setAdvanced((n) => (n >= STAGES.length - 1 ? n : n + 1));
        }, ADVANCE_MS);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [reducedMotion]);

  return (
    <Section index="03" eyebrow="The whole loop" className="bg-field-sunken" width="max-w-6xl">
      <SectionHeading>
        Five systems, one current.
        <span className="text-muted-ink"> Each one hands off to the next.</span>
      </SectionHeading>

      <div ref={ref} className="mt-10 grid gap-3 lg:grid-cols-5">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const reached = i <= active;
          return (
            <div key={stage.id} className="relative">
              {/* Connector: the current crossing from the previous block. */}
              {i > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -top-3 left-6 h-3 w-px lg:left-[-0.75rem] lg:top-1/2 lg:h-px lg:w-3",
                    reached ? "bg-live" : "bg-rule-strong"
                  )}
                />
              ) : null}

              <div
                className={cn(
                  "h-full rounded-xl border bg-white p-5 transition-colors duration-500",
                  reached ? "border-live/50" : "border-rule"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <ChannelChip tone={reached ? "current" : "muted"}>{stage.channel}</ChannelChip>
                  <CurrentNode state={reached ? "done" : "pending"} />
                </div>

                <Icon
                  className={cn(
                    "mt-5 h-5 w-5 transition-colors duration-500",
                    reached ? "text-ink" : "text-muted-ink"
                  )}
                  aria-hidden
                />

                <p className="type-heading mt-3 text-[1rem] text-ink">{stage.name}</p>

                {/* Pending state is carried by the node, border and chip — not by
                    dimming the text, which drops it below AA before the current
                    arrives (and Lighthouse reads the page in exactly that state). */}
                <p
                  className={cn(
                    "type-data mt-3 text-[0.75rem] leading-relaxed transition-colors duration-500",
                    reached ? "text-ink" : "text-muted-ink"
                  )}
                >
                  {stage.output}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="type-data mt-6 text-[0.75rem] text-muted-ink">
        A missed call becomes a booked appointment. A comment becomes a lead. A finished job becomes a
        public review.
      </p>

      <div className="mt-8">
        <Link
          href="/infrastructure"
          aria-label="Learn More about how each system hands off to the next"
          className={ctaPrimary}
        >
          Learn More
        </Link>
      </div>
    </Section>
  );
}
