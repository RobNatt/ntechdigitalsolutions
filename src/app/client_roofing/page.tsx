"use client";

import Link from "next/link";
import { GridWithDots } from "@/components/landingpages/BackgroundGridWithDots";
import LeadForm from "@/components/landingpages/MultiStepLeadForm";
import { Check, ArrowRight, Shield } from "lucide-react";

export default function ClientRoofingPage() {
  const scrollToForm = () => {
    document.getElementById("roofer-qualification-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaButton = (
    <button
      onClick={scrollToForm}
      className="inline-flex items-center gap-2 px-6 py-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl"
    >
      👉 See If You Qualify For Exclusive Leads
      <ArrowRight className="w-5 h-5" />
    </button>
  );

  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
      <GridWithDots
        gridSize={80}
        dotSize={3}
        lineColor="stroke-slate-700"
        dotColor="fill-slate-600"
        className="opacity-60"
      />
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-sky-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-sky-600 text-lg">
              NTS
            </div>
            <span className="text-white font-bold text-xl">N-Tech Digital Solutions</span>
          </div>
          <button
            onClick={scrollToForm}
            className="px-4 py-2 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
          >
            Check Availability
          </button>
        </header>

        {/* Hero */}
        <section className="px-6 py-16 lg:py-24 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Still Paying $200–$500 Per Lead… With No Guarantee They Even Close?
              </h1>
              <p className="text-slate-300 text-lg mb-8">
                We help roofing companies generate exclusive, high-intent storm damage & roof
                replacement leads — often at a fraction of what you&apos;re paying now.
              </p>
              {ctaButton}
              <p className="text-slate-400 text-sm mt-6">
                No long-term contracts. No junk leads. No BS.
              </p>
            </div>

            {/* Lead Form */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-400" />
              <div className="p-8">
                <LeadForm variant="roofer-qualification" />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              If you&apos;ve tried lead gen before… you already know the problem
            </h2>
            <div className="space-y-6 text-slate-300 text-lg">
              <p className="text-xl font-medium text-white">Let me guess:</p>
              <ul className="space-y-4 list-disc list-inside">
                <li>You&apos;re buying leads that 5 other roofers also get</li>
                <li>Half the &quot;leads&quot; don&apos;t even pick up</li>
                <li>The ones that do? Not serious… or already working with someone else</li>
                <li>And somehow… you&apos;re still paying premium prices</li>
              </ul>
              <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-lg mt-8">
                <p className="text-xl font-semibold text-white">
                  It&apos;s not that lead gen doesn&apos;t work.
                </p>
                <p className="text-lg text-slate-300 mt-2">
                  It&apos;s that most of it is built to benefit the platform — not you.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">{ctaButton}</div>
          </div>
        </section>

        {/* The Shift - Offer Positioning */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              This Isn&apos;t Shared Leads. This Is Controlled Demand.
            </h2>
            <p className="text-slate-300 text-lg mb-8 text-center">
              We don&apos;t sell the same lead 5 times. We generate exclusive inbound opportunities
              from homeowners actively looking for:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Storm damage inspections",
                "Low-cost roof replacements",
                "Insurance-covered repairs",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <Check className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-300 text-lg mb-8 text-center">
              Then route them directly to you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Exclusive leads (not resold)",
                "Homeowners in your service area",
                "High intent — not tire kickers",
                "Consistent flow (not random spikes)",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <Check className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sky-400 font-semibold text-lg text-center mb-10">
              You&apos;re not chasing jobs… they&apos;re coming to you.
            </p>
            <div className="text-center">{ctaButton}</div>
          </div>
        </section>

        {/* Math & Logic Section */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              Let&apos;s Just Run the Numbers
            </h2>
            <div className="space-y-6 text-slate-300 text-lg">
              <p>Most roofers we talk to are paying:</p>
              <ul className="space-y-2">
                <li><span className="text-sky-400 font-bold">$200–$500</span> per lead</li>
                <li>Closing maybe <span className="font-medium">1 out of 10</span> (if that&apos;s generous)</li>
              </ul>
              <p className="text-xl font-medium text-white">That means:</p>
              <p className="text-2xl font-bold text-sky-400">
                👉 You&apos;re spending $2,000–$5,000 per deal
              </p>
              <p className="mt-8">Now compare that to this:</p>
              <ul className="space-y-2">
                <li>Lower cost per lead</li>
                <li>Higher intent (storm damage = urgency)</li>
                <li>Better close rates</li>
              </ul>
              <p className="text-lg">
                Even a small improvement… can mean <span className="text-sky-400 font-bold">2–3X more revenue</span> from the same spend.
              </p>
              <div className="bg-slate-900 border-l-4 border-sky-400 p-6 rounded-r-lg mt-8">
                <p className="text-xl font-semibold text-white">
                  This isn&apos;t about getting more leads.
                </p>
                <p className="text-lg text-slate-300 mt-2">
                  It&apos;s about getting profitable leads.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">{ctaButton}</div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
              What Other Roofers Are Saying
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "First week we got 9 leads — closed 2 already. Way better than anything we've tried.",
                  name: "Mike, TX",
                },
                {
                  quote:
                    "These aren't Facebook tire kickers. People actually want help.",
                  name: "Jason, FL",
                },
                {
                  quote:
                    "I was skeptical… but the ROI made sense fast.",
                  name: "Carlos, AZ",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-600"
                >
                  <p className="text-slate-300 mb-4">&quot;{t.quote}&quot;</p>
                  <p className="font-semibold text-sky-400">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Objection Killer */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
              Why Most Roofers Stick With Us
            </h2>
            <ul className="space-y-4 mb-8">
              {[
                "No long-term contracts",
                "No shared leads — ever",
                "You control your service area",
                "Scalable based on your capacity",
                "Transparent tracking (you see everything)",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <Check className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-slate-900 rounded-xl p-6 text-center border border-slate-600">
              <p className="text-xl text-slate-300">
                If it doesn&apos;t make you money, it doesn&apos;t make sense for either of us.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              How It Works (Simple)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {[
                { step: "1", title: "We set up your service area + targeting" },
                { step: "2", title: "We launch campaigns bringing in homeowner inquiries" },
                { step: "3", title: "You receive exclusive leads in real time" },
                { step: "4", title: "You close deals — we scale what works" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <p className="text-slate-300">{item.title}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-lg">
              No complicated setup. No tech headaches.
            </p>
          </div>
        </section>

        {/* Qualification Angle */}
        <section className="px-6 py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
              Not Every Roofer Gets In
            </h2>
            <p className="text-slate-300 text-lg mb-6 text-center">
              We only work with a limited number of contractors per area.
            </p>
            <p className="text-slate-300 text-lg mb-6 text-center">
              <strong className="text-white">Why?</strong> Because exclusivity only works if we protect the lead flow.
            </p>
            <p className="text-slate-300 text-lg text-center">
              If your area is open — you&apos;re in. If not — we&apos;ll tell you straight.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section id="roofer-qualification-form" className="px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-400" />
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-8 h-8 text-sky-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Check If Your Area Is Available
                  </h2>
                </div>
                <LeadForm variant="roofer-qualification" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-700 px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-sky-600 text-lg">
                NTS
              </div>
              <span className="font-bold text-xl">N-Tech Digital Solutions</span>
            </div>
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} N-Tech Digital Solutions. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-slate-300 text-sm">Privacy</Link>
              <Link href="#" className="text-slate-400 hover:text-slate-300 text-sm">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
