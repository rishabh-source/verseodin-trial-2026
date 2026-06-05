import type { BotName } from "@/lib/types";

/**
 * Single source-of-truth color palette for all bots.
 * Used in: chart bars, legend pills, tooltip swatches, Top Crawlers avatars.
 *
 * Colors chosen for visual distinction + accessibility (high contrast on white).
 */
export const BOT_COLORS: Record<BotName, string> = {
  GPTBot: "#10b981", // emerald-500
  "ChatGPT-User": "#3b82f6", // blue-500
  "OAI-SearchBot": "#8b5cf6", // violet-500
  ClaudeBot: "#f59e0b", // amber-500
  PerplexityBot: "#ef4444", // red-500
  "Perplexity-User": "#ec4899", // pink-500
  "Google-Extended": "#06b6d4", // cyan-500
};

/**
 * Parent company for each bot — used in Top Crawlers display.
 * e.g. "ChatGPT-User (OpenAI)"
 */
export const BOT_PARENTS: Record<BotName, string> = {
  GPTBot: "OpenAI",
  "ChatGPT-User": "OpenAI",
  "OAI-SearchBot": "OpenAI",
  ClaudeBot: "Anthropic",
  PerplexityBot: "Perplexity",
  "Perplexity-User": "Perplexity",
  "Google-Extended": "Google",
};
