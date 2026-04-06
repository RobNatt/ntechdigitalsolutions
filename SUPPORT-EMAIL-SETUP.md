# Support email — `hello@ntechdigital.solutions` → dashboard inbox

Inbound mail is **not** received by Next.js directly. You configure **DNS + a mail provider** (or forwarding) so that each message becomes an HTTP `POST` to this app.

## What is implemented in code

1. **`POST /api/support/inbound`** — Server-only webhook. Stores a row in `support_inbound_messages` and optionally emails you via **Resend** (see below).
2. **CEO Dashboard → Support inbox** — Lists messages; optional **client** filter. Rows are linked to a **client** when:
   - the webhook sends `clientId` / `companyId`, or
   - the sender’s email matches a row in `clients.email` (case-insensitive).
3. **Email ping** — After insert, the app calls **`sendSupportInboxNotification`** (`src/lib/email.ts`):
   - `SUPPORT_NOTIFICATION_EMAIL` if set, else **`LEAD_NOTIFICATION_EMAIL`**
   - Requires **`RESEND_API_KEY`** (same as lead/inquiry mail).

## Environment variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `SUPPORT_INBOUND_WEBHOOK_SECRET` | Long random string. Caller must send `Authorization: Bearer <secret>`. |
| `RESEND_API_KEY` | Required for the “you’ve got mail” notification email. |
| `SUPPORT_NOTIFICATION_EMAIL` | Where to notify (your real inbox). Falls back to `LEAD_NOTIFICATION_EMAIL`. |
| `LEAD_NOTIFICATION_FROM` | Optional From header for Resend (same as other notifications). |

## Webhook contract

`POST /api/support/inbound`

**Headers**

```
Authorization: Bearer <SUPPORT_INBOUND_WEBHOOK_SECRET>
Content-Type: application/json
```

**Body (JSON)**

```json
{
  "from": "visitor@example.com",
  "fromName": "Jane Doe",
  "to": "hello@ntechdigital.solutions",
  "subject": "Question about services",
  "text": "Plain text body",
  "html": "<optional html>",
  "clientId": "optional-uuid",
  "companyId": "optional-uuid",
  "raw": { "any": "provider metadata" }
}
```

**Response:** `{ "ok": true, "id": "<uuid>" }`

## Making `hello@…` real

`hello@ntechdigital.solutions` only receives mail after you:

1. **MX records** for `ntechdigital.solutions` point to a host that accepts mail for `hello@` (Google Workspace, Zoho, Cloudflare Email Routing, Mailgun, etc.).
2. **Route inbound** to your app:
   - **Cloudflare Email Routing** (free): forward to a Worker that `POST`s to `/api/support/inbound` with the secret; or forward to a personal inbox and use a second automation (less ideal).
   - **Mailgun / SendGrid Inbound Parse**: receive MIME, parse, POST JSON to the webhook.
   - **Zapier / Make**: IMAP trigger on a mailbox that receives forwards from `hello@`, then HTTP POST to the webhook.

There is **no** magic “Resend receives hello@” path unless you use Resend’s receiving product and it fits your domain setup — the app is agnostic as long as something sends the JSON payload.

## Security

- Rotate `SUPPORT_INBOUND_WEBHOOK_SECRET` if it leaks.
- Never commit the secret; keep it in Vercel env only.
- The support table is **RLS-off** for anon; only **service role** via API routes reads/writes.

## Verification checklist

1. Run migration `021_support_inbound_messages.sql` in Supabase.
2. Set `SUPPORT_INBOUND_WEBHOOK_SECRET` and Resend vars on Vercel; redeploy.
3. `curl` test (replace values):

```bash
curl -X POST "https://ntechdigital.solutions/api/support/inbound" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@example.com","subject":"Smoke","text":"Hello"}'
```

4. Open **Dashboard → Support inbox** and confirm the row appears; confirm you receive the Resend notification if configured.
