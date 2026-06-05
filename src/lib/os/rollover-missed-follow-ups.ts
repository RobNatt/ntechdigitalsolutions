import type { SupabaseClient } from "@supabase/supabase-js";
import { isMissingSchemaError } from "@/lib/os/fetch-os-leads-list";
import {
  bumpedFollowUpToTomorrow,
  isMissedFollowUpToday,
  isTerminalLeadStage,
} from "@/lib/os/follow-up-schedule";

/**
 * Moves today's missed follow-ups to tomorrow (same local time) so they stay on the schedule.
 */
export async function rolloverMissedFollowUps(
  supabase: SupabaseClient,
  options?: { terminalStages?: string[] }
): Promise<{ rolled: number; error: string | null }> {
  const now = new Date();
  const terminal = new Set(
    (options?.terminalStages ?? ["Won", "Lost"]).map((s) => s.trim().toLowerCase())
  );

  const { data, error } = await supabase
    .from("os_leads")
    .select("id, status, next_follow_up_at")
    .not("next_follow_up_at", "is", null)
    .lt("next_follow_up_at", now.toISOString());

  if (error) {
    if (isMissingSchemaError(error.message)) {
      return { rolled: 0, error: null };
    }
    return { rolled: 0, error: error.message };
  }

  let rolled = 0;

  for (const row of data ?? []) {
    const status = String(row.status ?? "");
    if (terminal.has(status.trim().toLowerCase()) || isTerminalLeadStage(status)) continue;

    const nextAt = row.next_follow_up_at != null ? String(row.next_follow_up_at) : null;
    if (!nextAt || !isMissedFollowUpToday(nextAt, now)) continue;

    const bumped = bumpedFollowUpToTomorrow(new Date(nextAt), now).toISOString();
    const { error: updateError } = await supabase
      .from("os_leads")
      .update({ next_follow_up_at: bumped })
      .eq("id", String(row.id));

    if (!updateError) rolled += 1;
  }

  return { rolled, error: null };
}
