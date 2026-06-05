export function ActionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Filter Area Skeleton */}
      <div className="flex justify-end gap-4 py-4">
        <div className="h-9 w-40 skeleton rounded-lg" />
        <div className="h-9 w-40 skeleton rounded-lg" />
      </div>

      {/* Header Skeleton */}
      <div>
        <div className="h-6 w-48 skeleton rounded mb-2" />
        <div className="h-4 w-96 skeleton rounded" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-6 border-b border-gray-200 mb-6 pb-2">
        <div className="h-5 w-24 skeleton rounded" />
        <div className="h-5 w-24 skeleton rounded" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between mb-4">
                <div className="h-5 w-20 skeleton rounded" />
                <div className="h-5 w-16 skeleton rounded-full" />
              </div>
              <div className="h-5 w-full skeleton rounded mb-2" />
              <div className="h-5 w-3/4 skeleton rounded mb-4" />
              <div className="h-4 w-full skeleton rounded mb-1" />
              <div className="h-4 w-5/6 skeleton rounded" />
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="h-4 w-12 skeleton rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-20 skeleton rounded-lg" />
                <div className="h-8 w-20 skeleton rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
