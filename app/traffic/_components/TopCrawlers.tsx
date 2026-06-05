import type { BotName } from "@/lib/types";
import { BOT_COLORS, BOT_PARENTS } from "../_lib/bot-config";

interface TopCrawlersProps {
  crawlers: Array<{ bot: BotName; count: number }>;
}

export function TopCrawlers({ crawlers }: TopCrawlersProps) {
  const maxCount = crawlers.length > 0 ? crawlers[0].count : 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Top Crawlers</h2>
      {crawlers.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">No crawlers to show.</div>
      ) : (
        <div className="space-y-3">
          {crawlers.map((crawler) => {
            const widthPct = (crawler.count / maxCount) * 100;
            const initial = crawler.bot.charAt(0).toUpperCase();
            
            return (
              <div key={crawler.bot} className="relative flex items-center gap-3 py-1 group">
                <div
                  className="absolute inset-y-0 left-0 bg-blue-50 rounded-md transition-all -z-10"
                  style={{ width: `${widthPct}%` }}
                />
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                  style={{ backgroundColor: BOT_COLORS[crawler.bot] }}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">
                    {crawler.bot} <span className="text-gray-500">({BOT_PARENTS[crawler.bot]})</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 text-right shrink-0">
                  {crawler.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
