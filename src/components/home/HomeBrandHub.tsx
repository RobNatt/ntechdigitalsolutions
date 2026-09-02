import { HomeCoreServices } from "@/components/home/HomeCoreServices";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeHeroBeams } from "@/components/home/HomeHeroBeams";
import { HomeLeadForm } from "@/components/home/HomeLeadForm";
import { HomeOfferWalkthrough } from "@/components/home/HomeOfferWalkthrough";
import { HomeProcessSteps } from "@/components/home/HomeProcessSteps";
import { HomeScrollStory } from "@/components/home/HomeScrollStory";
import { HomeSectionCta } from "@/components/home/HomeSectionCta";
import { HomeVsl } from "@/components/home/HomeVsl";
import { HomeWhyChooseNtech } from "@/components/home/HomeWhyChooseNtech";

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <HomeHeroBeams />
      <HomeVsl />
      <HomeSectionCta
        eyebrow="Like what you just watched?"
        heading="See it running on your business, free — book a 15-minute call."
      />
      <HomeOfferWalkthrough />
      <HomeScrollStory />
      <HomeSectionCta
        eyebrow="That's the whole loop, live"
        heading="Ready to stop losing leads in the gaps? Let's set yours up."
        ctaLabel="Get started"
      />
      <HomeCoreServices />
      <HomeProcessSteps />
      <HomeFinalCta />
      <HomeWhyChooseNtech />
      <HomeFaq />
      <HomeLeadForm />
    </div>
  );
}
