import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Conversion LP — Pro offer: $4,997 + $499/mo. CTAs → /contact?plan=pro */
const COLORS = {
  trust: "#1E3A5F",
  action: "#2563EB",
  cta: "#22C55E",
  text: "#111827",
  bg: "#F9FAFB",
  border: "#E5E7EB",
} as const;

const CONTACT_PRO = "/contact?plan=pro";

function Headline({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "font-semibold tracking-tight [font-family:var(--font-gsl-head),ui-sans-serif,system-ui,sans-serif]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

function PrimaryCta({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2",
        className
      )}
      style={{ backgroundColor: COLORS.cta, outlineColor: COLORS.action }}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
    </Link>
  );
}

function SecondaryCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border-2 px-6 py-3.5 text-base font-semibold transition hover:bg-white/80"
      style={{ borderColor: COLORS.action, color: COLORS.action }}
    >
      {children}
    </Link>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-base leading-relaxed" style={{ color: COLORS.text }}>
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: COLORS.action }}
      >
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function GrowthSystemLanding() {
  return (
    <div style={{ backgroundColor: COLORS.bg }}>
      {/* 1. HERO */}
      <section
        className="border-b px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
        style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-14">
          <div>
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: COLORS.trust }}
            >
              Full lead system · Local + SEO
            </p>
            <Headline
              as="h1"
              className="text-3xl leading-[1.15] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
              style={{ color: COLORS.trust }}
            >
              Stop Paying for Clicks That Never Turn Into Real Leads
            </Headline>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#374151]">
              We build the full front-end system — from first click to booked conversation — so
              you&apos;re not chasing cold form fills anymore.
            </p>
            <ul className="mt-8 space-y-3">
              <Bullet>Capture + qualify leads automatically</Bullet>
              <Bullet>Follow-up handled via SMS + email</Bullet>
              <Bullet>See every lead in your pipeline clearly</Bullet>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={CONTACT_PRO}>Book Your Strategy Call</PrimaryCta>
            </div>
            <p className="mt-4 text-sm text-[#6B7280]">
              No pressure. No long-term commitment required to get started.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 lg:max-w-none lg:justify-self-end">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
              alt="Business owner on a phone call"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="mx-auto max-w-3xl text-center">
          <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
            Most Businesses Don&apos;t Have a Lead Problem — They Have a System Problem
          </Headline>
          <p className="mt-6 text-left text-lg font-medium text-[#374151]">You&apos;re already getting clicks.</p>
          <p className="mt-2 text-left text-lg font-medium text-[#374151]">But what happens after?</p>
          <ul className="mt-8 space-y-3 text-left text-base text-[#4B5563]">
            <li>Leads don&apos;t respond</li>
            <li>You forget to follow up</li>
            <li>You can&apos;t tell which leads are serious</li>
            <li>Your website just… sits there</li>
          </ul>
          <p className="mt-8 text-left text-lg font-medium" style={{ color: COLORS.trust }}>
            So you end up paying for attention — not actual opportunities.
          </p>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-y px-4 py-16 sm:px-6 sm:py-20" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 lg:mb-0">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
              alt="Laptop with analytics and pipeline work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
              We Don&apos;t Just Build Websites — We Build Lead Systems
            </Headline>
            <p className="mt-4 text-base leading-relaxed text-[#374151]">
              This isn&apos;t another redesign. It&apos;s the system that turns traffic into qualified
              conversations.
            </p>
            <p className="mt-6 font-semibold" style={{ color: COLORS.trust }}>
              What You Get:
            </p>
            <ul className="mt-4 space-y-3">
              <Bullet>Multi-page funnel designed to convert (not just look good)</Bullet>
              <Bullet>Lead capture + automated qualification</Bullet>
              <Bullet>SMS + email follow-up so leads don&apos;t go cold</Bullet>
              <Bullet>CRM + pipeline to track every opportunity</Bullet>
              <Bullet>Dashboard so you always know what&apos;s working</Bullet>
            </ul>
            <div className="mt-8">
              <SecondaryCta href={CONTACT_PRO}>See If You Qualify</SecondaryCta>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="mx-auto max-w-4xl">
          <Headline as="h2" className="text-center text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
            Simple. Clear. Built to Run Without You Chasing Leads
          </Headline>
          <ol className="mt-12 space-y-8">
            {[
              { n: "1", t: "We build your funnel + backend system" },
              { n: "2", t: "Traffic comes in (ads, Google, SEO)" },
              { n: "3", t: "Leads are captured, qualified, and followed up automatically" },
              { n: "4", t: "You get notified when someone is actually ready to talk" },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.trust }}
                >
                  {step.n}
                </span>
                <p className="pt-1.5 text-lg font-medium text-[#374151]">{step.t}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center text-lg font-semibold" style={{ color: COLORS.action }}>
            Not more leads. Better ones.
          </p>
        </div>
      </section>

      {/* 5. MATH */}
      <section className="border-t px-4 py-16 sm:px-6 sm:py-20" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-3xl">
          <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
            Let&apos;s Just Look at the Numbers
          </Headline>
          <p className="mt-6 text-base leading-relaxed text-[#374151]">
            If you&apos;re already paying for traffic or leads…
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#4B5563]">
            <li>Some percentage never respond</li>
            <li>Some aren&apos;t qualified</li>
            <li>Some slip through the cracks</li>
          </ul>
          <p className="mt-6 font-semibold" style={{ color: COLORS.trust }}>
            That&apos;s not a traffic issue. That&apos;s a system leak.
          </p>
          <div
            className="mt-8 rounded-xl border p-6 sm:p-8"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          >
            <p className="font-semibold" style={{ color: COLORS.trust }}>
              Your System Fix:
            </p>
            <ul className="mt-4 space-y-2 text-[#374151]">
              <li>Better conversion from the same traffic</li>
              <li>Automated follow-up = fewer lost opportunities</li>
              <li>Clear pipeline = no guessing</li>
            </ul>
            <p className="mt-6 text-base font-medium text-[#374151]">
              You&apos;re not spending more. You&apos;re making what you already spend actually work.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SEO + GEO */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
              Built to Bring In Consistent Local Demand
            </Headline>
            <ul className="mt-8 space-y-3">
              <Bullet>Google Business Profile optimization</Bullet>
              <Bullet>Local SEO targeting your service area</Bullet>
              <Bullet>Ongoing monitoring (Google + Bing)</Bullet>
              <Bullet>2 SEO assets per month (blogs or location pages)</Bullet>
            </ul>
            <p className="mt-6 text-base font-medium text-[#374151]">
              So you&apos;re not relying only on ads.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md ring-1 ring-black/5">
            <Image
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
              alt="Map and local area concept"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* 7. OPTIMIZATION + SMS visual */}
      <section className="border-y px-4 py-16 sm:px-6 sm:py-20" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative order-2 aspect-[3/4] max-h-[420px] w-full max-w-sm justify-self-center overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
              alt="Phone with notifications — new lead coming in"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 280px, 320px"
            />
          </div>
          <div className="order-1 lg:order-2">
            <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
              This Isn&apos;t &quot;Set It and Forget It&quot;
            </Headline>
            <ul className="mt-6 space-y-3 text-[#374151]">
              <li>Quarterly landing page refresh based on real data</li>
              <li>Ongoing A/B testing</li>
              <li>Dedicated account manager</li>
              <li>Monthly strategy calls</li>
              <li>Priority support (~48-hour response)</li>
            </ul>
            <p className="mt-6 text-lg font-semibold" style={{ color: COLORS.action }}>
              We don&apos;t just build it. We improve it.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TRUST */}
      <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="mx-auto max-w-3xl">
          <Headline as="h2" className="text-center text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
            No Hype. Just a System That Makes Sense
          </Headline>
          <p className="mt-6 text-center text-[#374151]">You&apos;ve probably seen:</p>
          <ul className="mx-auto mt-4 max-w-lg list-disc space-y-2 pl-5 text-[#4B5563]">
            <li>Agencies selling &quot;more leads&quot; with no backend</li>
            <li>Websites that look good but don&apos;t convert</li>
            <li>Tools you have to figure out yourself</li>
          </ul>
          <p className="mt-8 text-center text-lg font-semibold" style={{ color: COLORS.trust }}>
            This is different.
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>Built for real service businesses</Bullet>
            <Bullet>Focused on qualified leads — not vanity metrics</Bullet>
            <Bullet>Clear process, clear deliverables</Bullet>
          </ul>
        </div>
      </section>

      {/* 9. OFFER */}
      <section className="border-t px-4 py-16 sm:px-6 sm:py-20" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-2xl text-center">
          <Headline as="h2" className="text-2xl sm:text-3xl" style={{ color: COLORS.trust }}>
            Built for Businesses Ready to Fix the System — Not Patch It
          </Headline>
          <div
            className="mt-10 rounded-2xl border-2 p-8 sm:p-10"
            style={{ borderColor: COLORS.trust, backgroundColor: COLORS.bg }}
          >
            <p className="text-lg">
              <span className="font-semibold text-[#374151]">Setup:</span>{" "}
              <span className="text-2xl font-bold tabular-nums" style={{ color: COLORS.trust }}>
                $4,997
              </span>
            </p>
            <p className="mt-2 text-lg">
              <span className="font-semibold text-[#374151]">Ongoing:</span>{" "}
              <span className="text-2xl font-bold tabular-nums" style={{ color: COLORS.trust }}>
                $499/month
              </span>
            </p>
            <p className="mt-8 font-semibold" style={{ color: COLORS.trust }}>
              Includes:
            </p>
            <ul className="mt-4 space-y-2 text-left text-[#374151]">
              <li>Full funnel + CRM setup</li>
              <li>Automation (SMS + email)</li>
              <li>SEO + local optimization</li>
              <li>Ongoing improvements + support</li>
            </ul>
          </div>
          <div
            className="mt-8 rounded-xl border p-6 text-left text-sm leading-relaxed text-[#4B5563]"
            style={{ borderColor: COLORS.border }}
          >
            <strong className="text-[#374151]">If you&apos;re already spending on ads, leads, or marketing…</strong>
            <p className="mt-2">
              This replaces the part that&apos;s not working — it doesn&apos;t just add another expense.
            </p>
          </div>
          <div className="mt-10">
            <PrimaryCta href={CONTACT_PRO}>Book Your Strategy Call</PrimaryCta>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-20"
        style={{ backgroundColor: COLORS.trust, color: "#fff" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <Headline as="h2" className="text-2xl text-white sm:text-3xl">
            See If This Makes Sense for Your Business
          </Headline>
          <p className="mt-6 text-base leading-relaxed text-sky-100/95">
            We&apos;ll walk through your current setup, where leads are leaking, and whether this system
            fits.
          </p>
          <div className="mt-10">
            <Link
              href={CONTACT_PRO}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-semibold shadow-md transition hover:bg-sky-50"
              style={{ color: COLORS.trust }}
            >
              <Phone className="h-4 w-4" aria-hidden />
              Book Your Strategy Call
            </Link>
          </div>
          <p className="mt-4 text-sm text-sky-200/90">No pressure. Just clarity on your next step.</p>
        </div>
      </section>
    </div>
  );
}
