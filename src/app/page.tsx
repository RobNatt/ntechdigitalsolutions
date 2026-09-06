import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Journey } from "@/components/sections/journey";
import { Solution } from "@/components/sections/solution";
import { Climax } from "@/components/sections/climax";

/*
 * Order follows Rob's copy: problem, how it works, the stack, close.
 *
 * The stack was briefly moved ahead of "how it works" because the offer arrived
 * too late on the page. His rewrite fixes that a better way — chapter two now
 * describes the whole system rather than just the receptionist, and closes on
 * "five pieces, working as one system". The offer lands in chapter two either
 * way, and this keeps his structure.
 */

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
