# Client Onboarding Checklist

Use this checklist when closing a new roofing client and assigning pages. Complete each section before going live.

---

## 1. Client & Business Info

| Field | Notes |
|-------|------|
| **Client name** | Primary contact |
| **Company / business name** | As it appears on invoices and branding |
| **Email** | Primary contact email |
| **Phone** | For Twilio 2FA if dashboard access needed |
| **Service area** | Cities, regions, states (for lead routing and AI verification) |
| **Address** | Billing address (if applicable) |

---

## 2. Page Assignment

| Item | Value |
|------|-------|
| **Page slug** | e.g. `client_acme_roofing` — used in URL and `source` |
| **Base URL** | `https://ntechdigital.solutions/[slug]` |
| **Lead type** | Homeowner / Roofer (client_roofing flow) |
| **Company ID** | UUID from `companies` table — assigned after migration |

**Steps:**
1. Create company record in Supabase (or use existing migration) → get `company_id`
2. Clone page route or add dynamic routing for client slug
3. Update lead submit API to use `company_id` from page/source mapping

---

## 3. Database (Supabase)

**Run in Supabase SQL Editor:**

```sql
-- Insert new client company
INSERT INTO public.companies (id, name)
VALUES (gen_random_uuid(), 'Client Company Name')
RETURNING id;
```

**Record the returned `id`** — use for page config and `company_id` on leads.

---

## 4. Auth (Twilio 2FA)

If the client gets dashboard access:

| Item | Notes |
|------|------|
| **Login ID** | Unique ID (e.g. `CLIENT001`) — set in `profiles.login_id` |
| **Phone number** | E.164 format (e.g. `+15551234567`) for Twilio SMS |
| **Role** | `member` or `admin` for client scope |

**Set in Supabase:**

```sql
UPDATE public.profiles
SET login_id = 'CLIENT001', phone_number = '+15551234567'
WHERE id = '<auth_user_id>';
```

**Twilio env vars (Vercel):** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — must be set for production 2FA.

---

## 5. Vercel AI Agent — Lead Verification

Leads from the funnel are verified by the Vercel AI agent before reaching the client.

| Item | Notes |
|------|------|
| **Agent endpoint / config** | URL or config for the AI verification service |
| **Verification rules** | Criteria for lead quality (e.g. valid phone, address, intent) |
| **Webhook / callback** | Where verified leads are sent (e.g. `POST /api/leads/submit` with `company_id`) |
| **Client-specific rules** | Any client-specific filters or thresholds |

**Document:**  
- [ ] Agent endpoint URL  
- [ ] Verification criteria (per client)  
- [ ] How verified leads are tagged (e.g. `verified: true` in details)

---

## 6. Twilio

| Item | Notes |
|------|------|
| **Account** | Shared nTech account or client-specific |
| **From number** | For 2FA SMS (dashboard sign-in) |
| **Messaging** | Optional: client SMS notifications for new leads |

**Env vars (if client uses dashboard):** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — already configured for nTech auth.

---

## 7. Payment & Billing

| Item | Notes |
|------|------|
| **Pricing** | Per-lead, monthly, or retainer |
| **Payment method** | Stripe, invoice, etc. |
| **Billing address** | If different from contact |
| **Billing contact** | Email for invoices |

---

## 8. Go-Live Checklist

- [ ] Company record created in Supabase → `company_id` stored
- [ ] Page(s) deployed and URL confirmed
- [ ] Lead submit API maps `source` → `company_id` for this client
- [ ] Vercel AI agent configured for this client’s verification rules
- [ ] If dashboard access: profile created with `login_id` and `phone_number`
- [ ] Twilio 2FA tested (if client has dashboard)
- [ ] Test lead submitted and appears in correct company/lead list
- [ ] Email notifications (if configured) go to correct recipient

---

## Quick Reference

| System | Purpose |
|--------|---------|
| **Twilio** | SMS 2FA for dashboard sign-in |
| **Vercel AI Agent** | Verifies incoming leads before assignment |
| **Supabase** | Companies, leads, `company_id` mapping |
| **Resend** | Email notifications for new leads |
