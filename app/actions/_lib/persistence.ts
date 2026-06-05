import type { Action, Status } from "@/lib/types";

const STORAGE_KEY = "actionCentre.v1";

export function loadPersistedStatuses(): Map<string, Status> | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    
    // Parse as array of [id, status] pairs
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed)) {
      return new Map<string, Status>(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

export function persistActions(actions: Action[]): boolean {
  try {
    const pairs = actions.map(a => [a.id, a.status]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    return true;
  } catch {
    return false;
  }
}

export function mergeWithPersisted(
  derived: Action[],
  persisted: Map<string, Status> | null
): Action[] {
  if (!persisted) return derived;

  return derived.map(action => {
    const persistedStatus = persisted.get(action.id);
    if (persistedStatus) {
      return { ...action, status: persistedStatus };
    }
    return action;
  });
}
