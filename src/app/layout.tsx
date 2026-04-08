import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { DeferredAnalyticsRoot } from "@/components/analytics/DeferredAnalyticsRoot";
import { SITE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/providers";

const GA_MEASUREMENT_ID = "G-9BWR9R2696";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "N-Tech Digital Solutions",
  description:
    "N-Tech Digital Solutions — websites, lead generation, and automation for your business.",
  icons: {
    icon: [{ url: "/ntech-official-logo.png", type: "image/png" }],
    apple: [{ url: "/ntech-official-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.variable, inter.className, "min-h-screen bg-background antialiased")}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics-gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">{children}</div>
          <DeferredAnalyticsRoot />
        </ThemeProvider>
      </body>
    </html>
  );
}
