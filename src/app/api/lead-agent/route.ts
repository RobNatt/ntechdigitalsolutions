/**
 * Proxies to the Vercel Lead Agent `/api/submit` endpoint (same payload as
 * vercel-labs/lead-agent). Server-side `fetch` typically gets **403** from
 * BotId unless the Lead Agent app trusts this proxy:
 *
 * In `lead-agent` `app/api/submit/route.ts`, before `checkBotId()`:
 *   const proxy = request.headers.get('x-ntech-lead-proxy-secret');
 *   if (process.env.LEAD_AGENT_BYPASS_SECRET && proxy === process.env.LEAD_AGENT_BYPASS_SECRET) {
 *     // trusted proxy — skip BotId
 *   } else {
 *     const verification = await checkBotId();
 *     ...
 *   }
 *
 * Set the same `LEAD_AGENT_BYPASS_SECRET` in this project and in the Lead Agent project.
 */
import { NextResponse } from "next/server";
import {
  validateLeadAgentPayload,
  type LeadAgentPayload,
} from "@/lib/lead-agent";

const DEFAULT_SUBMIT_URL =
  "https://lead-processing-agent-sandy-omega.vercel.app/api/submit";

function getSubmitUrl() {
  return (
    process.env.LEAD_AGENT_SUBMIT_URL?.trim() || DEFAULT_SUBMIT_URL
  );
}

const submittedIps = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const ts = submittedIps.get(ip) || [];
  const recent = ts.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  submittedIps.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateLeadAgentPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const payload: LeadAgentPayload = parsed.data;
  const url = getSubmitUrl();

  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  /** When set, send to your Lead Agent app so it can skip BotId for this trusted proxy (see route comment). */
  const bypass = process.env.LEAD_AGENT_BYPASS_SECRET?.trim();
  if (bypass) {
    forwardHeaders["x-ntech-lead-proxy-secret"] = bypass;
  }

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!upstream.ok) {
      console.error("Lead agent upstream error:", upstream.status, text);
      const denied =
        upstream.status === 403 &&
        (text.includes("Access denied") || text.includes("denied"));
      return NextResponse.json(
        {
          error: denied
            ? "Lead service blocked the request (often BotId on the Lead Agent app). Set LEAD_AGENT_BYPASS_SECRET on this site and your Lead Agent deployment, or adjust BotId per the comment in api/lead-agent/route.ts."
            : "Lead service temporarily unavailable. Please try again.",
          detail:
            typeof json === "object" && json !== null && "error" in json
              ? String((json as { error: unknown }).error)
              : undefined,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      typeof json === "object" && json !== null
        ? json
        : { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Lead agent proxy fetch failed:", e);
    return NextResponse.json(
      { error: "Could not reach lead service. Please try again later." },
      { status: 502 }
    );
  }
}
