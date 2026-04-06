# Public tools — CEO dashboard roadmap

This document tracks **future** product work that extends the internal CEO dashboard (`/dashboard`). It complements shipped features (Calendar, Supabase, **Clients**, Leads, **Analytics**, Support inbox, Revenue reports shell).

## Principles

- **Clients** (`clients` + `company_id`) are the spine for multi-tenant views: analytics, support, and revenue should filter or roll up by client / company where it makes sense.
- **Public-facing** capabilities (embeds, widgets, inbound email) stay behind server routes and secrets — never expose service keys in the browser.

## CEO dashboard — planned upgrades (from sidebar placeholders)

These are **not** all built yet; they are the intended evolution of the executive UI.

| Area | Intent |
|------|--------|
| **User management** | Invite / disable dashboard users, roles (admin vs read-only), optional per-client scoping. |
| **Plan management** | Define service tiers (e.g. Growth System), what’s included, and which client is on which plan. |
| **Usage limits** | Quotas per client (leads/month, API calls, chat tokens, etc.) with soft warnings in-dashboard. |
| **Content templates** | Reusable page blocks, email snippets, or proposal fragments tied to clients or campaigns. |
| **Tool performance** | Health of integrations (Groq, Gmail, lead APIs): latency, error rate, last sync — per client where applicable. |

## Shipped or in progress (reference)

| Area | Notes |
|------|--------|
| **Support inbox** | Stores inbound items in `support_inbound_messages`; ingest via `POST /api/support/inbound`. Filter by **client** in the UI. See `SUPPORT-EMAIL-SETUP.md` for `hello@ntechdigital.solutions`. |
| **Revenue reports** | UI shell with **client** scope; connect billing / invoices / CRM value later. |

## Related docs

- `ANALYTICS-SETUP.md` — first-party analytics
- `CHAT-SETUP.md` — Groq chat widget
- `SUPPORT-EMAIL-SETUP.md` — routing email into the support inbox
