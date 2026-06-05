const REFERENCE_DATE = new Date("2026-06-03T00:00:00Z");

export function formatRelativeDate(isoString: string): string {
  const d = new Date(isoString);
  const diffMs = REFERENCE_DATE.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return "today";
  } else if (diffHours < 48) {
    return "yesterday";
  } else {
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  }
}
