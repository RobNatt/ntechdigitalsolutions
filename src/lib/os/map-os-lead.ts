import type { OsLeadRow } from "@/lib/os/leads-types";

export function mapOsLeadRow(row: Record<string, unknown>): OsLeadRow {
  const tags = row.tags;
  return {
    id: String(row.id),
    lead_name: String(row.lead_name ?? ""),
    business_name: String(row.business_name ?? ""),
    email: row.email != null ? String(row.email) : null,
    phone: row.phone != null ? String(row.phone) : null,
    source: row.source != null ? String(row.source) : null,
    status: String(row.status ?? "New"),
    temperature: String(row.temperature ?? "Cold"),
    tags: Array.isArray(tags) ? (tags as string[]) : [],
    assigned_user_id: row.assigned_user_id != null ? String(row.assigned_user_id) : null,
    linked_client_id: row.linked_client_id != null ? String(row.linked_client_id) : null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}
