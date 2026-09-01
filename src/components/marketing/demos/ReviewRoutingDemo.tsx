"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Outcome = "public" | "private" | null;

/**
 * Self-contained on-site simulation of the review-routing flow — no real Google integration.
 * A visitor picks a star rating and sees the two branching outcomes the real system produces.
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
    setOutcome(null);
    setFeedback("");
    setFeedbackSent(false);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
        Try it — review routing
      </p>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        A real customer just finished a job with you. Tap the rating they&apos;d give and see where it
        goes.
      </p>

      <div className="mt-5 flex justify-center gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            onClick={() => pickRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            className="p-1"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                (hovered || rating) >= value
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-neutral-300 dark:text-neutral-600",
              )}
            />
          </button>
        ))}
      </div>

      {outcome === "public" ? (
        <div className="mt-6 rounded-xl border border-neutral-900 bg-neutral-50 p-5 text-center dark:border-white dark:bg-neutral-900/40">
          <ThumbsUp className="mx-auto h-6 w-6 text-neutral-900 dark:text-white" aria-hidden />
          <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
            Routed to post publicly on Google.
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
            5-star experiences get the customer a direct link to leave a public review — this is what
            builds your rating.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
          >
            Try another rating
          </button>
        </div>
      ) : null}

      {outcome === "private" ? (
        <div className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
          {!feedbackSent ? (
            <>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Caught privately — never posted publicly.
              </p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                Anything below 5 stars routes here instead of Google, so you can see it and respond
                first.
              </p>
              <label className="mt-3 block text-xs font-medium text-neutral-900 dark:text-white">
                What could we have done better?
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  rows={2}
                />
              </label>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackSent(true)}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                >
                  Send feedback privately
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                >
                  Try another rating
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Got it — thanks for the feedback.
              </p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                In the real system, this lands with the business owner instantly instead of going
                live on Google.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
              >
                Try another rating
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
