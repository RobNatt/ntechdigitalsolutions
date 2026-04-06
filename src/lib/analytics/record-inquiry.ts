import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Records a successful contact / inquiry form submission (server-side).
 * Uses the same session/visitor IDs as the browser tracker when the client sends them.
 */
export async function recordInquirySubmit(params: {
  companyId: string | null | undefined;
  path: string;
  sessionId?: string | null;
  visitorId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const companyId = params.companyId?.trim();
  if (!companyId) return;

  const admin = createAdminClient();
  const { data: keyRow, error: keyError } = await admin
    .from("analytics_site_keys")
    .select("id")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (keyError || !keyRow?.id) return;

  const path = params.path.trim().slice(0, 2048) || "/contact";
  const sid =
    (params.sessionId && params.sessionId.trim().slice(0, 128)) ||
    `inquiry_sess_${randomUUID()}`;
  const vid =
    (params.visitorId && params.visitorId.trim().slice(0, 128)) ||
    `inquiry_vis_${randomUUID()}`;

  const { error } = await admin.from("analytics_events").insert({
    site_key_id: keyRow.id,
    company_id: companyId,
    path,
    referrer: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    session_id: sid,
    visitor_id: vid,
    event_type: "inquiry_submit",
    metadata: params.metadata && typeof params.metadata === "object" ? params.metadata : {},
  });

  if (error) {
    console.error("recordInquirySubmit:", error.message);
  }
}
