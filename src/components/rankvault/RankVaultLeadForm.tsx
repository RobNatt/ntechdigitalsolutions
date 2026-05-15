"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { RANKVAULT_MONTHLY_REVENUE_OPTIONS } from "@/constants/rankvault";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25";

const INDUSTRY_OPTIONS = [
  "Epoxy Flooring",
  "Junk Removal",
  "Tree Services",
  "Spray Foam Insulation",
  "Concrete Leveling",
  "Commercial Cleaning",
  "Parking Lot Striping",
  "Other Local Service",
] as const;

type Status = "idle" | "loading" | "success" | "error";

export function RankVaultLeadForm() {
  const startedAt = useMemo(() => Date.now(), []);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/rankvault-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          email,
          phone,
          industry,
          monthlyRevenue,
          message,
          website,
          startedAt,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send your details. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setBusinessName("");
      setEmail("");
      setPhone("");
      setIndustry("");
      setMonthlyRevenue("");
      setMessage("");
      setWebsite("");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
        <p className="text-lg font-semibold text-emerald-200">Thanks - your RankVault request is in.</p>
        <p className="mt-2 text-sm text-emerald-100/90">
          We will review your market and follow up with next steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-emerald-200 underline underline-offset-4 hover:text-white"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-100">
          Name <span className="text-rose-400">*</span>
          <input
            className={inputClass}
            name="name"
            required
            autoComplete="name"
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-100">
          Business Name
          <input
            className={inputClass}
            name="businessName"
            autoComplete="organization"
            maxLength={200}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-100">
          Email <span className="text-rose-400">*</span>
          <input
            className={inputClass}
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={320}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-100">
          Phone <span className="text-rose-400">*</span>
          <input
            className={inputClass}
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-100">
          Industry <span className="text-rose-400">*</span>
          <select
            className={cn(inputClass, "cursor-pointer")}
            name="industry"
            required
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="">Select your industry</option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-100">
          Monthly Revenue <span className="text-rose-400">*</span>
          <select
            className={cn(inputClass, "cursor-pointer")}
            name="monthlyRevenue"
            required
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
          >
            <option value="">Select monthly revenue</option>
            {RANKVAULT_MONTHLY_REVENUE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-100">
        Message <span className="text-rose-400">*</span>
        <textarea
          className={cn(inputClass, "min-h-[130px] resize-y")}
          name="message"
          required
          rows={5}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us your target city, service focus, and what lead volume you're aiming for."
        />
      </label>

      <label className="hidden" aria-hidden>
        Leave this field empty
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending...
          </>
        ) : (
          "See If Your Market Qualifies"
        )}
      </button>
    </form>
  );
}
