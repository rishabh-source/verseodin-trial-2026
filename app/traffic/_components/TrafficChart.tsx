"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BotName } from "@/lib/types";
import type { AggregatedData } from "../_lib/aggregate";
import { BOT_COLORS } from "../_lib/bot-config";

interface TrafficChartProps {
  data: AggregatedData;
  dateRange?: number; // 7, 30, 90
}

export function TrafficChart({ data, dateRange = 90 }: TrafficChartProps) {
  const [hiddenBots, setHiddenBots] = useState<Set<BotName>>(new Set());

  const toggleBot = (bot: BotName) => {
    setHiddenBots((prev) => {
      const next = new Set(prev);
      if (next.has(bot)) {
        next.delete(bot);
      } else {
        next.add(bot);
      }
      return next;
    });
  };

  const chartData = data.chartData.slice(-dateRange);
  const allHidden = hiddenBots.size === data.sortedBots.length;

  // X-axis label interval: label every Nth bar where N = floor(barCount / 12)
  const xAxisInterval = Math.max(1, Math.floor(chartData.length / 12));

  return (
    <div className="w-full">
      {/* Custom Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {data.sortedBots.map((bot) => {
          const isHidden = hiddenBots.has(bot);
          return (
            <button
              key={bot}
              onClick={() => toggleBot(bot)}
              className={`flex items-center gap-2 text-sm font-medium transition-opacity ${
                isHidden ? "opacity-40" : "opacity-100 hover:opacity-80"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: BOT_COLORS[bot] }}
              />
              <span className="text-gray-700">{bot}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[380px] min-h-[380px] max-h-[600px]">
        {allHidden && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p className="text-gray-500 font-medium">
              All bots hidden. Click a legend item to show data.
            </p>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={xAxisInterval - 1}
              tickFormatter={(val) => {
                const d = new Date(val);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
              style={{ fontSize: "12px", fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              style={{ fontSize: "12px", fill: "#6b7280" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;

                const dateStr = new Date(label).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                let total = 0;
                const items = payload
                  .filter((entry) => {
                    const botName = entry.dataKey as BotName;
                    const val = entry.value as number;
                    return val > 0 && !hiddenBots.has(botName);
                  })
                  .map((entry) => {
                    const botName = entry.dataKey as BotName;
                    const val = entry.value as number;
                    total += val;
                    return (
                      <div key={botName} className="flex justify-between items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: BOT_COLORS[botName] }}
                          />
                          <span className="text-gray-600">{botName}</span>
                        </div>
                        <span className="font-medium text-gray-900">{val}</span>
                      </div>
                    );
                  });

                // Recharts order is bottom-to-top of stack, let's match the visual top-to-bottom if we want,
                // or just leave it. Let's reverse to match legend visually.
                items.reverse();

                return (
                  <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 min-w-[200px]">
                    <div className="text-sm text-gray-500 mb-2">{dateStr}</div>
                    <div className="space-y-1 mb-3">{items}</div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>Total:</span>
                      <span>{total}</span>
                    </div>
                  </div>
                );
              }}
              cursor={{ fill: "#f3f4f6" }}
            />
            
            {/* Stack order: largest total at bottom. data.sortedBots is desc, so we reverse it for rendering.
                Recharts renders first <Bar> at the bottom of the stack. */}
            {[...data.sortedBots].reverse().map((bot) => (
              <Bar
                key={bot}
                dataKey={bot}
                stackId="stack"
                fill={BOT_COLORS[bot]}
                hide={hiddenBots.has(bot)}
                isAnimationActive={false} // Performance
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
