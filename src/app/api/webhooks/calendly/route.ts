import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  handleCalendlyWebhook,
  loadIntegrationSettings,
  verifyWebhookSecret,
} from "@/lib/integrations/webhook-handlers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  const settings = await loadIntegrationSettings(admin);
  if (!settings?.integration_webhook_secret?.trim()) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const token = req.headers.get("x-webhook-token");
  if (!verifyWebhookSecret(settings, token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (!settings.integration_calendly_enabled) {
    return NextResponse.json({ ok: false, error: "Integration disabled." }, { status: 403 });
  }

  const result = await handleCalendlyWebhook(body);
  if (result.status === 200) {
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/calendar");
  }
  return NextResponse.json(result.json, { status: result.status });
}
