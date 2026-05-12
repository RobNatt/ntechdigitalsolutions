import type { OsSession } from "@/lib/os/get-os-settings";

/** Workspace Settings user-admin (profiles, bulk lead assign). Not for portal clients. */
export function isOsWorkspaceAdmin(session: OsSession | null): boolean {
  if (!session?.isInternal) return false;
  if (session.profile?.os_role === "admin") return true;
  const r = session.profile?.role;
  return r === "ceo" || r === "admin" || r === "developer";
}
