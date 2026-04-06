# Groq Chat Widget — Installation

## Overview

Marketing pages (`src/app/(marketing)/layout.tsx`) include a floating **Chat** widget that streams replies from **Groq** via `POST /api/chat`.

## 1) Environment variables

Add to `.env.local` and Vercel (server-only for the key):

| Variable | Required | Notes |
|----------|----------|--------|
| `GROQ_API_KEY` | **Yes** | From [Groq Console](https://console.groq.com/keys) |
| `GROQ_MODEL` | No | Defaults to `llama-3.3-70b-versatile` (see `src/lib/chat-config.ts`) |
| `CHAT_SYSTEM_PROMPT` | No | Overrides default N-Tech-focused system prompt |

Never expose `GROQ_API_KEY` to the client; the browser only calls `/api/chat`.

## 2) Deploy

1. Set env vars and redeploy.
2. Open any marketing route (e.g. `/`, `/contact`) and use the chat bubble (bottom-right).

## 3) Troubleshooting

- **500 “Missing GROQ_API_KEY”** — Key not set on the server environment.
- **502 from Groq** — Invalid key, quota, or model name; check Groq dashboard and optional `GROQ_MODEL`.
- **Widget missing** — Chat is only on `(marketing)` layout, not on `/dashboard` or `/growth-system` unless you add `<ChatWidget />` there.

## 4) Files

| Path | Role |
|------|------|
| `src/app/api/chat/route.ts` | Streaming Groq completion |
| `src/components/chat/chat-widget.tsx` | Floating launcher |
| `src/components/chat/chat-panel.tsx` | Thread UI |
| `src/lib/chat-config.ts` | Default model + system prompt |
| `src/lib/validate-chat-messages.ts` | Request validation |

For analytics setup, see `ANALYTICS-SETUP.md`.
