export type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 8000;

export function validateChatMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  if (input.length > MAX_MESSAGES) return null;

  const out: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0) return null;
    if (content.length > MAX_CONTENT_LENGTH) return null;
    out.push({ role, content });
  }
  return out;
}
