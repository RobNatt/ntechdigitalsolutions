"use client";

import { GridWithDots } from "@/components/landingpages/BackgroundGridWithDots";
import LeadForm from "@/components/landingpages/MultiStepLeadForm";
import { ArrowRight, Check, Shield } from "lucide-react";

export default function LeadRoofingPage() {
  const scrollToForm = () => {
    document.getElementById("roof-qualification-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaButton = (
    <button
      onClick={scrollToForm}
      className="inline-flex items-center gap-2 px-6 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl"
    >
      Check My Roof for Hidden Storm Damage
      <ArrowRight className="w-5 h-5" />
    </button>
  );

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <GridWithDots
        gridSize={80}
        dotSize={3}
        lineColor="stroke-gray-800"
        dotColor="fill-gray-700"
        className="opacity-60"
      />
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-sky-600/90 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-sky-600 text-lg">
              NTS
            </div>
            <span className="text-white font-bold text-xl">Omaha Roof Check</span>
          </div>
          <button
            onClick={scrollToForm}
            className="px-4 py-2 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
          >
            Check My Roof
          </button>
        </header>

        {/* Main */}
        <main>
          {/* 1) Hero */}
          <section className="px-6 pt-10 lg:pt-16 pb-10 lg:pb-14 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-400/20 rounded-full text-sky-100 font-semibold text-sm">
                  Omaha Homeowners: Your Roof Might Already Be Damaged — You Just Can’t See It Yet
                </div>

                <h1 className="mt-5 text-3xl lg:text-5xl font-bold leading-tight">
                  Check for hidden storm damage before it turns into a big bill.
                </h1>

                <p className="mt-4 text-gray-300 text-lg">
                  Recent Omaha storms can cause damage that stays out of sight for months.
                </p>

                {/* Trust immediately */}
                <div className="mt-6 bg-slate-800/70 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold text-lg">
                        If there’s no real damage, we’ll tell you.
                      </p>
                      <p className="text-gray-300 mt-1">
                        No pressure. No obligation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
                  {ctaButton}
                </div>

                <ul className="mt-6 space-y-2 text-slate-200">
                  {["Free inspection", "Help with insurance claim guidance", "Homeowner only pays deductible (if approved)"].map(
                    (item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                        <span className="text-base">{item}</span>
                      </li>
                    )
                  )}
                </ul>

                {/* Anti-scam opener */}
                <p className="mt-6 text-sm text-gray-400">
                  Most roofing companies push replacements. We don’t recommend filing a claim unless it actually makes sense.
                </p>
              </div>

              {/* Visual placeholder */}
              <div className="relative">
                <div className="rounded-3xl border border-sky-400/20 bg-slate-900 overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-900 relative">
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute left-6 top-6 w-24 h-24 rounded-2xl bg-sky-500/20 blur-[1px]" />
                      <div className="absolute right-8 bottom-8 w-28 h-28 rounded-2xl bg-white/10 blur-[1px]" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                      <div className="px-4 py-2 bg-black/30 border border-white/10 rounded-full text-sky-100 font-semibold text-sm">
                        Inspection Visual (placeholder)
                      </div>
                      <p className="mt-4 text-white/90 font-bold text-lg">
                        Close-up hail damage / roof inspection
                      </p>
                      <p className="mt-2 text-gray-300 text-sm">
                        Replace this box with your photo or video later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2) Problem */}
          <section className="px-6 py-14 lg:py-18 bg-slate-800/70 border-t border-white/5 border-b border-white/5">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-center">
                Hidden storm damage is expensive when you wait.
              </h2>

              <div className="mt-8 grid md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex gap-3">
                      <Check className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base">
                        You can&apos;t always see it from the ground.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base">
                        Waiting can reduce your claim options.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base">
                        Small issues can turn into leaks and structural damage.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                  <p className="text-white font-semibold text-lg">
                    Storm damage claims can be denied if you wait too long.
                  </p>
                  <p className="text-gray-300 mt-2">
                    Recent Omaha storms have caused hidden roof damage that doesn&apos;t show up right away.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3) Solution */}
          <section className="px-6 py-14 lg:py-18">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-center">
                A free inspection + honest answers.
              </h2>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Inspect",
                    desc: "We check for storm-related damage you can’t see."
                  },
                  {
                    title: "Explain",
                    desc: "We show you what we find and what it means."
                  },
                  {
                    title: "Decide",
                    desc: "No pressure. You choose next steps."
                  },
                ].map((c, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
                    <p className="text-white font-semibold text-lg">{c.title}</p>
                    <p className="text-gray-300 mt-2 text-sm">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-sky-500/10 border border-sky-400/20 rounded-2xl p-6">
                <ul className="space-y-3 text-gray-200">
                  {[
                    "If it doesn’t make sense, we’ll say so.",
                    "Only recommend filing a claim when it actually helps.",
                    "Homeowner guidance — you know what you’re getting.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4) How it works */}
          <section className="px-6 py-14 lg:py-18 bg-slate-800/70">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-center">3 simple steps</h2>

              <div className="mt-10 grid md:grid-cols-3 gap-6">
                {[
                  { n: "1", title: "Fill out the form", desc: "Takes about 30 seconds." },
                  { n: "2", title: "We call you", desc: "We confirm the details and next step." },
                  { n: "3", title: "Get your answers", desc: "Honest options — no pressure." },
                ].map((s) => (
                  <div key={s.n} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-sky-500/80 flex items-center justify-center text-white font-bold mx-auto text-lg">
                      {s.n}
                    </div>
                    <p className="text-white font-semibold mt-4">{s.title}</p>
                    <p className="text-gray-300 mt-2 text-sm">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5) Trust builders */}
          <section className="px-6 py-14 lg:py-18">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-center">
                Trust matters. Here’s why homeowners feel safe.
              </h2>

              <div className="mt-10 grid lg:grid-cols-3 gap-6">
                {[
                  {
                    quote: "They told me the truth. No pressure. Just clear options.",
                    name: "Mark T.",
                  },
                  {
                    quote: "I didn’t know there was damage. Insurance helped — huge savings.",
                    name: "Lisa R.",
                  },
                  {
                    quote: "Fast, professional, and honest. I felt taken care of.",
                    name: "Daniel K.",
                  },
                ].map((t, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
                    <p className="text-slate-200/90">“{t.quote}”</p>
                    <p className="mt-4 font-semibold text-sky-300">— {t.name}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-6 items-start">
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
                  <p className="text-white font-semibold text-lg">Anti-scam clarity</p>
                  <ul className="mt-4 space-y-3 text-gray-200">
                    {[
                      "We don’t push replacements.",
                      "We only recommend filing a claim if it makes sense.",
                      "If there’s no real damage, we’ll tell you.",
                      "No obligation. No pressure.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-500/10 border border-sky-400/20 rounded-2xl p-6 text-center">
                  <p className="text-white font-semibold text-lg">
                    If it’s not worth it, you won’t be pushed into it.
                  </p>
                  <p className="text-gray-300 mt-2">
                    We’re here to help you make the right decision for your home.
                  </p>
                  <div className="mt-6">{ctaButton}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 6) CTA */}
          <section className="px-6 py-12 bg-slate-800/70 border-t border-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold">Ready for a real roof check?</h2>
              <p className="text-gray-300 mt-3">
                Omaha homeowners: check before waiting costs you options.
              </p>
              <div className="mt-6 flex justify-center">{ctaButton}</div>
            </div>
          </section>

          {/* 7) Form */}
          <section id="roof-qualification-form" className="px-6 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-400" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-sky-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Get your free storm damage check
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">
                    If there’s no real damage, we’ll tell you. No pressure.
                  </p>
                  <LeadForm variant="roof-qualification" />
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#0f0f0f] border-t border-gray-800 px-6 py-8">
          <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} N-Tech Digital Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
