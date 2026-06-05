interface ActionTabsProps {
  activeTab: 'active' | 'dismissed';
  activeCount: number;
  dismissedCount: number;
  onTabChange: (tab: 'active' | 'dismissed') => void;
}

export function ActionTabs({ activeTab, activeCount, dismissedCount, onTabChange }: ActionTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-6" role="tablist">
      <button
        role="tab"
        aria-selected={activeTab === 'active'}
        onClick={() => onTabChange('active')}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${
          activeTab === 'active'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        Active ({activeCount})
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'dismissed'}
        onClick={() => onTabChange('dismissed')}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${
          activeTab === 'dismissed'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        Dismissed ({dismissedCount})
      </button>
    </div>
  );
}
