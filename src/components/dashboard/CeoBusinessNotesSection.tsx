"use client";

import { useCallback, useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";

type NoteRow = {
  id: string;
  title: string;
  note: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
};

export function CeoBusinessNotesSection() {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/business-notes");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load notes.");
        setNotes([]);
        return;
      }
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch {
      setError("Failed to load notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createNote() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/business-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to save note.");
        return;
      }
      setTitle("");
      setNote("");
      await load();
    } catch {
      setError("Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  async function patch(id: string, patchData: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/dashboard/business-notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      if (!res.ok) return;
      await load();
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <NotebookPen className="h-4 w-4 text-sky-700" aria-hidden />
            Business notes
          </p>
          <p className="mt-1 max-w-xl text-sm text-gray-600">
            Capture ideas, meeting notes, and strategy thoughts in one place inside the dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-400/50 bg-gray-200/40 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-300/50"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-4 shadow-inner">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">New note</p>
        <div className="mt-3 grid gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short title"
            className="rounded-lg border border-gray-400/50 bg-white/90 px-3 py-2 text-sm"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Idea, reminder, meeting summary..."
            rows={5}
            className="rounded-lg border border-gray-400/50 bg-white/90 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void createNote()}
              className="rounded-lg border border-sky-600/50 bg-sky-100/80 px-3 py-1.5 text-xs font-semibold text-sky-900 disabled:opacity-50"
            >
              Save note
            </button>
          </div>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 bg-gray-300/20 shadow-inner">
        <div className="border-b border-gray-400/30 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">Notes</h3>
        </div>
        {loading ? (
          <p className="px-4 py-8 text-sm text-gray-600">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="px-4 py-8 text-sm text-gray-600">No notes yet.</p>
        ) : (
          <ul className="divide-y divide-gray-400/20">
            {notes.map((n) => (
              <li key={n.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {n.title}
                      {n.pinned ? (
                        <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                          Pinned
                        </span>
                      ) : null}
                      {n.archived ? (
                        <span className="ml-2 rounded bg-gray-300 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-700">
                          Archived
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">{n.note}</p>
                    <p className="mt-1 text-[10px] text-gray-500">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => void patch(n.id, { pinned: !n.pinned })}
                      className="text-xs font-semibold text-sky-800 underline"
                    >
                      {n.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void patch(n.id, { archived: !n.archived })}
                      className="text-xs font-semibold text-sky-800 underline"
                    >
                      {n.archived ? "Unarchive" : "Archive"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
