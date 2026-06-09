"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  syncLeadsFollowUpBlockAction,
  type LeadsFollowUpBlockSnapshot,
} from "@/app/dashboard/leads/follow-up-calendar-actions";
import {
  LEADS_FOLLOW_UP_MINUTES_PER_LEAD,
  LEADS_FOLLOW_UP_PERIOD_START,
  type LeadsFollowUpPeriod,
} from "@/lib/os/leads-follow-up-calendar";

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
  const [period, setPeriod] = useState<LeadsFollowUpPeriod>("morning");
  const [block, setBlock] = useState(initialBlock);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const durationMin = useMemo(() => todayLeadCount * LEADS_FOLLOW_UP_MINUTES_PER_LEAD, [todayLeadCount]);

  if (todayLeadCount <= 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Leads follow-up block</h2>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            {todayLeadCount} lead{todayLeadCount === 1 ? "" : "s"} due today · {durationMin} min total (
            {LEADS_FOLLOW_UP_MINUTES_PER_LEAD} min each) · {timeZone}
          </p>
        </div>
        {block ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            On calendar
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Time period
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as LeadsFollowUpPeriod)}
            className="mt-1 block min-w-[12rem] rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
          >
            {(Object.keys(LEADS_FOLLOW_UP_PERIOD_START) as LeadsFollowUpPeriod[]).map((key) => (
              <option key={key} value={key}>
                {LEADS_FOLLOW_UP_PERIOD_START[key].label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setErr(null);
            setMsg(null);
            startTransition(async () => {
              const hadBlock = Boolean(block?.id);
              const r = await syncLeadsFollowUpBlockAction({ period, dayYmd: todayYmd });
              if (!r.ok) {
                setErr(r.error);
                return;
              }
              setBlock(r.data ?? null);
              setMsg(hadBlock ? "Calendar block updated." : "Added to your calendar.");
            });
          }}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: brandColor }}
        >
          {pending ? "Saving…" : block ? "Update calendar block" : "Add to calendar"}
        </button>
        <Link
          href="/dashboard/calendar"
          className="text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          Open calendar
        </Link>
      </div>

      {block ? (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {block.title} ·{" "}
          {new Date(block.date_start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZone })}{" "}
          – {new Date(block.date_end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZone })}
        </p>
      ) : (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Choose a time period and add one <strong>Leads follow-up</strong> block — no per-lead times needed.
        </p>
      )}
      {msg ? <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{msg}</p> : null}
      {err ? <p className="mt-2 text-xs text-red-600">{err}</p> : null}
    </div>
  );
}
