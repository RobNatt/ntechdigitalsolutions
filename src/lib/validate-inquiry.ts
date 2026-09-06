/**
 * Validation for chat enquiry submissions.
 *
 * Mirrors the shape of `validate-chat-messages.ts` — never trust a request body,
 * and never forward unvalidated shapes to an external webhook. Optional fields
 * are normalised to undefined rather than passed through as empty strings, so a
 * blank input doesn't arrive in the CRM as a field that looks filled in.
 */

export interface Inquiry {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  sourcePage: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t || t.length > max) return undefined;
  return t;
}

export function validateInquiry(body: unknown): Inquiry | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const name = str(b.name, 200);
  const email = str(b.email, 320);
  const message = str(b.message, 5000);

  if (!name || !email || !message || !EMAIL.test(email)) return null;

  return {
    name,
    email: email.toLowerCase(),
    message,
    company: str(b.company, 200),
    phone: str(b.phone, 50),
    sourcePage: str(b.sourcePage, 500) ?? "/",
  };
}
