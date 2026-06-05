interface TopPagesProps {
  pages: Array<{ path: string; count: number }>;
}

export function TopPages({ pages }: TopPagesProps) {
  const maxCount = pages.length > 0 ? pages[0].count : 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Top Pages</h2>
      {pages.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">No pages to show.</div>
      ) : (
        <div className="space-y-3">
          {pages.map((page, idx) => {
            const widthPct = (page.count / maxCount) * 100;
            return (
              <div key={idx} className="relative flex justify-between items-center py-1 group">
                <div
                  className="absolute inset-y-0 left-0 bg-blue-50 rounded-md transition-all -z-10"
                  style={{ width: `${widthPct}%` }}
                />
                <div className="text-sm font-mono text-gray-700 truncate pr-4" title={page.path}>
                  {page.path}
                </div>
                <div className="text-sm font-medium text-gray-900 text-right shrink-0">
                  {page.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
