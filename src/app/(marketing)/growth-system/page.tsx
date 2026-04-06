import type { Metadata } from "next";
import { GrowthSystemLanding } from "@/components/landing/GrowthSystemLanding";
import { SITE_URL } from "@/constants/site";

const canonical = `${SITE_URL}/growth-system`;

export const metadata: Metadata = {
  title: "Lead System: Clicks to Qualified Conversations | N-Tech Digital Solutions",
  description:
    "Full front-end system from first click to booked calls — funnel, CRM, SMS + email automation, local SEO, and ongoing optimization. $4,997 setup + $499/mo.",
  alternates: { canonical },
  openGraph: {
    title: "Stop Paying for Clicks That Never Turn Into Real Leads | N-Tech",
    description:
      "We build the full system: capture, qualify, follow up, and pipeline visibility — plus local SEO so you’re not only dependent on ads.",
    url: canonical,
    type: "website",
  },
};

export default function GrowthSystemPage() {
  return <GrowthSystemLanding />;
}
