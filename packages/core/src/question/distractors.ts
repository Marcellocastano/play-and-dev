/**
 * Returns `n` unique distractors: candidates minus duplicates and minus values
 * equal to the correct answer. Throws when not enough distinct candidates remain.
 */
export function uniqueDistractors<T>(correct: T, candidates: readonly T[], n: number): T[] {
  const seen = new Set<T>([correct]);
  const out: T[] = [];
  for (const c of candidates) {
    if (seen.has(c)) continue;
    seen.add(c);
    out.push(c);
    if (out.length === n) break;
  }
  if (out.length < n) {
    throw new Error(
      `uniqueDistractors: need ${n} distractors, only ${out.length} distinct candidates available`,
    );
  }
  return out;
}
