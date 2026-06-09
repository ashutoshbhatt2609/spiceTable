export default function Loading() {
  return (
    <div className="grid gap-6">
      {/* Page header skeleton */}
      <div className="grid gap-2">
        <div className="h-3 w-16 rounded bg-[hsl(var(--muted))] animate-skeleton" />
        <div className="h-7 w-48 rounded bg-[hsl(var(--muted))] animate-skeleton" />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[hsl(var(--border))] bg-white p-5">
            <div className="h-3.5 w-28 rounded bg-[hsl(var(--muted))] animate-skeleton mb-3" />
            <div className="h-8 w-20 rounded bg-[hsl(var(--muted))] animate-skeleton" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="h-4 w-32 rounded bg-[hsl(var(--muted))] animate-skeleton mb-4" />
          <div className="h-64 rounded-lg bg-[hsl(var(--muted))] animate-skeleton" />
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="h-4 w-28 rounded bg-[hsl(var(--muted))] animate-skeleton mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t border-[hsl(var(--border))] first:border-0">
              <div className="grid gap-1.5">
                <div className="h-3.5 w-24 rounded bg-[hsl(var(--muted))] animate-skeleton" />
                <div className="h-3 w-14 rounded bg-[hsl(var(--muted))] animate-skeleton" />
              </div>
              <div className="h-5 w-16 rounded-full bg-[hsl(var(--muted))] animate-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
