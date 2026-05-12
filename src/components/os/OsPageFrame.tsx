type OsPageFrameProps = {
  title: string;
  description?: string;
  brandColor: string;
  /** @default true */
  showAddButton?: boolean;
};

export function OsPageFrame({ title, description, brandColor, showAddButton = true }: OsPageFrameProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
          ) : null}
        </div>
        {showAddButton ? (
          <button
            type="button"
            disabled
            className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white opacity-70 shadow-sm"
            style={{ backgroundColor: brandColor }}
          >
            Add
          </button>
        ) : null}
      </header>
    </div>
  );
}
