/** Shown immediately while a dashboard route segment loads (soft navigation). */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 max-w-xl rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-3 h-8 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-24 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-3 h-8 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="h-64 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
    </div>
  );
}
