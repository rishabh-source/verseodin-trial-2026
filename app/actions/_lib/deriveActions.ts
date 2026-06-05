import type { 
  MonitoringEvent, 
  Action, 
  ActionType, 
  Severity,
  CitationMissedEvent,
  CompetitorCitedInsteadEvent,
  RedditCompetitorMentionEvent,
  ArticlePublishedWithCompetitorsEvent
} from "@/lib/types";

// djb2 hash for stable IDs
function stableActionId(sourceEventIds: string[]): string {
  const sorted = [...sourceEventIds].sort();
  let hash = 5381;
  for (const id of sorted) {
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) + hash + id.charCodeAt(i)) | 0;
    }
  }
  return `action_${(hash >>> 0).toString(36)}`;
}

// Handler Registry Pattern
type AnyHandler = EventHandler<any>;

interface EventHandler<E extends MonitoringEvent> {
  eventType: E["event_type"];
  groupKey: (event: E) => string;
  toAction: (group: E[]) => Omit<Action, "id" | "status" | "source_event_ids">;
}

const redditHandler: EventHandler<RedditCompetitorMentionEvent> = {
  eventType: "reddit_competitor_mention",
  groupKey: (e) => e.thread_url,
  toAction: (group) => {
    const maxUpvotes = Math.max(...group.map(e => e.upvotes));
    const maxComments = Math.max(...group.map(e => e.comment_count));
    
    let severity: Severity = "low";
    if (maxUpvotes >= 200 || maxComments >= 50) severity = "high";
    else if (maxUpvotes >= 50 || maxComments >= 15) severity = "medium";

    const latestEvent = group.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const competitors = Array.from(new Set(group.flatMap(e => e.competitors_mentioned))).join(", ");

    return {
      type: "reddit",
      severity,
      title: `Engage with "${latestEvent.thread_title}" on r/${latestEvent.subreddit}`,
      description: `This thread has ${maxUpvotes} upvotes and ${maxComments} comments mentioning ${competitors}. Engaging now could drive brand awareness.`,
      source_url: latestEvent.thread_url,
      created_at: latestEvent.created_at,
    };
  }
};

const articleHandler: EventHandler<ArticlePublishedWithCompetitorsEvent> = {
  eventType: "article_published_with_competitors",
  groupKey: (e) => e.article_url,
  toAction: (group) => {
    const maxTraffic = Math.max(...group.map(e => e.estimated_monthly_traffic));
    
    let severity: Severity = "low";
    if (maxTraffic >= 50000) severity = "high";
    else if (maxTraffic >= 8000) severity = "medium";

    const latestEvent = group.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const competitors = Array.from(new Set(group.flatMap(e => e.competitors_cited))).join(", ");

    return {
      type: "outreach",
      severity,
      title: `Pitch ${latestEvent.publication} about "${latestEvent.article_title}"`,
      description: `This article gets an estimated ${maxTraffic.toLocaleString()} monthly visits and cites ${competitors} — but not you. Reaching out could secure a mention.`,
      source_url: latestEvent.article_url,
      created_at: latestEvent.created_at,
    };
  }
};

const citationMissedHandler: EventHandler<CitationMissedEvent> = {
  eventType: "citation_missed",
  groupKey: (e) => e.engine,
  toAction: (group) => {
    const count = group.length;
    
    let severity: Severity = "low";
    if (count >= 5) severity = "high";
    else if (count >= 2) severity = "medium";

    const latestEvent = group.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const competitors = Array.from(new Set(group.flatMap(e => e.competitor_brands))).join(", ");
    const engineName = latestEvent.engine.charAt(0).toUpperCase() + latestEvent.engine.slice(1);

    return {
      type: "content",
      severity,
      title: `Publish content targeting ${engineName} for AI visibility`,
      description: `You were missed in ${count} ${engineName} answers. Competitors like ${competitors} are being cited instead. Publishing targeted content could close this gap.`,
      created_at: latestEvent.created_at,
    };
  }
};

const competitorCitedHandler: EventHandler<CompetitorCitedInsteadEvent> = {
  eventType: "competitor_cited_instead",
  groupKey: (e) => e.competitor_brand,
  toAction: (group) => {
    const count = group.length;
    const avgPosition = group.reduce((sum, e) => sum + e.position, 0) / count;
    
    let severity: Severity = "low";
    if (avgPosition <= 2 && count >= 3) severity = "high";
    else if (avgPosition <= 3 || count >= 2) severity = "medium";

    const redditCount = group.filter(e => e.source_type === "reddit").length;
    const type: ActionType = redditCount > count / 2 ? "outreach" : "content";

    const latestEvent = group.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const sourceTypes = Array.from(new Set(group.map(e => e.source_type))).join(", ");

    return {
      type,
      severity,
      title: `Counter ${latestEvent.competitor_brand}'s citation dominance`,
      description: `${latestEvent.competitor_brand} was cited ${count} times across ${sourceTypes}. Creating counter-content could reclaim visibility.`,
      source_url: latestEvent.source_url,
      created_at: latestEvent.created_at,
    };
  }
};

const HANDLERS: AnyHandler[] = [
  redditHandler,
  articleHandler,
  citationMissedHandler,
  competitorCitedHandler
];

export function deriveActions(events: MonitoringEvent[]): Action[] {
  const actions: Action[] = [];

  // Index handlers by eventType
  const handlerMap = new Map<string, AnyHandler>(
    HANDLERS.map(h => [h.eventType, h])
  );

  // 1. Group events by handler + groupKey
  const groups = new Map<string, { handler: AnyHandler; events: MonitoringEvent[] }>();

  for (const event of events) {
    const handler = handlerMap.get(event.event_type);
    if (!handler) continue; // Skip unknown event types

    const groupKey = handler.groupKey(event);
    const key = `${event.event_type}::${groupKey}`;

    if (!groups.has(key)) {
      groups.set(key, { handler, events: [] });
    }
    groups.get(key)!.events.push(event);
  }

  // 2. Generate Actions
  for (const { handler, events } of groups.values()) {
    const actionData = handler.toAction(events);
    const sourceEventIds = events.map(e => e.id);
    
    actions.push({
      ...actionData,
      id: stableActionId(sourceEventIds),
      source_event_ids: sourceEventIds,
      status: "active"
    });
  }

  // 3. Sort by severity (high > medium > low) then by created_at (desc)
  const severityScore: Record<Severity, number> = { high: 3, medium: 2, low: 1 };
  
  actions.sort((a, b) => {
    const sDiff = severityScore[b.severity] - severityScore[a.severity];
    if (sDiff !== 0) return sDiff;
    return b.created_at.localeCompare(a.created_at);
  });

  return actions;
}
