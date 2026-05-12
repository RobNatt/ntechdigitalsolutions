"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { OsSettingsRow } from "@/lib/os/types";

type NavItem = {
  href: string;
  label: string;
  feature: "content_engine" | "analytics" | "sops" | null;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", feature: null },
  { href: "/dashboard/leads", label: "Leads", feature: null },
  { href: "/dashboard/projects", label: "Projects", feature: null },
  { href: "/dashboard/revenue", label: "Revenue", feature: null },
  { href: "/dashboard/calendar", label: "Calendar", feature: null },
  { href: "/dashboard/clients", label: "Clients", feature: null },
  { href: "/dashboard/content-engine", label: "Content Engine", feature: "content_engine" },
  { href: "/dashboard/analytics", label: "Analytics", feature: "analytics" },
  { href: "/dashboard/sops", label: "SOPs", feature: "sops" },
];

function isFeatureEnabled(settings: OsSettingsRow, feature: NavItem["feature"]): boolean {
  if (feature === null) return true;
  if (feature === "content_engine") return settings.enable_content_engine;
  if (feature === "analytics") return settings.enable_analytics;
  if (feature === "sops") return settings.enable_sops;
  return true;
}

type OsDashboardShellProps = {
  osName: string;
  brandColor: string;
  displayName: string;
  isInternal: boolean;
  settings: OsSettingsRow;
  children: React.ReactNode;
};

export function OsDashboardShell({
  osName,
  brandColor,
  displayName,
  isInternal,
  settings,
  children,
}: OsDashboardShellProps) {
  const pathname = usePathname();
  const visibleNav = NAV.filter((item) => isFeatureEnabled(settings, item.feature));

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:w-60">
        <div
          className="border-b border-neutral-200 px-4 py-5 dark:border-neutral-800"
          style={{ borderLeftWidth: 4, borderLeftColor: brandColor }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Workspace
          </p>
          <p className="mt-1 text-lg font-semibold leading-tight text-neutral-900 dark:text-white">{osName}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="App">
          {visibleNav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                )}
                style={
                  active
                    ? { backgroundColor: brandColor }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
          {isInternal ? (
            <Link
              href="/dashboard/settings"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname.startsWith("/dashboard/settings")
                  ? "text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
              style={
                pathname.startsWith("/dashboard/settings")
                  ? { backgroundColor: brandColor }
                  : undefined
              }
            >
              Settings
            </Link>
          ) : null}
        </nav>
        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <p className="truncate px-1 text-xs text-neutral-500 dark:text-neutral-400">{displayName}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
