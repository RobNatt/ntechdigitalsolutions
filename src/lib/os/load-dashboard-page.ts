import { redirect } from "next/navigation";
import { getOsSession } from "@/lib/os/get-os-settings";

export async function loadDashboardPage() {
  const session = await getOsSession();
  if (!session) redirect("/");
  return session;
}
