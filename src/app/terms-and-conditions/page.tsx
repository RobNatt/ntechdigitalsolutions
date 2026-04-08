import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { Navbar } from "@/components/startup-landing/navbar";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const termsDesc =
  "Terms and conditions for using N-Tech Digital Solutions websites, services, and deliverables.";

export const metadata: Metadata = {
  title: "Terms and Conditions | N-Tech Digital Solutions",
  description: termsDesc,
  alternates: { canonical: canonicalUrl("/terms-and-conditions") },
  openGraph: ogForPath(
    "/terms-and-conditions",
    "Terms and Conditions | N-Tech Digital Solutions",
    termsDesc
  ),
};

export default async function TermsAndConditionsPage() {
  const filePath = path.join(process.cwd(), "TERMS-AND-CONDITIONS.md");
  const raw = await readFile(filePath, "utf8");
  const content = raw.replace(/^#\s+Terms and Conditions\s*\n+/, "");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20 lg:pt-24">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Terms and Conditions
            </h1>
            <pre className="mt-6 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-800 md:text-base">
              {content}
            </pre>
          </div>
        </section>
      </main>
    </>
  );
}

