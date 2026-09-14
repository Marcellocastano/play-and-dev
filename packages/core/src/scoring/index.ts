import type { Achievement, Difficulty, QuestionAttempt, Session, UserProgress } from '../models/index.js';

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 25,
};

export const MAX_SPEED_BONUS = 5;
export const SPEED_BONUS_WINDOW_MS = 10_000;
export const MAX_STREAK_MULTIPLIER = 1.5;

export function speedBonus(timeMs: number): number {
  if (timeMs >= SPEED_BONUS_WINDOW_MS) return 0;
  return Math.round(MAX_SPEED_BONUS * (1 - timeMs / SPEED_BONUS_WINDOW_MS));
}

export function streakMultiplier(streak: number): number {
  return Math.min(1 + Math.min(streak, 10) * 0.05, MAX_STREAK_MULTIPLIER);
}

/**
 * XP for a single correct answer; `streak` is the number of consecutive
 * correct answers *before* this one. Wrong answers earn 0.
 */
export function xpForAttempt(attempt: Pick<QuestionAttempt, 'correct' | 'difficulty' | 'timeMs'>, streak: number): number {
  if (!attempt.correct) return 0;
  const base = XP_BY_DIFFICULTY[attempt.difficulty] + speedBonus(attempt.timeMs);
  return Math.round(base * streakMultiplier(streak));
}

/** Total XP for a session's attempts, tracking the running streak. */
export function xpForSession(attempts: readonly QuestionAttempt[]): number {
  let streak = 0;
  let xp = 0;
  for (const a of attempts) {
    xp += xpForAttempt(a, streak);
    streak = a.correct ? streak + 1 : 0;
  }
  return xp;
}

export function maxStreak(attempts: readonly QuestionAttempt[]): number {
  let best = 0;
  let cur = 0;
  for (const a of attempts) {
    cur = a.correct ? cur + 1 : 0;
    if (cur > best) best = cur;
  }
  return best;
}

/** XP threshold to *reach* a given player level (level 1 = 0 XP). Quadratic growth. */
export function xpForLevel(level: number): number {
  const n = level - 1;
  return 50 * n * n + 50 * n;
}

export function playerLevelForXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  check(progress: UserProgress, session: Session): boolean;
}

export const BASE_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-session',
    name: 'Prima sessione',
    description: 'Completa la tua prima sessione di allenamento.',
    check: (progress) => progress.totalSessions >= 1,
  },
  {
    id: 'perfect-session',
    name: 'Sessione perfetta',
    description: 'Rispondi correttamente a tutte le domande di una sessione.',
    check: (_progress, session) =>
      session.attempts.length > 0 && session.attempts.every((a) => a.correct),
  },
  {
    id: 'streak-10',
    name: 'Serie di 10',
    description: 'Raggiungi una serie di 10 risposte corrette consecutive.',
    check: (_progress, session) => maxStreak(session.attempts) >= 10,
  },
];

/** Returns achievements unlocked now that were not already in progress.achievements. */
export function evaluateAchievements(
  progress: UserProgress,
  session: Session,
  defs: readonly AchievementDefinition[] = BASE_ACHIEVEMENTS,
): Achievement[] {
  const already = new Set(progress.achievements.map((a) => a.id));
  const unlocked: Achievement[] = [];
  for (const def of defs) {
    if (already.has(def.id)) continue;
    if (def.check(progress, session)) {
      unlocked.push({
        id: def.id,
        name: def.name,
        description: def.description,
        unlockedAt: session.finishedAt ?? Date.now(),
      });
    }
  }
  return unlocked;
}
