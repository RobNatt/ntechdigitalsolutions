import { CTA } from "@/components/startup-landing/cta";
import { Features } from "@/components/startup-landing/features";
import { Footer } from "@/components/startup-landing/footer";
import { Hero } from "@/components/startup-landing/hero";
import { Navbar } from "@/components/startup-landing/navbar";
import { Pricing } from "@/components/startup-landing/pricing";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
