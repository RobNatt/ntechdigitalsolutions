import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { DEFAULT_GROQ_MODEL } from "@/lib/chat-config";
import { createClient } from "@/lib/supabase/server";

type DraftRequest = {
  leadName?: string | null;
  businessName?: string | null;
  email?: string | null;
  source?: string | null;
  status?: string | null;
  temperature?: string | null;
  objective?: string | null;
};

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function fallbackSubject(name: string, businessName: string): string {
  if (businessName) return `Quick follow-up for ${businessName}`;
  if (name) return `Quick follow-up from NTech`;
  return "Quick follow-up from NTech";
}

function fallbackBody(name: string): string {
  const firstName = name.split(" ")[0] || "there";
  return [
    `Hi ${firstName},`,
    "",
    "Wanted to follow up and see if you'd like help improving lead flow from your website and local search.",
    "",
    "If useful, I can share a practical next-step plan tailored to your market.",
    "",
    "- NTech Digital Solutions",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY on server." }, { status: 500 });
    }

    let body: DraftRequest;
    try {
      body = (await request.json()) as DraftRequest;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const leadName = safeString(body.leadName);
    const businessName = safeString(body.businessName);
    const email = safeString(body.email);
    const source = safeString(body.source);
    const status = safeString(body.status, "New");
    const temperature = safeString(body.temperature, "Warm");
    const objective = safeString(body.objective, "book a short strategy call");

    const systemPrompt = [
      "You write concise sales follow-up emails for NTech Digital Solutions.",
      "Tone: professional, direct, calm, human, no hype.",
      "Do not mention AI.",
      "Do not promise outcomes or use spammy language.",
      "Keep body under 130 words.",
      "Output STRICT JSON only with keys: subject, body.",
      "Body must be plain text and include a clear next step.",
    ].join(" ");

    const userPrompt = [
      `Lead name: ${leadName || "(unknown)"}`,
      `Business name: ${businessName || "(unknown)"}`,
      `Lead email: ${email || "(unknown)"}`,
      `Lead source: ${source || "(unknown)"}`,
      `CRM status: ${status}`,
      `Lead temperature: ${temperature}`,
      `Objective: ${objective}`,
      "Service context: conversion-focused websites, targeted advertising, and lead tracking dashboards.",
      "Write a follow-up that references their business context naturally.",
    ].join("\n");

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL,
      temperature: 0.55,
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    let subject = "";
    let draftBody = "";
    try {
      const parsed = JSON.parse(raw) as { subject?: string; body?: string };
      subject = safeString(parsed.subject);
      draftBody = safeString(parsed.body);
    } catch {
      subject = "";
      draftBody = "";
    }

    if (!subject) subject = fallbackSubject(leadName, businessName);
    if (!draftBody) draftBody = fallbackBody(leadName);

    return NextResponse.json({
      subject,
      body: draftBody,
    });
  } catch (err) {
    console.error("lead-followup-draft route error:", err);
    return NextResponse.json({ error: "Failed to generate draft." }, { status: 500 });
  }
}
