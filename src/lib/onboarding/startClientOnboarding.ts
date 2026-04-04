import { createAdminClient } from "@/lib/supabase/admin";

export type OnboardingTriggerResult = {
  status: "queued";
  clientId: string;
};

/**
 * Marks the client for onboarding and logs a hook point. Replace or extend this
 * with email workflows, tasks, webhooks, etc.
 */
export async function startClientOnboarding(
  clientId: string,
  ctx: { leadId: string }
): Promise<OnboardingTriggerResult> {
  const admin = createAdminClient();
  const { data: row, error: fetchErr } = await admin
    .from("clients")
    .select("id, details")
    .eq("id", clientId)
    .maybeSingle();

  if (fetchErr || !row) {
    throw new Error("Client not found for onboarding");
  }

  const prev =
    row.details && typeof row.details === "object" && !Array.isArray(row.details)
      ? { ...(row.details as Record<string, unknown>) }
      : {};

  const priorOnboarding = prev.onboarding;
  let runCount = 1;
  if (
    priorOnboarding &&
    typeof priorOnboarding === "object" &&
    !Array.isArray(priorOnboarding) &&
    typeof (priorOnboarding as { runs?: unknown }).runs === "number"
  ) {
    runCount = (priorOnboarding as { runs: number }).runs + 1;
  }

  const onboarding = {
    status: "queued" as const,
    triggeredAt: new Date().toISOString(),
    sourceLeadId: ctx.leadId,
    sequenceVersion: 1,
    runs: runCount,
  };

  const { error } = await admin
    .from("clients")
    .update({
      details: { ...prev, onboarding },
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (error) {
    throw error;
  }

  console.info("[onboarding] queued", { clientId, leadId: ctx.leadId });

  return { status: "queued", clientId };
}
