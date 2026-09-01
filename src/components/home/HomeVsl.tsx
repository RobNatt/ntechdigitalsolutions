import { VideoPlaceholder } from "@/components/marketing/VideoPlaceholder";

export function HomeVsl() {
  return (
    <section className="border-t border-neutral-200/70 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            Watch first
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-white">
            The whole system, explained in under 2 minutes
          </h2>
        </div>
        <div className="mt-8">
          <VideoPlaceholder
            title="How the system works, start to finish"
            description="Full walkthrough video — coming soon"
          />
        </div>
      </div>
    </section>
  );
}
