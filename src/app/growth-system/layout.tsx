import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { Footer } from "@/components/startup-landing/footer";
import { Navbar } from "@/components/startup-landing/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-gsl-body",
  display: "swap",
});

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-gsl-head",
  display: "swap",
});

export default function GrowthSystemLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`${inter.variable} ${poppins.variable} text-[#111827] antialiased [font-family:var(--font-gsl-body),ui-sans-serif,system-ui,sans-serif]`}
    >
      <Navbar />
      <div className="min-h-[calc(100vh-12rem)] pt-20 lg:pt-24">{children}</div>
      <Footer />
      <ChatWidgetLazy />
    </div>
  );
}
