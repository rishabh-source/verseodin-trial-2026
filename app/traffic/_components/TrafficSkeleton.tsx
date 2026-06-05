export function TrafficSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Chart Skeleton */}
      <div className="w-full h-[380px] skeleton rounded-xl" />
      
      {/* Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Top Pages</h2>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-1/2 skeleton rounded" />
                <div className="h-4 w-16 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Crawlers Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Top Crawlers</h2>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 skeleton rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 skeleton rounded" />
                </div>
                <div className="h-4 w-16 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
