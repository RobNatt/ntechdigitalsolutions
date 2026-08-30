export type CommandCenterGoalDef = {
  key: string;
  label: string;
  target: number;
  metric: string;
  unit?: "currency" | "count" | "percent";
};

export type CommandCenterGoalsConfig = {
  short_term: CommandCenterGoalDef[];
  long_term: CommandCenterGoalDef[];
};

export type CommandCenterGoalProgress = CommandCenterGoalDef & {
  current: number;
  progress: number;
};

export type CommandCenterKpi = {
  key: string;
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaUp?: boolean;
  href?: string;
};

export type CommandCenterTodayAction = {
  label: string;
  detail: string;
  href: string;
  urgent?: boolean;
};

export type TrafficPathRow = { path: string; count: number };
export type TrafficReferrerRow = { referrer: string; count: number };
export type TrafficUtmRow = { source: string; count: number };
export type TrafficEventRow = { eventType: string; count: number };
export type DailyPageviewRow = { day: string; count: number };

export type CommandCenterTraffic = {
  enabled: boolean;
  periodDays: number;
  pageviews: number;
  visitors: number;
  sessions: number;
  inquiries: number;
  conversionRate: number;
  topPaths: TrafficPathRow[];
  topReferrers: TrafficReferrerRow[];
  topUtmSources: TrafficUtmRow[];
  customEvents: TrafficEventRow[];
  dailyPageviews: DailyPageviewRow[];
  pageviewsPrevPeriod: number;
};

export type CommandCenterPipelineStage = {
  stage: string;
  count: number;
};

export type CommandCenterActivity = {
  id: string;
  action: string;
  message: string | null;
  created_at: string;
  entity_type: string;
};

export type CommandCenterSnapshot = {
  todayYmd: string;
  timeZone: string;
  brandColor: string;
  currency: string;
  isInternal: boolean;
  healthLabel: "Strong" | "Steady" | "Needs attention";
  healthSummary: string;
  todayActions: CommandCenterTodayAction[];
  kpis: CommandCenterKpi[];
  shortTermGoals: CommandCenterGoalProgress[];
  longTermGoals: CommandCenterGoalProgress[];
  traffic: CommandCenterTraffic;
  pipeline: CommandCenterPipelineStage[];
  projectStages: { stage: string; count: number }[];
  followUpBlock: {
    title: string;
    date_start: string;
    date_end: string;
  } | null;
  todayMeetings: { title: string; time: string; href: string }[];
  recentActivity: CommandCenterActivity[];
};
