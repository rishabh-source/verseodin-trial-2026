import { useEffect, useReducer, useCallback } from "react";
import type { Action, MonitoringEvent, Status } from "@/lib/types";
import { deriveActions } from "../_lib/deriveActions";
import { loadPersistedStatuses, mergeWithPersisted, persistActions } from "../_lib/persistence";

type State = {
  actions: Action[];
  isLoading: boolean;
  error: string | null;
  storageAvailable: boolean;
};

type ActionMsg = 
  | { type: "SET_DATA"; actions: Action[]; storageAvailable: boolean }
  | { type: "UPDATE_STATUS"; id: string; status: Status }
  | { type: "SET_ERROR"; error: string };

function reducer(state: State, msg: ActionMsg): State {
  switch (msg.type) {
    case "SET_DATA":
      return { ...state, actions: msg.actions, isLoading: false, storageAvailable: msg.storageAvailable };
    case "UPDATE_STATUS": {
      const nextActions = state.actions.map(a => 
        a.id === msg.id ? { ...a, status: msg.status } : a
      );
      
      // Attempt to persist
      const storageAvailable = persistActions(nextActions);
      
      return { ...state, actions: nextActions, storageAvailable };
    }
    case "SET_ERROR":
      return { ...state, error: msg.error, isLoading: false };
    default:
      return state;
  }
}

export function useActions() {
  const [state, dispatch] = useReducer(reducer, {
    actions: [],
    isLoading: true,
    error: null,
    storageAvailable: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/monitoring-events.json");
        if (!res.ok) throw new Error("Failed to load events");
        const events: MonitoringEvent[] = await res.json();
        
        const derived = deriveActions(events);
        const persisted = loadPersistedStatuses();
        const merged = mergeWithPersisted(derived, persisted);
        
        const storageAvailable = persistActions(merged);
        
        dispatch({ type: "SET_DATA", actions: merged, storageAvailable });
      } catch (err) {
        dispatch({ type: "SET_ERROR", error: err instanceof Error ? err.message : "Unknown error" });
      }
    }
    load();
  }, []);

  const updateStatus = useCallback((id: string, status: Status) => {
    dispatch({ type: "UPDATE_STATUS", id, status });
  }, []);

  return { ...state, updateStatus };
}
