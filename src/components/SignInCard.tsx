"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "credentials" | "2fa";

export default function SignInCard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });
      const raw = await res.text();
      let data: { error?: string; hint?: string; step?: string; success?: boolean };
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        setError(
          "Sign-in returned an invalid response (not JSON). Hard-refresh the page or check the Network tab — a script or proxy may be serving the wrong file."
        );
        return;
      }

      if (!res.ok) {
        const hint = typeof data.hint === "string" ? data.hint : "";
        setError(
          hint ? `${data.error || "Sign-in failed"}\n${hint}` : data.error || "Sign-in failed"
        );
        return;
      }

      if (data.step === "2fa") {
        setStep("2fa");
      }
      if (data.step === "done") {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const raw2 = await res.text();
      let data: { error?: string; hint?: string };
      try {
        data = JSON.parse(raw2) as typeof data;
      } catch {
        setError("Verification returned an invalid response. Try signing in again.");
        return;
      }

      if (!res.ok) {
        const hint = typeof data.hint === "string" ? data.hint : "";
        setError(
          hint ? `${data.error || "Verification failed"}\n${hint}` : data.error || "Verification failed"
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("credentials");
    setCode("");
    setError("");
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-950/50">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {step === "credentials" ? "Welcome back" : "Verify your identity"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {step === "credentials"
            ? "Sign in with your login ID (or email if enabled) and password"
            : "Enter the code sent to your phone"}
        </p>
      </div>

      {step === "credentials" ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="loginId"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Login ID
            </label>
            <input
              id="loginId"
              type="text"
              autoComplete="username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=""
              className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>

          {error && (
            <p className="whitespace-pre-line text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-neutral-900"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handle2FASubmit} className="space-y-5">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
              className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-center text-lg tracking-[0.5em] text-neutral-900 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>

          {error && (
            <p className="whitespace-pre-line text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-neutral-900"
          >
            {isLoading ? "Verifying…" : "Verify"}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="w-full text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            ← Back to sign in
          </button>
        </form>
      )}
    </div>
  );
}
