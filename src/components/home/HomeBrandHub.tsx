import { HomeCoreServices } from "@/components/home/HomeCoreServices";
import { HomeHeroBeams } from "@/components/home/HomeHeroBeams";

export function HomeBrandHub() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <HomeHeroBeams />
      <HomeCoreServices />
    </div>
  );
}
