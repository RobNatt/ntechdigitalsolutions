import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { SiteNav } from "@/components/ntech/SiteNav";
import { SiteFooter } from "@/components/ntech/SiteFooter";
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
      <SiteNav />
      <main id="main" className="bg-field">
        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border border-rule bg-white p-6 sm:p-9">
            <h1 className="type-display text-[2rem] text-ink sm:text-[2.5rem]">
              Terms and Conditions
            </h1>
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

