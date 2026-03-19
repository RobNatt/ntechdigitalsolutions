# Launch Checklist — Tomorrow

## 1. Run migrations in Supabase

Open your Supabase project → **SQL Editor** and run:

1. **`supabase/migrations/008_leads_table_ensure.sql`** — run first if 004 fails with "relation leads does not exist" (creates table).
2. `supabase/migrations/004_leads.sql` — ensures leads table has required columns
3. `supabase/migrations/005_lead_pipeline.sql` — adds pipeline stages (stage, stage_updated_at)
4. `supabase/migrations/006_default_company.sql` — creates companies table if needed, inserts nTech.
5. **`supabase/migrations/007_leads_company_id_nullable.sql`** — **CRITICAL**: makes company_id nullable. Run this so lead form works.
6. **`supabase/migrations/009_leads_user_id_nullable.sql`** — **CRITICAL**: makes user_id nullable. Public form submissions have no user.

## 2. Environment variables (Vercel)

In Vercel → Project → Settings → Environment Variables:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — required for leads and admin operations

**Email notifications (optional):**
- `RESEND_API_KEY` — from [resend.com](https://resend.com)
- `LEAD_NOTIFICATION_EMAIL` — email address to receive new lead alerts

## 3. What's in place

- **Leads table** — Form submissions stored in Supabase
- **Leads API** — `POST /api/leads/submit` (public, rate-limited), `GET /api/leads` (auth required)
- **Email notifications** — New leads trigger an email (if Resend is configured)
- **CRM pipeline** — Dashboard Leads tab: pipeline stages (Submitted → Contacted → Appt Set → Qualified → Closed Won/Lost), update stage per lead
- **Success page** — "A representative will reach out in the next hour..."
- **Auth middleware** — Dashboard requires sign-in + 2FA

## 4. Client onboarding

See **`CLIENT-ONBOARDING-CHECKLIST.md`** for documentation needed to close clients and assign pages (Twilio 2FA, Vercel AI lead verification, company setup).

## 5. If lead form still returns 500

1. **Vercel** → Project → Logs → filter by `/api/leads/submit` — check the actual error.
2. **Supabase** → Table Editor → confirm `leads` table exists and `company_id` is nullable.
3. **Vercel** → Settings → Environment Variables — confirm `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` are set.

## 6. Test before launch

1. Submit a test lead from `/lead_roofing` and `/client_roofing`
2. Confirm entries in Supabase → Table Editor → `leads`
3. Confirm leads appear in Dashboard → Leads tab (with pipeline summary)
4. Update a lead's stage and verify it persists
5. Test 2FA sign-in (Twilio SMS in production)
