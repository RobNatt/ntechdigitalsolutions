/**
 * GoHighLevel (GHL) contact push — replaces the old Supabase leads/os_leads write path
 * for marketing-site form submissions. Server-only: GHL_API_KEY / GHL_LOCATION_ID must
 * never carry the NEXT_PUBLIC_ prefix.
 *
 * No credentials yet — calls no-op (skipped: true) until GHL_API_KEY and GHL_LOCATION_ID
 * are set, so form submissions keep working pre-launch.
 *
 * Field mapping (name/email/phone/tags) is safe against any GHL account. `customFields`
 * requires a field key that matches one already configured in the target GHL location —
 * verify/adjust the key below once real credentials are wired up.
 */

const GHL_CONTACTS_UPSERT_URL = "https://services.leadconnectorhq.com/contacts/upsert";
const GHL_API_VERSION = "2021-07-28";

export type GhlLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  source: string;
  tags?: string[];
};

export type GhlPushResult =
  | { ok: true }
  | { ok: false; skipped: true }
  | { ok: false; skipped: false; error: string };

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/);
  const [firstName, ...rest] = parts;
  return { firstName: firstName || fullName, lastName: rest.join(" ") || undefined };
}

export async function pushLeadToGhl(input: GhlLeadInput): Promise<GhlPushResult> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return { ok: false, skipped: true };
  }

  const { firstName, lastName } = splitName(input.name);

  try {
    const res = await fetch(GHL_CONTACTS_UPSERT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email: input.email,
        phone: input.phone || undefined,
        companyName: input.company || undefined,
        source: input.source,
        tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
        ...(input.message
          ? { customFields: [{ key: "inquiry_message", field_value: input.message }] }
          : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, skipped: false, error: `GHL ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, skipped: false, error: e instanceof Error ? e.message : "Unknown GHL error" };
  }
}
