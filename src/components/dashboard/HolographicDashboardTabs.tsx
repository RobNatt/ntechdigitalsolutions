"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LineChart,
  BarChart2,
  Sparkles,
  UserCog,
  Inbox,
  DollarSign,
  Building2,
  CalendarDays,
  LogOut,
  Database,
  Bot,
  FileText,
  NotebookPen,
} from "lucide-react";
import { DashboardAssistantPanel } from "@/components/dashboard/DashboardAssistantPanel";
import { CeoCalendarSection } from "@/components/dashboard/CeoCalendarSection";
import { CeoClientsSection } from "@/components/dashboard/CeoClientsSection";
import { CeoLeadsSection } from "@/components/dashboard/CeoLeadsSection";
import { CeoSupabaseSection } from "@/components/dashboard/CeoSupabaseSection";
import { CeoAnalyticsSection } from "@/components/dashboard/CeoAnalyticsSection";
import { CeoSupportInboxSection } from "@/components/dashboard/CeoSupportInboxSection";
import { CeoRevenueReportsSection } from "@/components/dashboard/CeoRevenueReportsSection";
import { CeoBlogPostsSection } from "@/components/dashboard/CeoBlogPostsSection";
import { CeoBusinessNotesSection } from "@/components/dashboard/CeoBusinessNotesSection";

const MARKETING_NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "funnels", label: "Funnels", icon: BarChart2 },
  { id: "ai-agents", label: "AI Agents", icon: Sparkles },
] as const;

/** CEO / executive dashboard — sections to be built out. */
const CEO_NAV_TABS = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "assistant", label: "Assistant", icon: Bot },
  { id: "supabase", label: "Supabase", icon: Database },
  { id: "user-management", label: "User management", icon: UserCog },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "leads", label: "Leads", icon: Users },
  { id: "support-inbox", label: "Support inbox", icon: Inbox },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "blog-posts", label: "Blog posts", icon: FileText },
  { id: "business-notes", label: "Business notes", icon: NotebookPen },
  { id: "revenue-reports", label: "Revenue reports", icon: DollarSign },
] as const;

const KPI_CARDS = [
  {
    title: "Conversion rate",
    value: "18.3%",
    delta: "↑ 6.1% vs last month",
    deltaPositive: true,
  },
  {
    title: "Revenue tracked",
    value: "$24,810",
    delta: "↑ 31% vs last month",
    deltaPositive: true,
  },
] as const;

function PlaceholderTab({ label, variant }: { label: string; variant?: "ceo" }) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-lg font-semibold text-gray-800">{label}</p>
      <p className="max-w-sm text-sm text-gray-600">
        {variant === "ceo"
          ? "We'll build this out next — placeholder for now."
          : "Content for this section will live here."}
      </p>
    </div>
  );
}

function BrowserChrome() {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-b border-gray-400/35 bg-gradient-to-b from-gray-200/95 to-gray-300/80 px-3">
      <div className="flex gap-1.5 pl-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff8a7a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8c76a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#7dd87d]" />
      </div>
      <div className="ml-1 flex min-w-0 flex-1 items-center rounded-md border border-gray-400/40 bg-white/85 px-3 py-1 font-mono text-[11px] text-gray-600 shadow-sm">
        <span className="truncate">app.ntech.io/dashboard</span>
      </div>
    </div>
  );
}

function NTechMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/40 bg-gradient-to-br from-sky-100/90 to-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        className
      )}
    >
      <span className="bg-gradient-to-br from-sky-700 to-slate-700 bg-clip-text text-lg font-black leading-none text-transparent">
        N
      </span>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {KPI_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-400/40 bg-gray-300/25 p-4 shadow-inner backdrop-blur-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-3xl">
              {card.value}
            </p>
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                card.deltaPositive ? "text-emerald-700" : "text-red-700"
              )}
            >
              {card.delta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

type HolographicDashboardTabsProps = {
  className?: string;
  /** `ceo` = executive dashboard at `/dashboard`; default keeps marketing hero demo. */
  variant?: "marketing" | "ceo";
};

export function HolographicDashboardTabs({
  className,
  variant = "marketing",
}: HolographicDashboardTabsProps) {
  const router = useRouter();
  const navTabs = variant === "ceo" ? CEO_NAV_TABS : MARKETING_NAV_TABS;
  const [activeTab, setActiveTab] = useState<string>(
    variant === "ceo" ? "assistant" : "dashboard"
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const headerTitle = variant === "ceo" ? "CEO Dashboard" : "Operations dashboard";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {
      /* still leave session client-side best-effort */
    } finally {
      router.push("/login");
      router.refresh();
      setLoggingOut(false);
    }
  }
  const sidebarWidthClass = variant === "ceo" ? "w-[228px]" : "w-[200px]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative h-[min(90vh,880px)] w-full max-w-7xl",
        className
      )}
    >
      {/* Holographic shell — match HolographicDashboard.tsx */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 border-gray-400/50 bg-gradient-to-br from-gray-300/60 via-gray-200/60 to-gray-300/60 shadow-[0_0_60px_rgba(150,150,150,0.4)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-400/5 to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-gray-500" />
        <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-gray-500" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 border-b-2 border-l-2 border-gray-500" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-gray-500" />

        {[
          [4, 4],
          [4, -4],
          [-4, 4],
          [-4, -4],
        ].map(([x, y], i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-gray-600"
            style={{
              [x > 0 ? "left" : "right"]: Math.abs(x),
              [y > 0 ? "top" : "bottom"]: Math.abs(y),
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
          />
        ))}

        <div className="relative z-10 flex min-h-0 flex-1 flex-col p-1.5 sm:p-2">
          {/* Light app surface inside holographic frame */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-400/45 bg-neutral-100/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <BrowserChrome />

            <div className="flex min-h-0 flex-1">
              <aside
                className={cn(
                  "flex shrink-0 flex-col border-r border-gray-400/35 bg-gradient-to-b from-gray-200/90 to-gray-300/70 py-4 pl-3 pr-2",
                  sidebarWidthClass
                )}
              >
                <div className="mb-6 flex items-center gap-2.5 px-1">
                  <NTechMark />
                  <span className="text-sm font-bold tracking-tight text-gray-800">
                    N-Tech
                  </span>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Dashboard">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
                          isActive
                            ? "border border-gray-500 bg-gray-400/25 text-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                            : "border border-transparent text-gray-600 hover:bg-gray-400/15 hover:text-gray-800"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="holoDashSidebarActive"
                            className="absolute inset-0 bg-gradient-to-r from-gray-400/30 to-gray-500/20"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.5,
                            }}
                          />
                        )}
                        <Icon className="relative z-10 h-4 w-4 shrink-0 text-gray-700" />
                        <span className="relative z-10">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </aside>

              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-50/90">
                <header className="relative z-[1] flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-400/30 bg-neutral-100/80 px-4 py-3 md:px-5 md:py-4">
                  <h1 className="text-base font-bold tracking-tight text-gray-800 md:text-lg">
                    {headerTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {variant === "ceo" ? (
                      <button
                        type="button"
                        disabled={loggingOut}
                        onClick={() => void handleLogout()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-400/55 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 shadow-sm hover:bg-gray-100/90 disabled:opacity-50"
                      >
                        <LogOut className="h-3.5 w-3.5" aria-hidden />
                        {loggingOut ? "Signing out…" : "Log out"}
                      </button>
                    ) : null}
                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-100/80 px-2.5 py-1 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-35" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                        Live
                      </span>
                    </div>
                  </div>
                </header>

                <div className="relative z-[1] min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 md:p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {variant === "marketing" && activeTab === "dashboard" && (
                        <DashboardOverview />
                      )}
                      {variant === "marketing" && activeTab === "analytics" && (
                        <PlaceholderTab label="Analytics" />
                      )}
                      {variant === "marketing" && activeTab === "funnels" && (
                        <PlaceholderTab label="Funnels" />
                      )}
                      {variant === "marketing" && activeTab === "ai-agents" && (
                        <PlaceholderTab label="AI Agents" />
                      )}
                      {variant === "ceo" && activeTab === "calendar" && (
                        <CeoCalendarSection />
                      )}
                      {variant === "ceo" && activeTab === "assistant" && (
                        <DashboardAssistantPanel />
                      )}
                      {variant === "ceo" && activeTab === "supabase" && <CeoSupabaseSection />}
                      {variant === "ceo" && activeTab === "clients" && (
                        <CeoClientsSection />
                      )}
                      {variant === "ceo" && activeTab === "leads" && <CeoLeadsSection />}
                      {variant === "ceo" && activeTab === "analytics" && (
                        <CeoAnalyticsSection />
                      )}
                      {variant === "ceo" && activeTab === "support-inbox" && (
                        <CeoSupportInboxSection />
                      )}
                      {variant === "ceo" && activeTab === "revenue-reports" && (
                        <CeoRevenueReportsSection />
                      )}
                      {variant === "ceo" && activeTab === "blog-posts" && (
                        <CeoBlogPostsSection />
                      )}
                      {variant === "ceo" && activeTab === "business-notes" && (
                        <CeoBusinessNotesSection />
                      )}
                      {variant === "ceo" &&
                        activeTab !== "calendar" &&
                        activeTab !== "assistant" &&
                        activeTab !== "supabase" &&
                        activeTab !== "clients" &&
                        activeTab !== "leads" &&
                        activeTab !== "analytics" &&
                        activeTab !== "support-inbox" &&
                        activeTab !== "revenue-reports" &&
                        activeTab !== "blog-posts" &&
                        activeTab !== "business-notes" && (
                          <PlaceholderTab
                            variant="ceo"
                            label={
                              navTabs.find((t) => t.id === activeTab)?.label ??
                              "Section"
                            }
                          />
                        )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-gray-400/20 via-gray-500/20 to-gray-400/20 blur-3xl" />
    </motion.div>
  );
}
