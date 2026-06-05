interface EmptyStateProps {
  variant: 'no-active' | 'filtered-out' | 'dismissed-empty';
  onClearFilters?: () => void;
}

export function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center col-span-full border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
      {variant === 'no-active' && (
        <p className="text-base font-medium text-gray-900">All caught up — no active actions</p>
      )}
      
      {variant === 'filtered-out' && (
        <>
          <p className="text-base font-medium text-gray-900 mb-4">No actions match these filters</p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Clear filters
            </button>
          )}
        </>
      )}

      {variant === 'dismissed-empty' && (
        <p className="text-base font-medium text-gray-900">Nothing here yet.</p>
      )}
    </div>
  );
}
