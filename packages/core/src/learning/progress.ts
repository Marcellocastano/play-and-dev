import type {
  QuestionAttempt,
  Session,
  SubjectDefinition,
  TopicMastery,
  UserProgress,
} from '../models/index.js';
import { evaluateAchievements, playerLevelForXp } from '../scoring/index.js';
import { summarizeSession } from '../session/engine.js';
import { DIFFICULTY_WEIGHT, masteryBand } from './mastery.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function dayNumber(ts: number): number {
  return Math.floor(ts / DAY_MS);
}

/** Recomputes a TopicMastery from cumulative weighted sums + recency decay. */
export function refreshTopicMastery(m: TopicMastery, nowTs: number): TopicMastery {
  const score =
    m.weightedTotal === 0
      ? 0
      : Math.round(
          Math.min(
            100,
            (m.weightedCorrect / m.weightedTotal) *
              100 *
              Math.pow(0.5, Math.max(0, nowTs - (m.lastPracticedAt ?? nowTs)) / (14 * DAY_MS)),
          ) * 10,
        ) / 10;
  return { ...m, score, band: masteryBand(score) };
}

/**
 * Returns a new UserProgress updated after a finished session:
 * xp, player level, daily streak, per-topic mastery, achievements.
 */
export function updateProgressAfterSession(
  progress: UserProgress,
  session: Session,
  subject: SubjectDefinition,
): UserProgress {
  const finishedAt = session.finishedAt ?? Date.now();
  const summary = session.summary ?? summarizeSession(session);

  const next: UserProgress = {
    ...progress,
    topicMastery: { ...progress.topicMastery },
    achievements: [...progress.achievements],
    xp: progress.xp + summary.xp,
    totalSessions: progress.totalSessions + 1,
    lastSessionAt: finishedAt,
  };
  next.playerLevel = playerLevelForXp(next.xp);

  // daily streak
  if (progress.lastSessionAt === undefined) {
    next.currentStreak = 1;
  } else {
    const gap = dayNumber(finishedAt) - dayNumber(progress.lastSessionAt);
    next.currentStreak = gap === 0 ? progress.currentStreak : gap === 1 ? progress.currentStreak + 1 : 1;
  }
  next.bestStreak = Math.max(next.bestStreak, next.currentStreak);

  // per-topic mastery from this session's attempts
  const byTopic = new Map<string, QuestionAttempt[]>();
  for (const a of session.attempts) {
    const list = byTopic.get(a.topicId) ?? [];
    list.push(a);
    byTopic.set(a.topicId, list);
  }
  for (const [topicId, attempts] of byTopic) {
    const prev =
      next.topicMastery[topicId] ??
      ({ topicId, score: 0, band: 'unknown', attempts: 0, weightedCorrect: 0, weightedTotal: 0 } as TopicMastery);
    let wc = prev.weightedCorrect;
    let wt = prev.weightedTotal;
    for (const a of attempts) {
      const w = DIFFICULTY_WEIGHT[a.difficulty];
      wt += w;
      if (a.correct) wc += w;
    }
    next.topicMastery[topicId] = refreshTopicMastery(
      {
        ...prev,
        attempts: prev.attempts + attempts.length,
        weightedCorrect: wc,
        weightedTotal: wt,
        lastPracticedAt: finishedAt,
      },
      finishedAt,
    );
  }

  const newAchievements = evaluateAchievements(next, session);
  next.achievements = [...next.achievements, ...newAchievements];

  void subject;
  return next;
}

export function emptyProgress(subjectId: string): UserProgress {
  return {
    subjectId,
    xp: 0,
    playerLevel: 1,
    totalSessions: 0,
    currentStreak: 0,
    bestStreak: 0,
    topicMastery: {},
    achievements: [],
  };
}
