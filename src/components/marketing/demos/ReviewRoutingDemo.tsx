"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ActivityLog, ActivityRow, ctaPrimary } from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

type Outcome = "public" | "private" | null;

/**
 * On-site simulation of the review-routing branch — no real Google integration.
 * The visitor picks a rating and sees which row the system writes.
 *
 * The rating control is a button group with aria-pressed rather than a
 * role="radiogroup": a radiogroup requires roving tabindex to be keyboard-usable,
 * and buttons are reachable in tab order without it.
 */
export function ReviewRoutingDemo() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  function pickRating(value: number) {
    setRating(value);
    setOutcome(value === 5 ? "public" : "private");
    setFeedbackSent(false);
    setFeedback("");
  }

  function reset() {
    setRating(0);
    setHovered(0);
    setOutcome(null);
    setFeedback("");
    setFeedbackSent(false);
  }

  const resetClass =
    "type-data text-[0.75rem] text-ink underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

  return (
    <div className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
      <p className="type-data text-[0.75rem] uppercase text-muted-ink">Try it — review routing</p>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink">
        A customer just finished a job with you. Tap the rating they&apos;d give and see which row
        the system writes.
      </p>

      <div className="mt-6 flex justify-center gap-1" role="group" aria-label="Pick a star rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            onClick={() => pickRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(value)}
            onBlur={() => setHovered(0)}
            className="flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                (hovered || rating) >= value
                  ? "fill-[#E8A317] text-[#E8A317]"
                  : "fill-transparent text-muted-ink"
              )}
              aria-hidden
            />
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {outcome === "public" ? (
          <div className="mt-6">
            <ActivityLog label="Review routing result">
              <ActivityRow
                stamp="5:30 PM"
                channel="review"
                action="5-star experience"
                outcome="Routed public on Google"
                state="done"
              />
            </ActivityLog>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-ink">
              A 5-star customer gets a direct link to post publicly. That is the half of your
              feedback that builds the rating.
            </p>
            <button type="button" onClick={reset} className={cn(resetClass, "mt-4")}>
              Try another rating
            </button>
          </div>
        ) : null}

        {outcome === "private" ? (
          <div className="mt-6">
            <ActivityLog label="Review routing result">
              <ActivityRow
                stamp="5:41 PM"
                channel="review"
                action={`${rating}-star experience intercepted`}
                outcome="Private feedback — not posted"
                state="done"
              />
            </ActivityLog>

            {!feedbackSent ? (
              <>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-ink">
                  Anything below 5 stars routes here instead of Google, so you see it and can
                  respond before it becomes public.
                </p>
                <label
                  className="mt-5 block text-[0.875rem] font-medium text-ink"
                  htmlFor="review-demo-feedback"
                >
                  What could we have done better?
                </label>
                <textarea
                  id="review-demo-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                  className="mt-1.5 w-full resize-y rounded-lg border border-rule-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action"
                />
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFeedbackSent(true)}
                    className={cn(ctaPrimary, "px-4 py-2.5 text-[0.875rem]")}
                  >
                    Send feedback privately
                  </button>
                  <button type="button" onClick={reset} className={resetClass}>
                    Try another rating
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-ink">
                  Got it. In the real system this lands with the business owner immediately, and
                  never reaches Google.
                </p>
                <button type="button" onClick={reset} className={cn(resetClass, "mt-4")}>
                  Try another rating
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
