"use client";

import { useCallback, useState } from "react";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";

type ChatMsg = { role: "user" | "assistant"; content: string };

type ChatContactFormProps = {
  messages: ChatMsg[];
};

function buildInquiryMessage(
  messages: ChatMsg[],
  fields: {
    businessSummary: string;
    websiteUrl: string;
    company: string;
    phone: string;
  }
): string {
  const lines: string[] = [];
  lines.push("[Site chat — ntechdigital.solutions]");
  lines.push("");
  if (fields.company.trim()) {
    lines.push(`Company: ${fields.company.trim()}`);
  }
  if (fields.websiteUrl.trim()) {
    lines.push(`Website: ${fields.websiteUrl.trim()}`);
  }
  if (fields.phone.trim()) {
    lines.push(`Phone: ${fields.phone.trim()}`);
  }
  if (fields.businessSummary.trim()) {
    lines.push("");
    lines.push("What they told us about their business / goals:");
    lines.push(fields.businessSummary.trim());
  }
  lines.push("");
  lines.push("Recent chat transcript:");
  const transcript = messages
    .slice(-24)
    .map((m) =>
      m.role === "user"
        ? `Visitor: ${m.content}`
        : `Assistant: ${m.content}`
    )
    .join("\n");
  lines.push(transcript.slice(0, 7000));

  let body = lines.join("\n").trim();
  if (body.length < 10) {
    body = `${body}\n\nVisitor requested follow-up from the site chat.`;
  }
  return body.slice(0, 8000);
}

export function ChatContactForm({ messages }: ChatContactFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessSummary, setBusinessSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const message = buildInquiryMessage(messages, {
        businessSummary,
        websiteUrl,
        company,
        phone,
      });
      if (message.length < 10) {
        setError("Please add a bit more detail so we can help.");
        return;
      }

      setSubmitting(true);
      try {
        const sourcePage =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search || ""}`
            : "/";

        const analyticsIds = readAnalyticsClientIds();

        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            company: company.trim() || undefined,
            phone: phone.trim() || undefined,
            message,
            sourcePage,
            ...analyticsIds,
          }),
        });

        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (!res.ok) {
          throw new Error(data?.error || `Request failed (${res.status})`);
        }

        setSuccess(true);
        setOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not send. Try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [messages, name, email, company, phone, websiteUrl, businessSummary]
  );

  if (success) {
    return (
      <div className="border-t border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
        <p className="font-medium">Thanks — we received your details.</p>
        <p className="mt-1 text-muted-foreground">
          Someone from Ntech will reach out using the email you provided.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-muted/30">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full px-4 py-3 text-left text-sm font-medium text-primary transition hover:bg-muted/80"
        >
          Share contact info with the team →
        </button>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 px-4 py-3">
          <p className="text-xs font-medium text-foreground">
            We&apos;ll follow up using this info (and your chat above).
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-xs text-muted-foreground">
              Name *
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                autoComplete="name"
                disabled={submitting}
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Email *
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                autoComplete="email"
                disabled={submitting}
              />
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-xs text-muted-foreground">
              Company
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                autoComplete="organization"
                disabled={submitting}
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                autoComplete="tel"
                disabled={submitting}
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Website URL (if you have one)
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://"
              className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
              inputMode="url"
              disabled={submitting}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Business & goals (short summary)
            <textarea
              value={businessSummary}
              onChange={(e) => setBusinessSummary(e.target.value)}
              rows={3}
              placeholder="What you do, who you serve, what you want to improve…"
              className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground"
              disabled={submitting}
            />
          </label>
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send to Ntech"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
