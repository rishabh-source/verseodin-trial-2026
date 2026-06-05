import { MessageSquare, Send, FileText, Check, X } from "lucide-react";
import type { Action } from "@/lib/types";
import { formatRelativeDate } from "../_lib/relative-date";

interface ActionCardProps {
  action: Action;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export function ActionCard({ action, onAccept, onDismiss }: ActionCardProps) {
  // Type chip config
  const typeConfig = {
    reddit: { icon: MessageSquare, label: "Reddit", bg: "bg-orange-50 text-orange-700 border-orange-200" },
    outreach: { icon: Send, label: "Outreach", bg: "bg-blue-50 text-blue-700 border-blue-200" },
    content: { icon: FileText, label: "Content", bg: "bg-purple-50 text-purple-700 border-purple-200" },
  };
  const TypeIcon = typeConfig[action.type].icon;

  // Severity config
  const severityConfig = {
    high: { bg: "bg-red-500", text: "text-white", label: "High" },
    medium: { bg: "bg-amber-400", text: "text-amber-950", label: "Medium" },
    low: { bg: "bg-gray-200", text: "text-gray-800", label: "Low" },
  };
  const sev = severityConfig[action.severity];

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[220px] transition-all hover:shadow-md">
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${typeConfig[action.type].bg}`}>
          <TypeIcon className="w-3.5 h-3.5" />
          <span>{typeConfig[action.type].label}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sev.bg} ${sev.text}`}>
          {sev.label}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-3 mb-2">
        {action.source_url ? (
          <a href={action.source_url} target="_blank" rel="noreferrer" className="hover:underline">
            {action.title}
          </a>
        ) : (
          action.title
        )}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
        {action.description}
      </p>

      {/* Bottom row */}
      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs font-medium text-gray-400">
          {formatRelativeDate(action.created_at)}
        </div>
        
        <div className="flex items-center gap-2">
          {action.status === "active" ? (
            <>
              <button
                type="button"
                onClick={onDismiss}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 focus:outline-none transition-colors"
              >
                Accept
              </button>
            </>
          ) : action.status === "accepted" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
              <Check className="w-4 h-4" />
              <span>Accepted</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
              <X className="w-4 h-4" />
              <span>Dismissed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
