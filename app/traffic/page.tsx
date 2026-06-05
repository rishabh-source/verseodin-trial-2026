"use client";

import { useTrafficData } from "./_hooks/useTrafficData";
import { TrafficSkeleton } from "./_components/TrafficSkeleton";
import { TrafficChart } from "./_components/TrafficChart";
import { TopPages } from "./_components/TopPages";
import { TopCrawlers } from "./_components/TopCrawlers";

export default function TrafficPage() {
  const { data, isLoading, error, retry } = useTrafficData();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">AI Traffic</h1>
          {isLoading ? (
            <div className="mt-1 h-5 w-64 skeleton rounded" />
          ) : data ? (
            <p className="mt-1 text-sm text-gray-500">
              {data.summary.total.toLocaleString()} visits from {data.summary.botCount} bots across {data.summary.pageCount.toLocaleString()} pages, last 90 days
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">—</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <TrafficSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-medium text-gray-900">Couldn't load traffic data.</p>
          <p className="mt-1 text-sm text-gray-500 mb-4">Try refreshing the page.</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {(!data || data.chartData.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-[380px] text-center border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
              <p className="text-base font-medium text-gray-900">No AI traffic yet.</p>
              <p className="mt-1 text-sm text-gray-500">Once AI crawlers visit your site, you'll see them here.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[600px]">
                <TrafficChart data={data} dateRange={90} />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopPages pages={data?.topPages || []} />
            <TopCrawlers crawlers={data?.topCrawlers || []} />
          </div>
        </div>
      )}
    </main>
  );
}
