import { HomeCaseStudies } from "@/components/home/HomeCaseStudies";
import { HomeCoreServices } from "@/components/home/HomeCoreServices";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeHeroBeams } from "@/components/home/HomeHeroBeams";
import { HomeWhyChooseNtech } from "@/components/home/HomeWhyChooseNtech";

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <HomeHeroBeams />
      <HomeCoreServices />
      <HomeWhyChooseNtech />
      <HomeCaseStudies />
      <HomeFinalCta />
      <HomeFaq />
    </div>
  );
}
