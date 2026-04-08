import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { Navbar } from "@/components/startup-landing/navbar";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const privacyDesc =
  "Privacy policy for N-Tech Digital Solutions: how we collect, use, and protect information when you use our website and services.";

export const metadata: Metadata = {
  title: "Privacy Policy | N-Tech Digital Solutions",
  description: privacyDesc,
  alternates: { canonical: canonicalUrl("/privacy-policy") },
  openGraph: ogForPath("/privacy-policy", "Privacy Policy | N-Tech Digital Solutions", privacyDesc),
};

export default async function PrivacyPolicyPage() {
  const filePath = path.join(process.cwd(), "PRIVACY-POLICY.md");
  const raw = await readFile(filePath, "utf8");
  const content = raw.replace(/^#\s+Privacy Policy\s*\n+/, "");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20 lg:pt-24">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
            <pre className="mt-6 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-800 md:text-base">
              {content}
            </pre>
          </div>
        </section>
      </main>
    </>
  );
}

