import type { Difficulty, MasteryBand, QuestionAttempt } from '../models/index.js';

export const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

export const MASTERY_HALF_LIFE_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Topic mastery in 0-100: accuracy weighted by difficulty, decayed
 * exponentially (half-life 14 days) since the last practice.
 * Zero attempts → 0.
 */
export function computeTopicMastery(
  attempts: readonly QuestionAttempt[],
  now: number,
): number {
  if (attempts.length === 0) return 0;
  let weightedCorrect = 0;
  let weightedTotal = 0;
  let lastAt = 0;
  for (const a of attempts) {
    const w = DIFFICULTY_WEIGHT[a.difficulty];
    weightedTotal += w;
    if (a.correct) weightedCorrect += w;
    if (a.answeredAt > lastAt) lastAt = a.answeredAt;
  }
  const accuracy = (weightedCorrect / weightedTotal) * 100;
  const age = Math.max(0, now - lastAt);
  const decay = Math.pow(0.5, age / MASTERY_HALF_LIFE_MS);
  return Math.round(Math.min(100, Math.max(0, accuracy * decay)) * 10) / 10;
}

export function masteryBand(score: number): MasteryBand {
  if (score <= 20) return 'unknown';
  if (score <= 40) return 'weak';
  if (score <= 60) return 'learning';
  if (score <= 80) return 'good';
  if (score <= 95) return 'strong';
  return 'mastered';
}
