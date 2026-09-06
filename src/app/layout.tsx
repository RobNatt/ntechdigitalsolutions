import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { Analytics } from "@vercel/analytics/next";

// Type pairing is locked in design-system.md — Outfit for headings, Work Sans
// for body. Weights here match the scale defined there; don't add weights
// without updating that file first.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "N-Tech Digital Solutions",
  description:
    "N-Tech Digital Solutions runs the website, phone, follow-up, social, and reviews for local service businesses around Omaha, NE — one connected system instead of five separate tools.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${workSans.variable} h-full antialiased`}
    >
      <head>
        {/* Without JS, motion never clears its initial opacity:0. The design
            system forbids content that is invisible by default, so force it
            visible when scripts don't run. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatWidgetLazy />
        {/*
          Vercel Analytics is cookieless — it sets nothing in the visitor's
          browser and doesn't fingerprint. That matters here beyond preference:
          the privacy policy states this site uses no advertising or tracking
          cookies, and that sentence has to stay true. Google Analytics would
          have made it false and required a consent banner.
        */}
        <Analytics />
      </body>
    </html>
  );
}
