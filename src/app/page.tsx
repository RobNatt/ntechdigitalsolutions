import { Features } from "@/components/startup-landing/features";
import { Footer } from "@/components/startup-landing/footer";
import { Hero } from "@/components/startup-landing/hero";
import { LeadAgentCtaPing } from "@/components/startup-landing/lead-agent-cta-ping";
import { Navbar } from "@/components/startup-landing/navbar";
import { Process } from "@/components/startup-landing/process";
import { Pricing } from "@/components/startup-landing/pricing";
import { Testimonials } from "@/components/startup-landing/testimonials";

export default function HomePage() {
  return (
    <>
      <LeadAgentCtaPing />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Process />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
