# Analytics Installation Guide

This guide installs and verifies the first-party analytics system for:

- N-Tech internal site analytics
- Client-specific analytics (multi-tenant)
- Contact/inquiry submission tracking

## What this system tracks

- `pageview` events (path, referrer, UTM source/medium/campaign, session, visitor)
- `inquiry_submit` events (recorded server-side after successful `POST /api/inquiries`)
- Dashboard metrics in CEO Analytics:
  - Pageviews
  - Contact / inquiry submissions
  - Unique sessions / visitors
  - Sessions with 2+ pages
  - Sessions touching contact or inquiry
  - Top paths, referrers, UTM sources, daily pageviews

## 1) Prerequisites

- Supabase project configured and connected to this app
- App env vars already set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- `DEFAULT_COMPANY_ID` set for your main site/company (N-Tech default from migration `006`)

## 2) Run database migrations

Run these in order (if not already applied):

1. `supabase/migrations/019_analytics_events.sql`
2. `supabase/migrations/020_analytics_inquiry_metrics.sql`

These create:

- `public.analytics_site_keys`
- `public.analytics_events`
- `public.analytics_get_summary(uuid, timestamptz)` (updated in `020`)

## 3) Set environment variables

In `.env.local` and Vercel Project Settings:

- `NEXT_PUBLIC_SITE_URL=https://ntechdigital.solutions` (or your domain)
- `NEXT_PUBLIC_ANALYTICS_WRITE_KEY=<write_key for this deployment/company>`

Notes:

- `019` seeds a deterministic N-Tech key for the default company.
- You can rotate keys using the CEO Analytics UI (`New key`) or direct SQL.

## 4) Deploy code

Required components already wired:

- Client tracker: `src/components/analytics/AnalyticsTracker.tsx`
- Root layout mount: `src/app/layout.tsx`
- Public ingest endpoint: `POST /api/analytics/collect`
- Inquiry capture endpoint: `POST /api/inquiries` (records `inquiry_submit`)
- Summary endpoint: `GET /api/analytics/summary`
- Site key creation endpoint: `POST /api/analytics/site-keys`
- CEO UI: `src/components/dashboard/CeoAnalyticsSection.tsx`

## 5) Verify ingestion (N-Tech site)

1. Open site in browser.
2. Visit a few pages with UTM params, for example:
   - `/growth-system?utm_source=test&utm_medium=cpc&utm_campaign=smoke`
3. Submit the contact form once.
4. Open CEO Dashboard -> Analytics:
   - Confirm pageviews increment.
   - Confirm `Contact / inquiry submissions` increments after successful inquiry.
   - Confirm top paths/referrers/UTM data.

## 6) Client onboarding (multi-tenant)

For each client:

1. Ensure a row exists in `public.companies` for that client.
2. Ensure the client record links to that company (`clients.company_id`).
3. In CEO Dashboard -> Analytics:
   - Switch to `Clients`
   - Select client
   - Click `New key` to generate a write key
4. On the client deployment:
   - Set `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` to that client key
5. Verify client traffic appears only when that client is selected in Analytics.

## 7) API reference (quick)

### `POST /api/analytics/collect`

Used by tracker for pageviews.

Example payload:

```json
{
  "writeKey": "nt_xxx",
  "path": "/growth-system?utm_source=google",
  "referrer": "https://google.com",
  "sessionId": "sess_123",
  "visitorId": "vis_123",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "spring",
  "eventType": "pageview"
}
```

### `POST /api/inquiries`

Records lead + email notification and logs `inquiry_submit` analytics server-side.

### `GET /api/analytics/summary?companyId=<uuid>&days=30`

Authenticated dashboard summary + company site keys.

### `POST /api/analytics/site-keys`

Authenticated key creation.

Body:

```json
{
  "companyId": "uuid",
  "label": "Client Main Site"
}
```

## 8) Real-time behavior

- Ingest is near real-time: events are written immediately when requests complete.
- CEO Analytics tab is not websocket streaming:
  - Manual `Refresh` button
  - Auto-refresh every 45s while tab is open (if enabled)

## 9) Troubleshooting

- No data:
  - Check `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` in active deployment.
  - Confirm key exists in `analytics_site_keys`.
  - Confirm tracker is mounted in `src/app/layout.tsx`.
- Inquiry count stays zero:
  - Ensure contact form calls `POST /api/inquiries` successfully.
  - Ensure `DEFAULT_COMPANY_ID` is set in deployment env.
- Wrong tenant showing data:
  - Verify client uses correct write key.
  - Verify selected client has correct `company_id`.

## 10) Security notes

- `analytics_events` and `analytics_site_keys` are RLS-denied for direct client access.
- Dashboard reads and writes use authenticated API routes + service role client.
- `POST /api/analytics/collect` rejects forged `inquiry_submit`; only `/api/inquiries` creates inquiry submit events.

