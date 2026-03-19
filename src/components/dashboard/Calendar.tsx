"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Clock } from "lucide-react";
import { getStoredCalendarEvents, setStoredCalendarEvents } from "@/lib/storage";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  hour: number;
  duration: number;
  startMinutes: number;
  endMinutes: number;
  notes?: string;
  color?: string;
}

const HOUR_LABELS = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM",
  "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDayHeader(date: Date) {
  return `${DAY_NAMES[date.getDay()]} ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTimeFromMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

const ROW_HEIGHT = 48;
const DEFAULT_VIEW_HOUR = 7;

export function Calendar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
  } | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = getStoredCalendarEvents<CalendarEvent>();
    setEvents(stored || []);
    setIsHydrated(true);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    setStoredCalendarEvents(events);
  }, [events, isHydrated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = DEFAULT_VIEW_HOUR * ROW_HEIGHT;
    }
  }, []);

  const { days } = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 4 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    return { days };
  }, []);

  const getEventsForSlot = (date: Date, hour: number) => {
    const key = getDateKey(date);
    return events.filter((e) => {
      const eKey = getDateKey(e.date);
      if (eKey !== key) return false;
      return hour >= e.hour && hour < e.hour + e.duration;
    });
  };

  const handleSlotClick = (date: Date, hour: number) => {
    const existing = getEventsForSlot(date, hour);
    if (existing.length > 0) {
      setEditingEvent(existing[0]);
      setSelectedSlot(null);
      setIsAddEventOpen(false);
    } else {
      setSelectedSlot({ date, hour });
      setIsAddEventOpen(true);
      setEditingEvent(null);
    }
  };

  const handleOpenAddEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedSlot({ date: today, hour: 9 });
    setIsAddEventOpen(true);
    setEditingEvent(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem("date") as HTMLInputElement).value;
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement).value;
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    if (!title.trim()) return;

    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const duration = Math.max(0.5, (endMinutes - startMinutes) / 60);
    const hour = Math.floor(startMinutes / 60);

    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      hour,
      duration,
      startMinutes,
      endMinutes,
      notes: notes.trim() || undefined,
      color: "bg-gray-500/60",
    };
    setEvents((prev) => [...prev, newEvent]);
    setSelectedSlot(null);
    setIsAddEventOpen(false);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const dateStr = (form.elements.namedItem("date") as HTMLInputElement).value;
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement).value;
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    if (!title.trim() || !editingEvent) return;

    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const duration = Math.max(0.5, (endMinutes - startMinutes) / 60);
    const hour = Math.floor(startMinutes / 60);

    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              title: title.trim(),
              date,
              hour,
              duration,
              startMinutes,
              endMinutes,
              notes: notes.trim() || undefined,
            }
          : ev
      )
    );
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id));
    setEditingEvent(null);
  };

  const getEventFormDefaults = () => {
    if (editingEvent) {
      return {
        date: getDateKey(editingEvent.date),
        startTime: formatTimeFromMinutes(editingEvent.startMinutes),
        endTime: formatTimeFromMinutes(editingEvent.endMinutes),
        title: editingEvent.title,
        notes: editingEvent.notes || "",
      };
    }
    if (selectedSlot) {
      const startTime = formatTimeFromMinutes(selectedSlot.hour * 60);
      const endTime = formatTimeFromMinutes((selectedSlot.hour + 1) * 60);
      return {
        date: getDateKey(selectedSlot.date),
        startTime,
        endTime,
        title: "",
        notes: "",
      };
    }
    const today = new Date();
    return {
      date: getDateKey(today),
      startTime: "09:00",
      endTime: "10:00",
      title: "",
      notes: "",
    };
  };

  const formDefaults = getEventFormDefaults();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
            Calendar
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
            <span className="text-gray-600 text-sm">
              Next 4 days · Hour by hour
            </span>
          </div>
        </div>
        <motion.button
          onClick={handleOpenAddEvent}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-500 bg-gray-400/20 text-gray-700 font-medium hover:bg-gray-400/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </motion.button>
      </div>

      {/* Calendar grid */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-auto rounded-xl border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm"
      >
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] sticky top-0 bg-gray-200/80 backdrop-blur-sm border-b border-gray-400/30 z-10">
            <div className="p-2 border-r border-gray-400/20" />
            {days.map((day) => (
              <div
                key={getDateKey(day)}
                className="p-2 border-r border-gray-400/20 last:border-r-0 text-center"
              >
                <div className="text-xs text-gray-500 font-mono">
                  {formatDayHeader(day)}
                </div>
                <div className="text-sm font-bold text-gray-700 mt-0.5">
                  {day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth()
                    ? "Today"
                    : DAY_NAMES[day.getDay()]}
                </div>
              </div>
            ))}
          </div>

          {HOUR_LABELS.map((label, hour) => (
            <div
              key={hour}
              className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b border-gray-400/20 overflow-visible"
              style={{ minHeight: ROW_HEIGHT }}
            >
              <div className="p-2 border-r border-gray-400/20 flex items-center text-xs text-gray-600 font-mono">
                {label}
              </div>
              {days.map((day) => {
                const slotEvents = getEventsForSlot(day, hour);
                const isFirstHourOfEvent = slotEvents.some((e) => e.hour === hour);

                return (
                  <div
                    key={`${getDateKey(day)}-${hour}`}
                    onClick={() => handleSlotClick(day, hour)}
                    className="p-1 border-r border-gray-400/20 last:border-r-0 cursor-pointer hover:bg-gray-400/10 transition-colors relative group overflow-visible"
                  >
                    {isFirstHourOfEvent &&
                      slotEvents.map((ev) => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute left-1 right-1 top-1 rounded px-2 py-1 text-xs font-medium text-white truncate ${ev.color || "bg-gray-500/60"} border border-gray-500/40 shadow-sm z-20`}
                          style={{
                            height: `calc(${ev.duration * 48}px - 8px)`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(ev);
                            setSelectedSlot(null);
                            setIsAddEventOpen(false);
                          }}
                        >
                          {ev.title}
                        </motion.div>
                      ))}
                    {slotEvents.length === 0 && (
                      <span className="opacity-0 group-hover:opacity-30 text-gray-500 text-xs">
                        +
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add event modal */}
      <AnimatePresence>
        {isAddEventOpen && !editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => {
              setIsAddEventOpen(false);
              setSelectedSlot(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Event
                </h3>
                <button
                  onClick={() => {
                    setIsAddEventOpen(false);
                    setSelectedSlot(null);
                  }}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="Event title"
                    defaultValue={formDefaults.title}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={formDefaults.date}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start time
                    </label>
                    <input
                      name="startTime"
                      type="time"
                      required
                      defaultValue={formDefaults.startTime}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End time
                    </label>
                    <input
                      name="endTime"
                      type="time"
                      required
                      defaultValue={formDefaults.endTime}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Add notes..."
                    rows={3}
                    defaultValue={formDefaults.notes}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsAddEventOpen(false);
                      setSelectedSlot(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit event modal */}
      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setEditingEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Edit Event
                </h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleUpdateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={editingEvent.title}
                    placeholder="Event title"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={getDateKey(editingEvent.date)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start time
                    </label>
                    <input
                      name="startTime"
                      type="time"
                      required
                      defaultValue={formatTimeFromMinutes(editingEvent.startMinutes)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End time
                    </label>
                    <input
                      name="endTime"
                      type="time"
                      required
                      defaultValue={formatTimeFromMinutes(editingEvent.endMinutes)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Add notes..."
                    rows={3}
                    defaultValue={editingEvent.notes || ""}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleDeleteEvent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-600 hover:bg-red-400/20"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
