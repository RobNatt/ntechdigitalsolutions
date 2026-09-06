import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidgetAnchor } from "@/components/chat-widget-anchor";
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

const SITE_URL = "https://ntechdigital.solutions";
const SITE_NAME = "N-Tech Digital Solutions";
const SITE_DESCRIPTION =
  "N-Tech Digital Solutions runs the website, phone, follow-up, social, and reviews for local service businesses around Omaha, NE — one connected system instead of five separate tools.";

/*
 * metadataBase is what turns the file-based opengraph-image into an absolute
 * URL. Without it Next emits a relative path, and every scraper — Facebook,
 * LinkedIn, iMessage, the CRM's own link preview — silently drops the image.
 *
 * The title template means each page declares only its own name; the suffix is
 * added here, in one place, instead of being retyped in six files where it can
 * drift.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
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
        {/*
          GoHighLevel chat widget. Replaces the interim Groq widget migrated
          from the old project — that one stays in components/chat but is no
          longer mounted, because two floating chat launchers in the same corner
          is a bug, not a choice.

          RENDERED AS A PLAIN <script>, NOT next/script. next/script with
          lazyOnload or afterInteractive injects the tag client-side after
          hydration, so it never exists in the served HTML — it sits inside
          React's payload as escaped JSON. GHL's compliance checker reads raw
          HTML and reported the widget as not installed. React 19 hoists a
          plain script tag into <head> at render time, which is a real tag a
          crawler can see. `async` keeps it off the critical path.

          ChatWidgetAnchor below is not optional decoration — without it the
          widget mounts inside React's hidden streaming container and never
          renders. See that file for the full explanation.
        */}
        <script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6a9ddbe73b1bd68305498986"
          data-source="WEB_USER"
          async
        />
        <ChatWidgetAnchor />

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
