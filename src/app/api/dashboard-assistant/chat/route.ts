import Groq from "groq-sdk";
import {
  DASHBOARD_ASSISTANT_DEFAULT_PROMPT,
  formatDashboardDateContext,
} from "@/lib/dashboard-assistant-config";
import { DEFAULT_GROQ_MODEL } from "@/lib/chat-config";
import { createClient } from "@/lib/supabase/server";
import { validateChatMessages } from "@/lib/validate-chat-messages";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing GROQ_API_KEY on the server." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Expected JSON object." }, { status: 400 });
  }

  const messages = validateChatMessages((body as { messages?: unknown }).messages);
  if (!messages) {
    return Response.json(
      {
        error:
          "Invalid messages: non-empty array of user/assistant turns required.",
      },
      { status: 400 }
    );
  }

  const tz =
    process.env.DASHBOARD_ASSISTANT_TIMEZONE?.trim() || "America/Chicago";
  const dateLine = formatDashboardDateContext(tz);
  const basePrompt =
    process.env.DASHBOARD_ASSISTANT_SYSTEM_PROMPT?.trim() ||
    DASHBOARD_ASSISTANT_DEFAULT_PROMPT;
  const systemPrompt = `${basePrompt}\n\n## Session context\n${dateLine}\nSigned-in user id (reference only): ${user.id}`;

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  const groq = new Groq({ apiKey });

  try {
    const stream = await groq.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      temperature: 0.65,
      max_tokens: 2048,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (e) {
          controller.error(e);
          return;
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Groq request failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
