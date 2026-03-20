import { readFile } from "node:fs/promises";
import path from "node:path";

export const metadata = {
  title: "Privacy Policy | nTech Digital Solutions",
};

export default async function PrivacyPolicyPage() {
  const filePath = path.join(process.cwd(), "PRIVACY-POLICY.md");
  const content = await readFile(filePath, "utf8");

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm">
          <pre className="whitespace-pre-wrap break-words text-slate-800 text-sm md:text-base leading-7 font-sans">
            {content}
          </pre>
        </div>
      </section>
    </main>
  );
}

