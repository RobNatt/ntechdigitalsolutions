"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";

export type UpdateOsSettingsState = { ok?: boolean; error?: string };

export async function updateOsSettingsAction(
  _prev: UpdateOsSettingsState,
  formData: FormData
): Promise<UpdateOsSettingsState> {
  const session = await getOsSession();
  if (!session?.userId) return { error: "Not signed in." };
  if (!session.isInternal) return { error: "Only administrators can change settings." };

  const os_name = String(formData.get("os_name") ?? "").trim() || "Operating System";
  const brand_color = String(formData.get("brand_color") ?? "").trim() || "#2563eb";
  const currency = String(formData.get("currency") ?? "").trim().toUpperCase() || "AUD";
  const timezone = String(formData.get("timezone") ?? "").trim() || "Australia/Sydney";
  const enable_content_engine = formData.get("enable_content_engine") === "on";
  const enable_analytics = formData.get("enable_analytics") === "on";
  const enable_sops = formData.get("enable_sops") === "on";
  const uncontacted_stage = String(formData.get("uncontacted_stage") ?? "").trim() || "New";

  const supabase = await createClient();
  const { error } = await supabase
    .from("os_settings")
    .update({
      os_name,
      brand_color,
      currency,
      timezone,
      enable_content_engine,
      enable_analytics,
      enable_sops,
      uncontacted_stage,
    })
    .eq("id", session.settings.id);

  if (error) {
    console.error("updateOsSettingsAction:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");
  return { ok: true };
}
