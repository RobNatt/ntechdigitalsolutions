import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = {
  title: "Services | N-Tech Digital Solutions",
  description:
    "Websites, lead generation, automation, and SEO for small businesses — built to convert and scale.",
};

const OFFERINGS = [
  {
    title: "Websites & landing pages",
    body: "Fast, SEO-ready sites and high-converting landing pages tailored to your offers and local market.",
  },
  {
    title: "Lead generation & funnels",
    body: "Capture, qualify, and route leads with forms, tracking, and follow-up workflows that run on autopilot.",
  },
  {
    title: "Automation & integrations",
    body: "Connect your CRM, email, and ads so nothing falls through the cracks — from first click to booked call.",
  },
  {
    title: "SEO & performance",
    body: "Technical SEO, content structure, and speed so you rank where your customers are searching.",
  },
] as const;

export default function ServicesPage() {
  return (
    <MarketingPageShell
      title="Services"
      subtitle="Everything we deliver is aimed at one outcome: more qualified leads and a system that keeps working after launch."
    >
      <ul className="list-none space-y-8 p-0">
        {OFFERINGS.map((item) => (
          <li key={item.title}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="pt-4">
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Tell us what you&apos;re building
        </Link>
        {" — we&apos;ll recommend a practical starting point."}
      </p>
    </MarketingPageShell>
  );
}
