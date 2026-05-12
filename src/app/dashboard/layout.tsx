import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OsDashboardShell } from "@/components/os/OsDashboardShell";
import { getOsSession, getOsSettingsCached } from "@/lib/os/get-os-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getOsSettingsCached();
  return {
    title: `${settings.os_name} · Dashboard`,
    robots: { index: false, follow: false },
  };
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getOsSession();
  if (!session) {
    redirect("/");
  }

  const { settings, displayName, isInternal } = session;

  return (
    <OsDashboardShell
      osName={settings.os_name}
      brandColor={settings.brand_color}
      displayName={displayName}
      isInternal={isInternal}
      settings={settings}
    >
      {children}
    </OsDashboardShell>
  );
}
