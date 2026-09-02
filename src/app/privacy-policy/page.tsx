import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { SiteNav } from "@/components/ntech/SiteNav";
import { SiteFooter } from "@/components/ntech/SiteFooter";
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
      <SiteNav />
      <main id="main" className="bg-field">
        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border border-rule bg-white p-6 sm:p-9">
            <h1 className="type-display text-[2rem] text-ink sm:text-[2.5rem]">Privacy Policy</h1>
            <pre className="mt-7 whitespace-pre-wrap break-words font-sans text-[0.9375rem] leading-7 text-muted-ink">
              {content}
            </pre>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

