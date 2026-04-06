import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";

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
      {children}
    </div>
  );
}
