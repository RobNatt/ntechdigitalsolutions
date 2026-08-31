import { HomeCoreServices } from "@/components/home/HomeCoreServices";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeHeroBeams } from "@/components/home/HomeHeroBeams";
import { HomeOfferWalkthrough } from "@/components/home/HomeOfferWalkthrough";
import { HomeScrollStory } from "@/components/home/HomeScrollStory";
import { HomeVsl } from "@/components/home/HomeVsl";
import { HomeWhyChooseNtech } from "@/components/home/HomeWhyChooseNtech";

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <HomeHeroBeams />
      <HomeScrollStory />
      <HomeVsl />
      <HomeOfferWalkthrough />
      <HomeCoreServices />
      <HomeWhyChooseNtech />
      <HomeFinalCta />
      <HomeFaq />
    </div>
  );
}
