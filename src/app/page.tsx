import { ContactSection } from "@/components/startup-landing/contact-section";
import { Features } from "@/components/startup-landing/features";
import { Footer } from "@/components/startup-landing/footer";
import { Hero } from "@/components/startup-landing/hero";
import { Navbar } from "@/components/startup-landing/navbar";
import { Process } from "@/components/startup-landing/process";
import { Pricing } from "@/components/startup-landing/pricing";
import { Testimonials } from "@/components/startup-landing/testimonials";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Process />
        <Pricing />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
