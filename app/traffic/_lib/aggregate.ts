import type { AiVisit, BotName } from "@/lib/types";
import { BOT_NAMES } from "@/lib/types";

export interface AggregatedData {
  chartData: Array<{ date: string } & Record<BotName, number>>;
  topPages: Array<{ path: string; count: number }>;
  topCrawlers: Array<{ bot: BotName; count: number }>;
  summary: { total: number; botCount: number; pageCount: number; dayCount: number };
  sortedBots: BotName[]; // ordered by total count desc
}

export function aggregateVisits(visits: AiVisit[]): AggregatedData {
  const dayBotMap = new Map<string, Record<BotName, number>>();
  const pageCounts = new Map<string, number>();
  const botCounts = new Map<BotName, number>();
  
  let total = 0;
  
  // Initialize bot counts
  for (const bot of BOT_NAMES) {
    botCounts.set(bot, 0);
  }

  // Single pass through all visits
  for (let i = 0; i < visits.length; i++) {
    const visit = visits[i];
    const date = visit.timestamp.slice(0, 10);
    const bot = visit.bot;
    
    // Day bot map
    let dayRecord = dayBotMap.get(date);
    if (!dayRecord) {
      dayRecord = {
        "GPTBot": 0,
        "ChatGPT-User": 0,
        "OAI-SearchBot": 0,
        "ClaudeBot": 0,
        "PerplexityBot": 0,
        "Perplexity-User": 0,
        "Google-Extended": 0,
      } as Record<BotName, number>;
      dayBotMap.set(date, dayRecord);
    }
    dayRecord[bot]++;
    
    // Page counts
    const count = pageCounts.get(visit.page_path) || 0;
    pageCounts.set(visit.page_path, count + 1);
    
    // Bot counts
    botCounts.set(bot, botCounts.get(bot)! + 1);
    
    total++;
  }

  // Convert dayBotMap to chartData array sorted by date
  const chartData = Array.from(dayBotMap.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top pages
  const topPages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // All crawlers sorted
  const topCrawlersFull = Array.from(botCounts.entries())
    .map(([bot, count]) => ({ bot, count }))
    .sort((a, b) => b.count - a.count);
    
  const topCrawlers = topCrawlersFull.filter(c => c.count > 0).slice(0, 8);

  // Sorted bots for stack order (total desc)
  const sortedBots = topCrawlersFull.map(c => c.bot);
  
  // Bot count (bots with >0 visits)
  const activeBotCount = topCrawlers.length;

  return {
    chartData,
    topPages,
    topCrawlers,
    summary: {
      total,
      botCount: activeBotCount,
      pageCount: pageCounts.size,
      dayCount: dayBotMap.size,
    },
    sortedBots,
  };
}
