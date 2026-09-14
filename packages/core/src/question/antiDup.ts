export interface QuestionHistoryEntry {
  templateId: string;
  variantKey: string;
  sessionId: string;
  answeredAt: number;
}

/**
 * Variant keys seen in the last `lastNSessions` distinct sessions
 * (most recent first, ordered by answeredAt).
 */
export function recentVariantKeys(
  history: readonly QuestionHistoryEntry[],
  lastNSessions = 5,
): Set<string> {
  const sorted = history.slice().sort((a, b) => b.answeredAt - a.answeredAt);
  const sessionIds: string[] = [];
  const seen = new Set<string>();
  for (const e of sorted) {
    if (!seen.has(e.sessionId)) {
      seen.add(e.sessionId);
      sessionIds.push(e.sessionId);
      if (sessionIds.length === lastNSessions) break;
    }
  }
  const allowed = new Set(sessionIds);
  const keys = new Set<string>();
  for (const e of sorted) {
    if (allowed.has(e.sessionId)) keys.add(e.variantKey);
  }
  return keys;
}
