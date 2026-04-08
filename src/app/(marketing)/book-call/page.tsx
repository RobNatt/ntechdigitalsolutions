import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { BookCallForm } from "@/components/marketing/BookCallForm";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const bookDesc =
  "Book a strategy call with N-Tech. Available starting next day with focused business-hour windows.";

export const metadata: Metadata = {
  title: "Book a Call | N-Tech Digital Solutions",
  description: bookDesc,
  alternates: { canonical: canonicalUrl("/book-call") },
  openGraph: ogForPath("/book-call", "Book a Call | N-Tech Digital Solutions", bookDesc),
};

type BookCallPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function BookCallPage({ searchParams }: BookCallPageProps) {
  const sp = await searchParams;
  const plan = typeof sp.plan === "string" && sp.plan.trim() ? sp.plan.trim() : "";

  return (
    <MarketingPageShell
      title="Book a strategy call"
      subtitle="Pick a time that works for you. We start availability next day: Mon-Fri 8am-6pm, Sat/Sun 2pm-4pm."
      cta="compact"
    >
      <BookCallForm initialPlan={plan} />
    </MarketingPageShell>
  );
}
