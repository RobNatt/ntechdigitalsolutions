export type OsClientRow = {
  id: string;
  contact_name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export type OsProjectRow = {
  id: string;
  project_name: string;
  client_id: string;
  status: string;
  recurring: boolean;
  start_date: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OsPaymentRow = {
  id: string;
  client_id: string;
  amount: number;
  method: string;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type OsEventRow = {
  id: string;
  title: string;
  date_start: string;
  date_end: string;
  event_type: string;
  status: string;
  related_lead_id: string | null;
  related_client_id: string | null;
  meeting_link: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type LeadPickRow = { id: string; label: string };

export function mapOsClientRow(r: Record<string, unknown>): OsClientRow {
  return {
    id: String(r.id ?? ""),
    contact_name: String(r.contact_name ?? ""),
    business_name: String(r.business_name ?? ""),
    email: r.email != null ? String(r.email) : null,
    phone: r.phone != null ? String(r.phone) : null,
    notes: r.notes != null ? String(r.notes) : null,
    created_at: String(r.created_at ?? ""),
  };
}

export function mapOsProjectRow(r: Record<string, unknown>): OsProjectRow {
  return {
    id: String(r.id ?? ""),
    project_name: String(r.project_name ?? ""),
    client_id: String(r.client_id ?? ""),
    status: String(r.status ?? ""),
    recurring: Boolean(r.recurring),
    start_date: r.start_date != null ? String(r.start_date) : null,
    due_date: r.due_date != null ? String(r.due_date) : null,
    notes: r.notes != null ? String(r.notes) : null,
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? r.created_at ?? ""),
  };
}

export function mapOsPaymentRow(r: Record<string, unknown>): OsPaymentRow {
  const amt = r.amount;
  const num = typeof amt === "number" ? amt : Number(amt ?? 0);
  return {
    id: String(r.id ?? ""),
    client_id: String(r.client_id ?? ""),
    amount: Number.isFinite(num) ? num : 0,
    method: String(r.method ?? ""),
    date: String(r.date ?? ""),
    notes: r.notes != null ? String(r.notes) : null,
    created_at: String(r.created_at ?? ""),
    updated_at: r.updated_at != null ? String(r.updated_at) : null,
  };
}

export function mapOsEventRow(r: Record<string, unknown>): OsEventRow {
  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    date_start: String(r.date_start ?? ""),
    date_end: String(r.date_end ?? ""),
    event_type: String(r.event_type ?? ""),
    status: String(r.status ?? ""),
    related_lead_id: r.related_lead_id != null ? String(r.related_lead_id) : null,
    related_client_id: r.related_client_id != null ? String(r.related_client_id) : null,
    meeting_link: r.meeting_link != null ? String(r.meeting_link) : null,
    created_by_user_id: String(r.created_by_user_id ?? ""),
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? r.created_at ?? ""),
  };
}
