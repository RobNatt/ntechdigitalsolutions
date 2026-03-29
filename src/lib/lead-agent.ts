/** Aligns with vercel-labs/lead-agent `formSchema` (lib/types.ts). */

export type LeadAgentPayload = {
  email: string;
  name: string;
  phone: string;
  company: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitCount(s: string) {
  return (s.match(/\d/g) || []).length;
}

export function validateLeadAgentPayload(
  raw: Record<string, unknown>
): { ok: true; data: LeadAgentPayload } | { ok: false; error: string } {
  const email = String(raw.email ?? "")
    .trim()
    .toLowerCase();
  const name = String(raw.name ?? "").trim();
  const phoneRaw = String(raw.phone ?? "").trim();
  const company = String(raw.company ?? "").trim();
  const rawMessage = String(raw.message ?? "").trim();

  const plan = String(raw.plan ?? "").trim().toLowerCase();
  const planLabel =
    plan === "starter" || plan === "growth" || plan === "pro"
      ? plan.charAt(0).toUpperCase() + plan.slice(1)
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid business email address." };
  }
  if (name.length < 2 || name.length > 50) {
    return {
      ok: false,
      error: "Name must be between 2 and 50 characters.",
    };
  }

  let phone = "";
  if (phoneRaw.length > 0) {
    if (!/^[\d\s\-+()]+$/.test(phoneRaw)) {
      return { ok: false, error: "Please enter a valid phone number." };
    }
    if (digitCount(phoneRaw) < 10) {
      return {
        ok: false,
        error: "Phone number must be at least 10 digits.",
      };
    }
    phone = phoneRaw;
  }

  let message = rawMessage;
  if (planLabel) {
    message = `[Interested in: ${planLabel} plan]\n\n${rawMessage}`;
  }

  if (message.length < 10) {
    return {
      ok: false,
      error: "Message must be at least 10 characters.",
    };
  }
  if (message.length > 500) {
    return {
      ok: false,
      error:
        "Message must be 500 characters or less (including any plan selection).",
    };
  }

  return {
    ok: true,
    data: {
      email,
      name,
      phone,
      company,
      message,
    },
  };
}
