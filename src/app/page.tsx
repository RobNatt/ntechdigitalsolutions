import SignInCard from "@/components/SignInCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="mb-8 text-center">
        <h2 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
          nTech Digital Solutions
        </h2>
      </div>
      <SignInCard />
    </main>
  );
}
