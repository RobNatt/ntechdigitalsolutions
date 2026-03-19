"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const STAGES = [
  { value: "submitted", label: "Submitted" },
  { value: "contacted", label: "Contacted" },
  { value: "appointment_set", label: "Appt Set" },
  { value: "qualified", label: "Qualified" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

interface Lead {
  id: string;
  source: string;
  lead_type: string;
  name: string;
  phone: string;
  address: string;
  email: string | null;
  details: Record<string, unknown>;
  stage?: string;
  created_at: string;
}

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("source", filter);
      if (stageFilter) params.set("stage", stageFilter);
      const url = `/api/leads${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const { leads: data } = await res.json();
        setLeads(data || []);
      } else {
        setLeads([]);
      }
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter, stageFilter]);

  const updateStage = async (leadId: string, stage: string) => {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (res.ok) fetchLeads();
  };

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Incoming Leads</h2>
        <div className="flex gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-400 rounded-lg text-sm bg-white text-gray-800"
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-400 rounded-lg text-sm bg-white text-gray-800"
          >
            <option value="">All sources</option>
            <option value="lead_roofing">Lead Roofing</option>
            <option value="client_roofing">Client Roofing</option>
          </select>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600 py-8">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="text-gray-600 py-8">No leads yet. They&apos;ll appear here when forms are submitted.</div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-2 text-xs text-center py-2 border-b border-gray-300">
            {STAGES.map((s) => {
              const count = leads.filter((l) => (l.stage || "submitted") === s.value).length;
              return (
                <div key={s.value} className="text-gray-600">
                  <div className="font-medium">{count}</div>
                  <div>{s.label}</div>
                </div>
              );
            })}
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 border border-gray-400/50 rounded-lg bg-white/50 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-800">{lead.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-300 text-gray-600">
                      {lead.lead_type}
                    </span>
                    <span className="text-xs text-gray-500">{lead.source}</span>
                    <select
                      value={lead.stage || "submitted"}
                      onChange={(e) => updateStage(lead.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-400 rounded bg-white text-gray-800"
                    >
                      {STAGES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{lead.address}</p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-sm text-sky-600 hover:underline"
                  >
                    {lead.phone}
                  </a>
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm text-sky-600 hover:underline block"
                    >
                      {lead.email}
                    </a>
                  )}
                  {Object.keys(lead.details || {}).length > 0 && (
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      {Object.entries(lead.details)
                        .filter(([, v]) => v != null && v !== "" && !Array.isArray(v))
                        .slice(0, 5)
                        .map(([k, v]) => (
                          <div key={k}>
                            {k}: {String(v)}
                          </div>
                        ))}
                      {Array.isArray(lead.details?.damages) && (
                        <div>Damages: {(lead.details.damages as string[]).join(", ")}</div>
                      )}
                      {Array.isArray(lead.details?.renterDamages) && (
                        <div>Issues: {(lead.details.renterDamages as string[]).join(", ")}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 shrink-0">
                  {formatDate(lead.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
