# Analytics Strategy

Last updated: April 2026

This guide explains how analytics is installed in this site, how to verify it, how to interpret numbers, and how to exclude internal traffic.

## 1) What is installed

The site uses a first-party analytics pipeline:

- Client tracker for pageviews: `src/components/analytics/AnalyticsTracker.tsx`
- Client helper for custom events: `src/lib/analytics/track-client-event.ts`
- Public ingest endpoint: `src/app/api/analytics/collect/route.ts`
- Dashboard summary endpoint: `src/app/api/analytics/summary/route.ts`
- Dashboard UI: `src/components/dashboard/CeoAnalyticsSection.tsx`
- Supabase migrations:
  - `019_analytics_events.sql` (events table)
  - `020_analytics_inquiry_metrics.sql` (summary function baseline)
  - `023_analytics_custom_event_counts.sql` (custom event breakdown)

Google Analytics is also installed, but it is a separate source of truth and will not exactly match first-party counts.

## 2) Required setup

### Environment variables

Set this in Vercel (Production + Preview) and local env:

- `NEXT_PUBLIC_ANALYTICS_WRITE_KEY=<write_key from analytics_site_keys>`

Where to get the key:

1. Go to CEO dashboard analytics tab.
2. Open "Tracking keys (write_key)".
3. Copy the key for the correct company.
4. Put it into Vercel env vars and redeploy.

### Database migrations

Make sure Supabase includes migration `023_analytics_custom_event_counts.sql`, otherwise the custom events breakdown will not appear correctly.

## 3) How tracking works

### Pageviews

- `AnalyticsTracker` runs on route changes.
- Sends `eventType: "pageview"` to `/api/analytics/collect`.
- Includes path, referrer, utm params, visitorId, and sessionId.

### Custom events

`trackClientAnalyticsEvent()` sends non-pageview events (for example CTA clicks, chat open, form start).

Important guard:

- `inquiry_submit` is blocked in client helper and must come from `/api/inquiries`.

## 4) Internal traffic exclusion (new)

Internal traffic can now be excluded without changing code each time.

### Browser controls

- Add `?no_track=1` to any site URL once.
  - This persists local opt-out in browser storage.
  - Future events from that browser are skipped.
- Add `?track=1` to re-enable tracking in that browser.

### Storage flag

- Key: `ntech_analytics_optout`
- Value `1` means analytics disabled for that browser.

### Server-side safety

The collector ignores any event marked as internal traffic (returns `{ ok: true, ignored: "internal_traffic" }` instead of writing to DB).

## 5) Verification checklist

After deploy:

1. Open website in browser devtools.
2. Network tab -> filter `analytics/collect`.
3. Refresh and navigate pages.
4. Confirm requests return `200` with `{ ok: true }`.
5. Open CEO dashboard analytics and click Refresh.
6. Confirm pageviews and custom events update.

If pageviews remain zero:

- Confirm `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` exists in Vercel.
- Confirm write key belongs to the same `company_id` selected in dashboard.
- Confirm migration `023` is applied.
- Confirm your browser is not opted out (`?track=1` to force on).

## 6) How to read the dashboard

Key cards:

- Pageviews: total pageview events in selected window.
- Inquiry submissions: successful inquiry events.
- Unique sessions / visitors: deduped by stored IDs.
- Sessions with 2+ pages: basic depth/engagement signal.
- Sessions touching contact/inquiry: intent signal.
- Custom events (by type): non-pageview actions like CTA clicks and chat interactions.

## 7) Why GA and first-party may differ

Expected differences include:

- Ad blockers and script blocking behavior
- Different session/user models
- Timezone differences
- Consent and bot filtering differences
- Missing env var on one pipeline but not the other

Use GA and first-party trend direction together; do not expect exact parity.

## 8) Recommended operating cadence

- Daily: check first-party pageviews + custom event trends.
- Weekly: compare trend direction with GA4.
- Monthly: prune/add custom events tied to business actions.
- Quarterly: rotate analytics write keys if needed.
