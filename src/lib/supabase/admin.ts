import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with service role.
 * Use for admin operations (lookup by login_id, send 2FA, etc).
 * Never expose this key to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
