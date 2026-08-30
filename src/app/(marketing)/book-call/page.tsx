import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { GhlCalendarEmbed } from "@/components/marketing/GhlCalendarEmbed";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const bookDesc =
  "Book a call with N-Tech Digital Solutions to see how the infrastructure system — website, AI receptionist, lead automation, social media management, and review automation — fits your business.";

export const metadata: Metadata = {
  title: "Book a Call | N-Tech Digital Solutions",
  description: bookDesc,
  alternates: { canonical: canonicalUrl("/book-call") },
  openGraph: ogForPath("/book-call", "Book a Call | N-Tech Digital Solutions", bookDesc),
};

export default function BookCallPage() {
  return (
    <MarketingPageShell
      title="Book a call"
      subtitle="Pick a time that works. We'll walk through what's leaking leads in your business today and what the infrastructure system would look like for you."
      cta="compact"
    >
      <GhlCalendarEmbed />
    </MarketingPageShell>
  );
}
