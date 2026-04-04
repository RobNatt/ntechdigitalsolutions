"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LineChart,
  BarChart2,
  Sparkles,
  UserCog,
  CreditCard,
  Gauge,
  LayoutTemplate,
  Inbox,
  Cpu,
  DollarSign,
  Building2,
  CalendarDays,
} from "lucide-react";
import { CeoCalendarSection } from "@/components/dashboard/CeoCalendarSection";
import { CeoClientsSection } from "@/components/dashboard/CeoClientsSection";
import { CeoLeadsSection } from "@/components/dashboard/CeoLeadsSection";

const MARKETING_NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "funnels", label: "Funnels", icon: BarChart2 },
  { id: "ai-agents", label: "AI Agents", icon: Sparkles },
] as const;

/** CEO / executive dashboard — sections to be built out. */
const CEO_NAV_TABS = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "user-management", label: "User management", icon: UserCog },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "leads", label: "Leads", icon: Users },
  { id: "plan-management", label: "Plan management", icon: CreditCard },
  { id: "usage-limits", label: "Usage limits", icon: Gauge },
  { id: "content-templates", label: "Content templates", icon: LayoutTemplate },
  { id: "support-inbox", label: "Support inbox", icon: Inbox },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "tool-performance", label: "Tool performance", icon: Cpu },
  { id: "revenue-reports", label: "Revenue reports", icon: DollarSign },
] as const;

const KPI_CARDS = [
  {
    title: "Leads this month",
    value: "284",
    delta: "↑ 42% vs last month",
    deltaPositive: true,
  },
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

const LEAD_ROWS = [
  {
    business: "Riverside Plumbing Co.",
    source: "SEO Funnel",
    score: 94,
    status: "HOT" as const,
  },
  {
    business: "Martinez Law Firm",
    source: "Landing Page",
    score: 87,
    status: "CONVERTED" as const,
  },
  {
    business: "Bloom Salon Studio",
    source: "AI Agent",
    score: 72,
    status: "WARM" as const,
  },
  {
    business: "Summit Roofing LLC",
    source: "Google Ads",
    score: 61,
    status: "NURTURING" as const,
  },
] as const;

function scoreTone(score: number) {
  if (score >= 85) return "text-emerald-700";
  if (score >= 70) return "text-sky-700";
  return "text-amber-700";
}

function statusStyles(status: (typeof LEAD_ROWS)[number]["status"]) {
  switch (status) {
    case "HOT":
      return "border-red-400/60 bg-red-50 text-red-800";
    case "CONVERTED":
      return "border-emerald-400/60 bg-emerald-50 text-emerald-900";
    case "WARM":
      return "border-amber-400/60 bg-amber-50 text-amber-900";
    case "NURTURING":
      return "border-teal-400/60 bg-teal-50 text-teal-900";
    default:
      return "border-gray-400/50 bg-gray-100 text-gray-800";
  }
}

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 bg-gray-300/20 shadow-inner backdrop-blur-sm">
        <div className="border-b border-gray-400/30 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            Recent pipeline
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-400/25 bg-gray-400/10 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700">
                <th className="px-4 py-2.5">Lead / Business</th>
                <th className="px-4 py-2.5">Source</th>
                <th className="px-4 py-2.5">Score</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEAD_ROWS.map((row, i) => (
                <tr
                  key={`${row.business}-${i}`}
                  className="border-b border-gray-400/20 last:border-0 hover:bg-gray-400/10"
                >
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {row.business}
                  </td>
                  <td className="px-4 py-2.5 text-gray-700">{row.source}</td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-sm font-semibold tabular-nums",
                      scoreTone(row.score)
                    )}
                  >
                    {row.score}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        statusStyles(row.status)
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  const navTabs = variant === "ceo" ? CEO_NAV_TABS : MARKETING_NAV_TABS;
  const [activeTab, setActiveTab] = useState<string>(
    variant === "ceo" ? "calendar" : "dashboard"
  );

  const headerTitle =
    variant === "ceo" ? "CEO dashboard" : "Lead Intelligence Dashboard";
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
                <header className="relative z-[1] flex shrink-0 items-start justify-between gap-3 border-b border-gray-400/30 bg-neutral-100/80 px-4 py-3 md:px-5 md:py-4">
                  <h1 className="text-base font-bold tracking-tight text-gray-800 md:text-lg">
                    {headerTitle}
                  </h1>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-100/80 px-2.5 py-1 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-35" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                      Live
                    </span>
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
                      {variant === "marketing" && activeTab === "leads" && (
                        <PlaceholderTab label="Leads" />
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
                      {variant === "ceo" && activeTab === "clients" && (
                        <CeoClientsSection />
                      )}
                      {variant === "ceo" && activeTab === "leads" && <CeoLeadsSection />}
                      {variant === "ceo" &&
                        activeTab !== "calendar" &&
                        activeTab !== "clients" &&
                        activeTab !== "leads" && (
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
