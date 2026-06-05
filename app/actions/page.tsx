"use client";

import { useState, useMemo } from "react";
import type { Severity, ActionType } from "@/lib/types";
import { useActions } from "./_hooks/useActions";
import { PlanBanner } from "./_components/PlanBanner";
import { ActionFilters } from "./_components/ActionFilters";
import { ActionTabs } from "./_components/ActionTabs";
import { ActionGrid } from "./_components/ActionGrid";
import { ActionCard } from "./_components/ActionCard";
import { EmptyState } from "./_components/EmptyState";
import { ActionsSkeleton } from "./_components/ActionsSkeleton";

export default function ActionsPage() {
  const { actions, isLoading, error, storageAvailable, updateStatus } = useActions();
  
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ActionType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'active' | 'dismissed'>('active');

  // Filter actions
  const filtered = useMemo(() => {
    return actions.filter(a => {
      const matchSev = severityFilter === 'all' || a.severity === severityFilter;
      const matchType = typeFilter === 'all' || a.type === typeFilter;
      return matchSev && matchType;
    });
  }, [actions, severityFilter, typeFilter]);

  const activeFiltered = filtered.filter(a => a.status === 'active');
  const dismissedFiltered = filtered.filter(a => a.status !== 'active');

  const visibleActions = activeTab === 'active' ? activeFiltered : dismissedFiltered;
  const activeCount = activeFiltered.length;

  const nText = activeCount === 1 ? "1 new action" : `${activeCount} new actions`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <PlanBanner />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
        {!storageAvailable && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
            Couldn't save your changes — they won't persist if you reload.
          </div>
        )}

        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Prioritized recommendations to improve AI visibility, performance, and coverage.
            </p>
          </div>
          <ActionFilters
            severityFilter={severityFilter}
            typeFilter={typeFilter}
            onSeverityChange={setSeverityFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
          {!isLoading && (
            <p className="mt-1 text-sm text-gray-600">
              Promptwatch detected {nText} from your recent monitoring data.
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <ActionsSkeleton />
        ) : error ? (
          <div className="p-6 text-center text-red-600 border border-red-200 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : (
          <>
            <ActionTabs
              activeTab={activeTab}
              activeCount={activeCount}
              dismissedCount={dismissedFiltered.length}
              onTabChange={setActiveTab}
            />

            <ActionGrid>
              {visibleActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onAccept={() => updateStatus(action.id, 'accepted')}
                  onDismiss={() => updateStatus(action.id, 'dismissed')}
                />
              ))}

              {visibleActions.length === 0 && (
                <EmptyState
                  variant={
                    activeTab === 'active'
                      ? (actions.filter(a => a.status === 'active').length === 0 ? 'no-active' : 'filtered-out')
                      : 'dismissed-empty'
                  }
                  onClearFilters={() => {
                    setSeverityFilter('all');
                    setTypeFilter('all');
                  }}
                />
              )}
            </ActionGrid>
          </>
        )}
      </main>
    </div>
  );
}
