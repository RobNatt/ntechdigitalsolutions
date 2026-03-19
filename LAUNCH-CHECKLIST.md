# Launch Checklist — Tomorrow

## 1. Run the leads migration in Supabase

1. Open your Supabase project → **SQL Editor**
2. Run the contents of `supabase/migrations/004_leads.sql` to create the `leads` table

## 2. Environment variables (Vercel)

Ensure these are set in Vercel → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for leads + admin operations)

## 3. What’s in place

- **Leads table** — Form submissions from `/lead_roofing` and `/client_roofing` are stored in Supabase
- **Leads API** — `POST /api/leads/submit` (public, rate-limited) and `GET /api/leads` (auth required for dashboard)
- **Dashboard Leads tab** — View incoming leads from Email | Leads | Calendar | CEO
- **Auth middleware** — Dashboard requires sign-in + 2FA cookie
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **SMS verification skipped** — Forms go from Contact → Details → Submit; SMS can be added later with Twilio

## 4. Test before launch

1. Submit a test lead from `/lead_roofing` and `/client_roofing`
2. Confirm entries in Supabase → Table Editor → `leads`
3. Confirm leads appear in the dashboard → Leads tab (while signed in)
