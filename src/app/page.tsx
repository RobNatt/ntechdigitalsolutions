import Link from "next/link";
import { ArrowRight, Home, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-600 rounded flex items-center justify-center font-bold text-white text-lg">
              NTS
            </div>
            <span className="font-bold text-xl text-slate-800">nTech Digital Solutions</span>
          </div>
          <Link
            href="/signin"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
          Roofing Leads That Actually Close
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          We connect homeowners with storm damage to qualified roofers — and help contractors
          fill their pipeline with exclusive, high-intent leads.
        </p>

        {/* Two paths */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link
            href="/lead_roofing"
            className="group block p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center mb-4 group-hover:bg-sky-500 transition-colors">
              <Home className="w-7 h-7 text-sky-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Homeowner</h2>
            <p className="text-slate-600 mb-4">
              Check if your roof qualifies for low-cost or insurance-covered repair.
            </p>
            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold group-hover:gap-3 transition-all">
              Check my roof <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/client_roofing"
            className="group block p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center mb-4 group-hover:bg-sky-500 transition-colors">
              <Building2 className="w-7 h-7 text-sky-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Roofer</h2>
            <p className="text-slate-600 mb-4">
              Get exclusive leads in your service area. No shared leads, no junk.
            </p>
            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold group-hover:gap-3 transition-all">
              Check availability <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} nTech Digital Solutions. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
