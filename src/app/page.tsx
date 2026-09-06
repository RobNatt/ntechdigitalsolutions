import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Problem />
    </main>
  );
}
