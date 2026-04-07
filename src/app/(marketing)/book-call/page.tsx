import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { BookCallForm } from "@/components/marketing/BookCallForm";

export const metadata: Metadata = {
  title: "Book a Call | N-Tech Digital Solutions",
  description:
    "Book a phone call with Robert Nattrass at N-Tech. Available starting next day with focused business-hour windows.",
};

type BookCallPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function BookCallPage({ searchParams }: BookCallPageProps) {
  const sp = await searchParams;
  const plan = typeof sp.plan === "string" && sp.plan.trim() ? sp.plan.trim() : "";

  return (
    <MarketingPageShell
      title="Book a phone call with Robert Nattrass"
      subtitle="This is a phone call (not video). Availability starts next day: Mon-Fri 8am-6pm, Sat/Sun 2pm-4pm."
      cta="compact"
    >
      <BookCallForm initialPlan={plan} />
    </MarketingPageShell>
  );
}
