import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/constants/site";
import { CursorReactiveEnvironment } from "@/components/cursor-reactive/CursorReactiveEnvironment";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/providers";

const GA_MEASUREMENT_ID = "G-9BWR9R2696";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          inter.className,
          "min-h-screen bg-background antialiased"
        )}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics-gtag" strategy="afterInteractive">
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
          <CursorReactiveEnvironment />
          <div className="relative min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
