import type { SupabaseClient } from "@supabase/supabase-js";
import { isMissingSchemaError } from "@/lib/os/fetch-os-leads-list";
import {
  bumpedFollowUpToTomorrow,
  isFollowUpIncomplete,
  isTerminalLeadStage,
  todayDefaultFollowUpAt,
} from "@/lib/os/follow-up-schedule";

export type MaintainFollowUpScheduleResult = {
  autoScheduled: number;
  rolled: number;
  error: string | null;
};

/**
 * Keeps the 3-day follow-up schedule actionable:
 * 1. Leads with no follow-up date → schedule for today (9am org TZ, or now).
 * 2. Incomplete overdue follow-ups → bump to tomorrow so they stay visible.
 */
export async function maintainFollowUpSchedule(
  supabase: SupabaseClient,
  options?: { terminalStages?: string[]; timeZone?: string }
): Promise<MaintainFollowUpScheduleResult> {
  const now = new Date();
  const timeZone = options?.timeZone?.trim() || "UTC";
  const terminal = new Set(
    (options?.terminalStages ?? ["Won", "Lost"]).map((s) => s.trim().toLowerCase())
  );

  let autoScheduled = 0;
  let rolled = 0;

  const { data: unscheduled, error: unschedErr } = await supabase
    .from("os_leads")
    .select("id, status")
    .is("next_follow_up_at", null);

  if (unschedErr) {
    if (isMissingSchemaError(unschedErr.message)) {
      return { autoScheduled: 0, rolled: 0, error: null };
    }
    return { autoScheduled: 0, rolled: 0, error: unschedErr.message };
  }

  const dueToday = todayDefaultFollowUpAt(timeZone, now).toISOString();

  for (const row of unscheduled ?? []) {
    const status = String(row.status ?? "");
    if (terminal.has(status.trim().toLowerCase()) || isTerminalLeadStage(status)) continue;

    const { error: updateError } = await supabase
      .from("os_leads")
      .update({ next_follow_up_at: dueToday })
      .eq("id", String(row.id));

    if (!updateError) autoScheduled += 1;
  }

  const { data: overdue, error: overdueErr } = await supabase
    .from("os_leads")
    .select("id, status, next_follow_up_at, last_touch_at")
    .not("next_follow_up_at", "is", null)
    .lt("next_follow_up_at", now.toISOString());

  if (overdueErr) {
    if (isMissingSchemaError(overdueErr.message)) {
      return { autoScheduled, rolled, error: null };
    }
    return { autoScheduled, rolled, error: overdueErr.message };
  }

  for (const row of overdue ?? []) {
    const status = String(row.status ?? "");
    if (terminal.has(status.trim().toLowerCase()) || isTerminalLeadStage(status)) continue;

    const nextAt = row.next_follow_up_at != null ? String(row.next_follow_up_at) : null;
    const lastTouch = row.last_touch_at != null ? String(row.last_touch_at) : null;
    if (!nextAt || !isFollowUpIncomplete(nextAt, lastTouch, now)) continue;

    const bumped = bumpedFollowUpToTomorrow(new Date(nextAt), timeZone, now).toISOString();
    const { error: updateError } = await supabase
      .from("os_leads")
      .update({ next_follow_up_at: bumped })
      .eq("id", String(row.id));

    if (!updateError) rolled += 1;
  }

  return { autoScheduled, rolled, error: null };
}

/** @deprecated Use maintainFollowUpSchedule */
export async function rolloverMissedFollowUps(
  supabase: SupabaseClient,
  options?: { terminalStages?: string[]; timeZone?: string }
): Promise<{ rolled: number; error: string | null }> {
  const r = await maintainFollowUpSchedule(supabase, options);
  return { rolled: r.rolled, error: r.error };
}
