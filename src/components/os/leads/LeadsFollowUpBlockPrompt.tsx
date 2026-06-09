"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  scheduleFutureLeadsFollowUpBlockAction,
  syncLeadsFollowUpBlockAction,
  type LeadsFollowUpBlockSnapshot,
} from "@/app/dashboard/leads/follow-up-calendar-actions";
import {
  DEFAULT_LEADS_FOLLOW_UP_START_TIME,
  LEADS_FOLLOW_UP_MINUTES_PER_LEAD,
  timeInputFromIso,
} from "@/lib/os/leads-follow-up-calendar";

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function formatBlockRange(
  block: LeadsFollowUpBlockSnapshot,
  timeZone: string,
  dayYmd: string
): string {
  if (!block) return "";
  const start = new Date(block.date_start).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
  const end = new Date(block.date_end).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
  return `${dayYmd} · ${start} – ${end}`;
}

export function LeadsFollowUpBlockPrompt({
  todayLeadCount,
  todayYmd,
  timeZone,
  brandColor,
  initialBlock,
}: {
  todayLeadCount: number;
  todayYmd: string;
  timeZone: string;
  brandColor: string;
  initialBlock: LeadsFollowUpBlockSnapshot;
}) {
  const [todayStartTime, setTodayStartTime] = useState(DEFAULT_LEADS_FOLLOW_UP_START_TIME);
  const [todayBlock, setTodayBlock] = useState(initialBlock);
  const [futureDate, setFutureDate] = useState(() => addDaysYmd(todayYmd, 1));
  const [futureStartTime, setFutureStartTime] = useState(DEFAULT_LEADS_FOLLOW_UP_START_TIME);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setTodayBlock(initialBlock);
    if (initialBlock?.date_start) {
      setTodayStartTime(timeInputFromIso(initialBlock.date_start, timeZone));
    }
  }, [initialBlock, timeZone]);

  const todayDurationMin = useMemo(
    () => todayLeadCount * LEADS_FOLLOW_UP_MINUTES_PER_LEAD,
    [todayLeadCount]
  );

  return (
    <div className="space-y-4">
      {todayLeadCount > 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Today&apos;s follow-up block</h2>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {todayLeadCount} lead{todayLeadCount === 1 ? "" : "s"} due today · {todayDurationMin} min (
                {LEADS_FOLLOW_UP_MINUTES_PER_LEAD} min each) · {timeZone}
              </p>
            </div>
            {todayBlock ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                On calendar
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Start time
              <input
                type="time"
                value={todayStartTime}
                onChange={(e) => setTodayStartTime(e.target.value)}
                className="mt-1 block rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
              />
            </label>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setErr(null);
                setMsg(null);
                startTransition(async () => {
                  const hadBlock = Boolean(todayBlock?.id);
                  const r = await syncLeadsFollowUpBlockAction({
                    startTime: todayStartTime,
                    dayYmd: todayYmd,
                  });
                  if (!r.ok) {
                    setErr(r.error);
                    return;
                  }
                  setTodayBlock(r.data ?? null);
                  setMsg(hadBlock ? "Today's block updated on your calendar." : "Added to your calendar.");
                });
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: brandColor }}
            >
              {pending ? "Saving…" : todayBlock ? "Update calendar block" : "Add to calendar"}
            </button>
          </div>

          {todayBlock ? (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {todayBlock.title} · {formatBlockRange(todayBlock, timeZone, todayYmd)}
            </p>
          ) : (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Set any start time, then add one <strong>Leads follow-up</strong> block for today.
            </p>
          )}
        </div>
      ) : null}

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Schedule future block</h2>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Pick a date and start time for leads scheduled on that day ({LEADS_FOLLOW_UP_MINUTES_PER_LEAD} min per lead).
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Date
            <input
              type="date"
              value={futureDate}
              min={todayYmd}
              onChange={(e) => setFutureDate(e.target.value)}
              className="mt-1 block rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Start time
            <input
              type="time"
              value={futureStartTime}
              onChange={(e) => setFutureStartTime(e.target.value)}
              className="mt-1 block rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
          </label>
          <button
            type="button"
            disabled={pending || !futureDate}
            onClick={() => {
              setErr(null);
              setMsg(null);
              startTransition(async () => {
                const r = await scheduleFutureLeadsFollowUpBlockAction({
                  dayYmd: futureDate,
                  startTime: futureStartTime,
                });
                if (!r.ok) {
                  setErr(r.error);
                  return;
                }
                if (r.data) {
                  setMsg(`Scheduled on calendar for ${formatBlockRange(r.data, timeZone, futureDate)}.`);
                } else {
                  setMsg("Scheduled on your calendar.");
                }
              });
            }}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-100"
          >
            {pending ? "Saving…" : "Schedule future block"}
          </button>
          <Link
            href="/dashboard/calendar"
            className="text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            Open calendar
          </Link>
        </div>
      </div>

      {msg ? <p className="text-xs text-emerald-700 dark:text-emerald-400">{msg}</p> : null}
      {err ? <p className="text-xs text-red-600">{err}</p> : null}
    </div>
  );
}
