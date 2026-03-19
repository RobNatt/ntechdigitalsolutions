/**
 * Client-side storage utilities for persisting data across sessions.
 * Uses localStorage - data survives page refresh and browser restart.
 *
 * For production with multi-user/auth, replace with API + database.
 */

const CALENDAR_EVENTS_KEY = "ntech-calendar-events";
const EMAIL_MESSAGES_KEY = "ntech-email-messages";
const CEO_DATA_KEY = "ntech-ceo-data";

export function getStoredCalendarEvents<T>(): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CALENDAR_EVENTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    return parsed.map((item) => ({
      ...item,
      date: new Date(item.date as string),
    })) as T[];
  } catch {
    return null;
  }
}

export function setStoredCalendarEvents<T extends { date: Date }>(events: T[]): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = events.map((e) => ({
      ...e,
      date: e.date.toISOString(),
    }));
    localStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(serialized));
  } catch {
    // Storage full or disabled
  }
}

export function getStoredEmails<T>(): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(EMAIL_MESSAGES_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T[];
  } catch {
    return null;
  }
}

export function setStoredEmails<T>(emails: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EMAIL_MESSAGES_KEY, JSON.stringify(emails));
  } catch {
    // Storage full or disabled
  }
}

export function getStoredCeoData<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CEO_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStoredCeoData<T>(data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CEO_DATA_KEY, JSON.stringify(data));
  } catch {
    // Storage full or disabled
  }
}
