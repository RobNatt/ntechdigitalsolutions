"use client";

import { GridWithDots } from "@/components/landingpages/BackgroundGridWithDots";
import LeadForm from "@/components/landingpages/MultiStepLeadForm";
import { Check, ArrowRight, Shield } from "lucide-react";

export default function LeadRoofingPage() {
  const scrollToForm = () => {
    document.getElementById("roof-qualification-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaButton = (
    <button
      onClick={scrollToForm}
      className="inline-flex items-center gap-2 px-6 py-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl"
    >
      👉 YES — Check If My Roof Qualifies (Free)
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
        <header className="bg-sky-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-sky-600 text-lg">
              NTS
            </div>
            <span className="text-white font-bold text-xl">Roof Qualification Check</span>
          </div>
          <button
            onClick={scrollToForm}
            className="px-4 py-2 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
          >
            Check My Roof
          </button>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-16 lg:py-24 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Your Roof Might Already Be Damaged… You Just Can&apos;t See It Yet.
          </h1>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
            Storm damage could qualify you for a low-cost or fully covered roof replacement — most
            homeowners don&apos;t even realize it.
          </p>
          {ctaButton}
        </section>

        {/* Problem Section */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              Tired of &quot;waiting until it&apos;s obvious&quot;… and paying way more later?
            </h2>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>Most homeowners don&apos;t act until there&apos;s a leak.</p>
              <p className="text-xl font-medium text-white">But by then?</p>
              <ul className="space-y-4 list-disc list-inside">
                <li>Minor storm damage turns into $8K–$15K out-of-pocket repairs</li>
                <li>Insurance claims get harder to approve</li>
                <li>Small issues quietly become structural problems</li>
              </ul>
              <p className="text-xl font-medium text-white">
                And the worst part… You probably wouldn&apos;t notice it from the ground.
              </p>
              <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-lg mt-8">
                <p className="text-xl font-semibold text-white">
                  This isn&apos;t about &quot;getting a new roof.&quot;
                </p>
                <p className="text-lg text-gray-300 mt-2">
                  It&apos;s about not getting stuck with a massive bill later.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">{ctaButton}</div>
          </div>
        </section>

        {/* Smarter Way Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              A Smarter Way Homeowners Are Handling Roof Damage
            </h2>
            <p className="text-gray-300 text-lg mb-8 text-center">
              Instead of waiting for visible damage… Homeowners are getting fast, no-pressure
              inspections to see if they qualify for:
            </p>
            <ul className="space-y-3 mb-12">
              {["Low-cost repairs", "Insurance-covered replacements", "Or zero action needed (peace of mind)"].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200">
                    <Check className="w-6 h-6 text-sky-400 flex-shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <div className="bg-slate-800 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">How it works:</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <span>Request a quick inspection (free)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <span>We assess storm damage + eligibility</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <span>You get clear options — no pressure, no obligation</span>
                </li>
              </ol>
              <p className="mt-6 text-sky-400 font-semibold text-lg">
                Most people are surprised by what actually qualifies.
              </p>
            </div>
            <div className="text-center">{ctaButton}</div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
              Join Hundreds of Homeowners Who Checked Before It Was Too Late
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "I had no idea there was damage. Insurance covered most of it — saved me thousands.",
                  name: "Mark T.",
                },
                {
                  quote:
                    "They showed me everything. No pressure at all. Just honest info.",
                  name: "Lisa R.",
                },
                {
                  quote:
                    "Took 10 minutes and gave me peace of mind I didn't know I needed.",
                  name: "Daniel K.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-600"
                >
                  <p className="text-slate-300 mb-4">&quot;{t.quote}&quot;</p>
                  <p className="font-semibold text-sky-400">— {t.name}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">{ctaButton}</div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
              Why Homeowners Trust Us With Something This Important
            </h2>
            <ul className="space-y-4 mb-8">
              {[
                "Free inspections — no obligation",
                "We work directly with insurance (so you don't have to)",
                "No upfront costs for qualified homeowners",
                "Local experts — not a call center",
                "No pushy sales tactics. Ever.",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <Check className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-600">
              <p className="text-xl text-gray-300">
                If there&apos;s no real damage, we&apos;ll tell you. Simple as that.
              </p>
            </div>
            <div className="text-center mt-10">{ctaButton}</div>
          </div>
        </section>

        {/* How to Get Started */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              How Do I Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-12 text-center">
              Takes less time than scrolling your phone.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { step: "1", title: "Enter your info", desc: "30 seconds" },
                { step: "2", title: "Schedule a quick inspection", desc: "We'll reach out" },
                { step: "3", title: "Get real answers", desc: "And decide from there" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-lg">
              No spam. No pressure. Just clarity.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section id="roof-qualification-form" className="px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-400" />
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-8 h-8 text-sky-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Find Out If Your Roof Qualifies in Minutes
                  </h2>
                </div>
                <LeadForm variant="roof-qualification" />
              </div>
            </div>
          </div>
        </section>

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
