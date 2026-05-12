import type { createClient } from "@/lib/supabase/server";

export type OsActivityEntityType =
  | "os_lead"
  | "os_client"
  | "os_project"
  | "os_payment"
  | "os_event"
  | "os_settings";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function logOsActivity(
  supabase: Supabase,
  entityType: OsActivityEntityType,
  entityId: string,
  action: string,
  message: string
): Promise<void> {
  const { error } = await supabase.from("os_activity_log").insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    message,
  });
  if (error) {
    console.warn("logOsActivity:", error.message);
  }
}
