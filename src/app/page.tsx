import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Journey } from "@/components/sections/journey";
import { Climax } from "@/components/sections/climax";

/*
 * Order matters, and it changed.
 *
 * The stack used to sit in chapter three, which meant a visitor didn't learn
 * what the offer actually is until two thirds down the page — everything before
 * it was the AI receptionist, one piece of five. Now the problem is named, the
 * whole offer is shown, and only then does it explain how it works.
 *
 * Say what it is before explaining how it runs.
 */

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Problem />
      <Solution />
      <Journey />
      <Climax />
    </main>
  );
}
