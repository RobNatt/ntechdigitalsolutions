import { redirect } from "next/navigation";
import type { OsSettingsRow } from "@/lib/os/types";

export type OsFeaturePage = "content-engine" | "analytics" | "sops";

export function requireOsFeaturePage(page: OsFeaturePage, settings: OsSettingsRow): void {
  if (page === "content-engine" && !settings.enable_content_engine) redirect("/dashboard");
  if (page === "analytics" && !settings.enable_analytics) redirect("/dashboard");
  if (page === "sops" && !settings.enable_sops) redirect("/dashboard");
}

export function requireOsInternal(session: { isInternal: boolean }): void {
  if (!session.isInternal) redirect("/dashboard");
}
