import type { Metadata } from "next";
import { GrowthSystemLanding } from "@/components/landing/GrowthSystemLanding";
import { SITE_URL } from "@/constants/site";

const canonical = `${SITE_URL}/growth-system`;

export const metadata: Metadata = {
  title: "Growth System — Stop Losing Leads | N-Tech Digital Solutions",
  description:
    "If you're paying for ads or getting traffic but not seeing consistent booked jobs, the missing piece is often the system after the click — funnel, CRM, follow-up, and local SEO. $12,000 setup + $4,000/month.",
  alternates: { canonical },
  openGraph: {
    title: "Stop Losing Good Leads Because There's No System to Catch Them | N-Tech",
    description:
      "Ads and traffic without a system to catch and follow up leads means revenue slipping through. We build the full front end so you respond to people who are ready to talk.",
    url: canonical,
    type: "website",
  },
};

export default function GrowthSystemPage() {
  return <GrowthSystemLanding />;
}
