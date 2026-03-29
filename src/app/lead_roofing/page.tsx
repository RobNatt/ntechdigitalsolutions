"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LeadForm from "@/components/landingpages/MultiStepLeadForm";
import { ArrowRight, Check, ShieldCheck, TriangleAlert } from "lucide-react";
import gsap from "gsap";

const painPoints = [
  "Small storm damage can become interior leaks within weeks.",
  "Many homeowners miss claim windows by waiting too long.",
  "Most damage is hard to spot from the ground.",
];

const processSteps = [
  { title: "Tell us about your roof", desc: "30-second form. No commitment." },
  { title: "Quick call from our team", desc: "We confirm details and schedule." },
  { title: "Get clear recommendations", desc: "Honest advice and documented findings." },
];

const faqs = [
  {
    q: "Is the inspection really free?",
    a: "Yes. The initial storm-damage inspection is free for Omaha-area homeowners.",
  },
  {
    q: "Will I be pressured to replace my roof?",
    a: "No. If replacement does not make sense, we will tell you directly.",
  },
  {
    q: "Do you help with insurance?",
    a: "Yes. When appropriate, we explain next steps and help you understand claim options.",
  },
];

export default function LeadRoofingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    document.getElementById("roof-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.16),transparent_30%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-500 font-bold text-slate-950">
              NT
            </div>
            <div>
              <p className="text-sm text-slate-300">N-Tech Digital Solutions</p>
              <p className="text-base font-semibold">Omaha Roof Damage Check</p>
            </div>
          </div>
          <button
            onClick={scrollToForm}
            className="rounded-lg bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Free Inspection
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
              <p className="reveal inline-flex items-center rounded-full border border-sky-300/30 bg-sky-500/10 px-4 py-2 text-base font-medium text-sky-200">
              Omaha homeowners: storm damage may already be costing you
            </p>
            <h1 className="reveal mt-5 text-4xl font-extrabold leading-tight lg:text-6xl">
              Stop guessing. Get a free roof damage inspection in 24-48 hours.
            </h1>
            <p className="reveal mt-5 max-w-2xl text-xl leading-relaxed text-slate-200">
              We inspect your roof, show you exactly what we find, and give honest next steps. If there is no real damage,
              we will tell you.
            </p>

            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-4 text-base font-bold text-slate-950 transition hover:bg-sky-400"
              >
                Check My Roof Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 text-base text-slate-200">
                No obligation. No high-pressure sales. Just clear answers.
              </p>
            </div>

            <ul className="reveal mt-8 space-y-3">
              {painPoints.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-slate-100">
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside id="roof-form" className="reveal rounded-2xl border border-sky-200/30 bg-white p-1 shadow-2xl shadow-sky-900/30">
            <div className="rounded-[14px] bg-white p-6">
              <div className="mb-4 flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-7 w-7 text-sky-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Get Your Free Roof Check</h2>
                  <p className="mt-1 text-base text-slate-700">Takes 30 seconds. We will follow up quickly.</p>
                </div>
              </div>
              <LeadForm variant="roof-qualification" />
            </div>
          </aside>
        </section>

        <section className="border-y border-white/10 bg-slate-900/70">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
            {[
              "Fast scheduling across Omaha metro",
              "Insurance guidance when it helps you",
              "Clear documentation and honest recommendations",
            ].map((item) => (
              <div key={item} className="reveal rounded-xl border border-white/10 bg-slate-950/70 p-5">
                <Check className="h-5 w-5 text-sky-300" />
                <p className="mt-3 text-lg text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="reveal text-center text-3xl font-bold lg:text-4xl">How it works</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="reveal rounded-2xl border border-white/10 bg-slate-900/50 p-6">
                <p className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 font-bold text-slate-950">
                  {index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-base text-slate-200">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="reveal rounded-3xl border border-sky-300/20 bg-gradient-to-r from-sky-500/20 to-cyan-500/10 p-8 text-center">
            <h2 className="text-3xl font-bold">If there is no damage, we will say so.</h2>
            <p className="mx-auto mt-3 max-w-3xl text-lg leading-relaxed text-slate-100">
              Homeowners choose us because we focus on what is right for the property, not what creates the biggest invoice.
            </p>
            <button
              onClick={scrollToForm}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-sky-400"
            >
              Start My Free Inspection
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.q} className="reveal rounded-xl border border-white/10 bg-slate-900/50 p-5">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-200">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-base text-slate-300 md:flex-row">
          <p>© {new Date().getFullYear()} N-Tech Digital Solutions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur md:hidden">
        <button
          onClick={scrollToForm}
          className="mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-base font-bold text-slate-950"
        >
          Get Free Roof Inspection
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
