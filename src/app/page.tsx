import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Journey } from "@/components/sections/journey";
import { Solution } from "@/components/sections/solution";
import { Climax } from "@/components/sections/climax";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Problem />
      <Journey />
      <Solution />
      <Climax />
    </main>
  );
}
