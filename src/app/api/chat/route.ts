import Groq from "groq-sdk";
import { DEFAULT_GROQ_MODEL, DEFAULT_SYSTEM_PROMPT } from "@/lib/chat-config";
import { validateChatMessages } from "@/lib/validate-chat-messages";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

  const systemPrompt =
    process.env.CHAT_SYSTEM_PROMPT?.trim() || DEFAULT_SYSTEM_PROMPT;
  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  const groq = new Groq({ apiKey });

  try {
    const stream = await groq.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
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
