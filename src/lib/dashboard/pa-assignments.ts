import { weekdaySlotLabel } from "@/lib/dashboard/pa-assignments-defaults";

export const PA_ASSIGNMENTS_STORAGE_KEY = "ntech_pa_assignments_v2";
export const PA_ASSIGNMENTS_LEGACY_KEY = "ntech_pa_assignments_v1";

export const DEFAULT_PA_TIMEZONE = "America/Chicago";

export type PaAssignmentFrequency = "daily" | "weekly" | "weekday";

export type PaAssignment = {
  id: string;
  title: string;
  /** Longer checklist / notes — sent to the PA in context */
  description?: string;
  frequency: PaAssignmentFrequency;
  /** 0 = Monday … 6 = Sunday (business week); only when frequency === "weekday" */
  weekdaySlot?: number;
  /** ISO timestamp when user last tapped "Done" */
  lastCompletedAt: string | null;
  createdAt: string;
};

export type PaAssignmentEvaluated = PaAssignment & {
  status: "ok" | "due" | "overdue";
  /** Short reason for the PA */
  reason: string;
};

function safeJsonParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function parseRow(o: Record<string, unknown>): PaAssignment | null {
  const id = typeof o.id === "string" ? o.id : "";
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const description =
    typeof o.description === "string" && o.description.trim()
      ? o.description.trim()
      : undefined;
  const frequencyRaw = o.frequency;
  const frequency =
    frequencyRaw === "daily" ||
    frequencyRaw === "weekly" ||
    frequencyRaw === "weekday"
      ? frequencyRaw
      : null;
  const last =
    o.lastCompletedAt === null || o.lastCompletedAt === undefined
      ? null
      : typeof o.lastCompletedAt === "string"
        ? o.lastCompletedAt
        : null;
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : "";
  let weekdaySlot: number | undefined;
  if (typeof o.weekdaySlot === "number" && Number.isInteger(o.weekdaySlot)) {
    if (o.weekdaySlot >= 0 && o.weekdaySlot <= 6) weekdaySlot = o.weekdaySlot;
  }
  if (!id || !title || !frequency || !createdAt) return null;
  if (frequency === "weekday" && weekdaySlot === undefined) return null;
  return {
    id,
    title,
    description,
    frequency,
    weekdaySlot,
    lastCompletedAt: last,
    createdAt,
  };
}

export function loadPaAssignments(): PaAssignment[] {
  if (typeof window === "undefined") return [];
  let raw = safeJsonParse(window.localStorage.getItem(PA_ASSIGNMENTS_STORAGE_KEY));
  if (!Array.isArray(raw) || raw.length === 0) {
    const legacy = safeJsonParse(window.localStorage.getItem(PA_ASSIGNMENTS_LEGACY_KEY));
    if (Array.isArray(legacy) && legacy.length > 0) {
      raw = legacy;
      window.localStorage.setItem(PA_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(legacy));
    }
  }
  if (!Array.isArray(raw)) return [];
  const out: PaAssignment[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const p = parseRow(row as Record<string, unknown>);
    if (p) out.push(p);
  }
  return out;
}

export function savePaAssignments(items: PaAssignment[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PA_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(items));
}

/** YYYY-MM-DD in a given IANA time zone */
export function ymdInTimeZone(d: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(d)
      .slice(0, 10);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

const MS_PER_DAY = 86_400_000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** Monday = 0 … Sunday = 6 in the given IANA time zone */
export function getWeekdayMon0InTz(d: Date, timeZone: string): number {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(d);
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return map[short] ?? 0;
}

function addDaysToYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + days * MS_PER_DAY;
  return new Date(t).toISOString().slice(0, 10);
}

function mondayYmdOfWeekContaining(now: Date, timeZone: string): string {
  const todayYmd = ymdInTimeZone(now, timeZone);
  const todaySlot = getWeekdayMon0InTz(now, timeZone);
  return addDaysToYmd(todayYmd, -todaySlot);
}

function sundayYmdFromMonday(mondayYmd: string): string {
  return addDaysToYmd(mondayYmd, 6);
}

function evaluateWeekday(
  a: PaAssignment,
  slot: number,
  timeZone: string,
  now: Date,
  last: Date | null
): PaAssignmentEvaluated {
  const mon = mondayYmdOfWeekContaining(now, timeZone);
  const sun = sundayYmdFromMonday(mon);
  const todaySlot = getWeekdayMon0InTz(now, timeZone);
  const targetName = weekdaySlotLabel(slot);

  const lastYmd = last ? ymdInTimeZone(last, timeZone) : null;
  const completedThisWeek =
    lastYmd !== null && lastYmd >= mon && lastYmd <= sun;

  if (completedThisWeek) {
    return {
      ...a,
      status: "ok",
      reason: `Completed this calendar week (last: ${lastYmd}).`,
    };
  }

  if (lastYmd !== null && lastYmd < mon) {
    return {
      ...a,
      status: "overdue",
      reason: `No completion logged since week of ${mon} — ${targetName} block missed.`,
    };
  }

  if (todaySlot < slot) {
    return {
      ...a,
      status: "ok",
      reason: `Scheduled this week on ${targetName} (today is earlier in the week).`,
    };
  }
  if (todaySlot === slot) {
    return {
      ...a,
      status: "due",
      reason: `Today (${targetName}) — complete this block and mark done.`,
    };
  }
  return {
    ...a,
    status: "overdue",
    reason: `Past ${targetName} this week with no mark-done — follow up now.`,
  };
}

export function evaluatePaAssignments(
  items: PaAssignment[],
  timeZone: string,
  now: Date = new Date()
): PaAssignmentEvaluated[] {
  const todayYmd = ymdInTimeZone(now, timeZone);

  return items.map((a) => {
    if (a.frequency === "weekday") {
      const slot = a.weekdaySlot;
      if (slot === undefined) {
        return {
          ...a,
          status: "overdue",
          reason: "Invalid weekday assignment (missing weekdaySlot).",
        };
      }
      const last = a.lastCompletedAt ? new Date(a.lastCompletedAt) : null;
      if (last && Number.isNaN(last.getTime())) {
        return {
          ...a,
          status: "overdue",
          reason: "Invalid last completed time — mark done again.",
        };
      }
      if (!a.lastCompletedAt) {
        const mon = mondayYmdOfWeekContaining(now, timeZone);
        const todaySlot = getWeekdayMon0InTz(now, timeZone);
        const targetName = weekdaySlotLabel(slot);
        if (todaySlot < slot) {
          return {
            ...a,
            status: "ok",
            reason: `First week tracking — ${targetName} is later this week (week of ${mon}).`,
          };
        }
        if (todaySlot === slot) {
          return {
            ...a,
            status: "due",
            reason: `Today (${targetName}) — no prior mark-done; complete and mark.`,
          };
        }
        return {
          ...a,
          status: "overdue",
          reason: `Missed ${targetName} this week with no mark-done yet.`,
        };
      }
      return evaluateWeekday(a, slot, timeZone, now, last);
    }

    if (!a.lastCompletedAt) {
      return {
        ...a,
        status: "overdue",
        reason: `Never marked done — ${a.frequency} check required.`,
      };
    }
    const last = new Date(a.lastCompletedAt);
    if (Number.isNaN(last.getTime())) {
      return {
        ...a,
        status: "overdue",
        reason: "Invalid last completed time — please mark done again.",
      };
    }

    if (a.frequency === "daily") {
      const lastYmd = ymdInTimeZone(last, timeZone);
      if (lastYmd === todayYmd) {
        return { ...a, status: "ok", reason: "Completed today." };
      }
      if (lastYmd < todayYmd) {
        const gap = daysBetween(last, now);
        return {
          ...a,
          status: gap >= 2 ? "overdue" : "due",
          reason:
            gap >= 2
              ? `Last done ${lastYmd}; not done today — follow up.`
              : `Not yet done today (last: ${lastYmd}).`,
        };
      }
      return { ...a, status: "ok", reason: "Completed today." };
    }

    // weekly — rolling 7 days from last completion
    const ageMs = now.getTime() - last.getTime();
    if (ageMs < 0) {
      return { ...a, status: "ok", reason: "Recent completion recorded." };
    }
    if (ageMs < MS_PER_WEEK) {
      return {
        ...a,
        status: "ok",
        reason: `Inside 7-day window (last: ${ymdInTimeZone(last, timeZone)}).`,
      };
    }
    const ageDays = Math.floor(ageMs / MS_PER_DAY);
    if (ageDays === 7) {
      return {
        ...a,
        status: "due",
        reason: "7 days since last mark-done — do this week's check.",
      };
    }
    return {
      ...a,
      status: "overdue",
      reason: `${ageDays} days since last mark-done — overdue for weekly check.`,
    };
  });
}

export function mergeAssistantContext(
  snapshot: Record<string, unknown> | null,
  assignments: PaAssignment[],
  timeZone: string
): Record<string, unknown> {
  const evaluated = evaluatePaAssignments(assignments, timeZone);
  const counts = evaluated.reduce(
    (acc, row) => {
      acc[row.status] += 1;
      return acc;
    },
    { ok: 0, due: 0, overdue: 0 }
  );

  return {
    ...(snapshot ?? {}),
    paAssignments: evaluated.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? null,
      frequency: e.frequency,
      weekdaySlot: e.weekdaySlot ?? null,
      weekdayName:
        e.weekdaySlot !== undefined ? weekdaySlotLabel(e.weekdaySlot) : null,
      status: e.status,
      reason: e.reason,
      lastCompletedAt: e.lastCompletedAt,
    })),
    paAssignmentCounts: counts,
  };
}

export function mergeDefaultPack(
  existing: PaAssignment[],
  defaults: PaAssignment[]
): PaAssignment[] {
  const existingIds = new Set(existing.map((a) => a.id));
  const out = [...existing];
  for (const d of defaults) {
    if (!existingIds.has(d.id)) out.push(d);
  }
  return out;
}
