import type { Severity, ActionType } from "@/lib/types";

interface ActionFiltersProps {
  severityFilter: Severity | 'all';
  typeFilter: ActionType | 'all';
  onSeverityChange: (v: Severity | 'all') => void;
  onTypeChange: (v: ActionType | 'all') => void;
}

export function ActionFilters({ severityFilter, typeFilter, onSeverityChange, onTypeChange }: ActionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 justify-end">
      <div className="flex items-center gap-2">
        <label htmlFor="severity-filter" className="text-sm font-medium text-gray-700">Severity</label>
        <select
          id="severity-filter"
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value as Severity | 'all')}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">Action type</label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as ActionType | 'all')}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="all">All</option>
          <option value="reddit">Reddit</option>
          <option value="outreach">Outreach</option>
          <option value="content">Content</option>
        </select>
      </div>
    </div>
  );
}
