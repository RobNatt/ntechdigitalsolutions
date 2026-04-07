"use client";

import { useMemo, useState } from "react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slotLabelsForDate(ymd: string): string[] {
  const d = new Date(`${ymd}T00:00:00`);
  const day = d.getDay();
  const slots: string[] = [];
  const pushRange = (startH: number, endH: number) => {
    for (let h = startH; h <= endH; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
  };
  if (day >= 1 && day <= 5) pushRange(8, 18);
  else pushRange(14, 16);
  return slots;
}

export function BookCallForm({ initialPlan }: { initialPlan?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState(initialPlan ?? "");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toYMD(d);
  });
  const [time, setTime] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = useMemo(() => slotLabelsForDate(date), [date]);
  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          plan,
          date,
          time,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not book call.");
        return;
      }
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CALENDAR_BOOKING_CLICK, {
        placement: "book_call_form",
        status: "booked",
      });
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        Booking confirmed. We sent your invite details and follow-up instructions.
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Name
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Email
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Phone
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Company
          <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Plan
          <input className={inputClass} value={plan} onChange={(e) => setPlan(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Date
          <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Time
          <select className={cn(inputClass, "cursor-pointer")} value={time} onChange={(e) => setTime(e.target.value)}>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Notes
        <textarea className={cn(inputClass, "min-h-[100px]")} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
      >
        {saving ? "Booking..." : "Book call"}
      </button>
    </form>
  );
}
