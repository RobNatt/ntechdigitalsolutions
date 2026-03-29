"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PlanId = "starter" | "growth" | "pro" | null;

function normalizePlan(v: string | null): PlanId {
  if (!v) return null;
  const x = v.toLowerCase().trim();
  if (x === "starter" || x === "growth" || x === "pro") return x;
  return null;
}

export function ContactLeadForm() {
  const searchParams = useSearchParams();
  const planFromUrl = useMemo(
    () => normalizePlan(searchParams.get("plan")),
    [searchParams]
  );

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<PlanId>(planFromUrl);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPlan(planFromUrl);
  }, [planFromUrl]);

  const messageMax = plan ? 445 : 500;

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("submitting");
      setErrorMessage("");
      try {
        const res = await fetch("/api/lead-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            phone,
            company,
            message,
            ...(plan ? { plan } : {}),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Something went wrong.");
          return;
        }
        setStatus("success");
        setEmail("");
        setName("");
        setPhone("");
        setCompany("");
        setMessage("");
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    },
    [email, name, phone, company, message, plan]
  );

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-emerald-500/40 bg-emerald-50/80 px-6 py-10 text-center dark:border-emerald-500/30 dark:bg-emerald-950/40"
        role="status"
      >
        <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          Thanks — we received your message.
        </p>
        <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/90">
          Our team will follow up shortly. You can send another note below if
          you need to add details.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-sky-600 underline hover:text-sky-500 dark:text-sky-400"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 text-left"
      noValidate
    >
      {plan && (
        <div className="rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sm dark:border-sky-500/30 dark:bg-sky-950/40">
          <span className="font-medium text-sky-900 dark:text-sky-100">
            Plan:{" "}
            <span className="capitalize">{plan}</span>
          </span>
          <button
            type="button"
            className="ml-2 text-sky-600 underline hover:text-sky-500 dark:text-sky-400"
            onClick={() => setPlan(null)}
          >
            Change
          </button>
        </div>
      )}

      {!plan && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Interested plan (optional)
          </label>
          <select
            className={cn(
              "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
              "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            )}
            value=""
            onChange={(e) => {
              const v = e.target.value;
              if (v === "starter" || v === "growth" || v === "pro") setPlan(v);
            }}
          >
            <option value="">Select a plan…</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="lead-email"
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Business email <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={cn(
            "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
            "placeholder:text-neutral-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          )}
        />
        <p className="mt-1 text-xs text-neutral-500">
          Please use your work email address.
        </p>
      </div>

      <div>
        <label
          htmlFor="lead-name"
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
            "focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="lead-phone"
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Phone
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className={cn(
            "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
            "focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="lead-company"
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Company
        </label>
        <input
          id="lead-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Optional"
          className={cn(
            "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
            "focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="lead-message"
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          required
          rows={5}
          maxLength={messageMax}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project or inquiry."
          className={cn(
            "mt-1.5 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm",
            "focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          )}
        />
        <p className="mt-1 text-xs text-neutral-500">
          {message.length}/{messageMax} characters
          {plan ? " (plan tag reserved in limit)" : ""}
        </p>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "rounded-lg bg-gradient-to-b from-sky-400 to-sky-600 px-6 py-2.5 text-sm font-bold text-neutral-950",
            "shadow-sm hover:from-sky-300 hover:to-sky-500 disabled:opacity-60"
          )}
        >
          {status === "submitting" ? "Sending…" : "Submit"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          onClick={() => {
            setEmail("");
            setName("");
            setPhone("");
            setCompany("");
            setMessage("");
            setPlan(planFromUrl);
          }}
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Submissions are processed by our{" "}
        <a
          href="https://lead-processing-agent-sandy-omega.vercel.app"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-sky-600 underline hover:text-sky-500 dark:text-sky-400"
        >
          lead workflow
        </a>
        .
      </p>
    </form>
  );
}
