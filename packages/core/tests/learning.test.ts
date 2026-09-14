import { describe, expect, it } from 'vitest';
import {
  buildRecommendations,
  computeTopicMastery,
  emptyProgress,
  masteryBand,
  updateProgressAfterSession,
  type QuestionAttempt,
  type Session,
} from '../src/index.js';
import { makeSubject } from './fixtures.js';

const DAY = 24 * 60 * 60 * 1000;

function att(topicId: string, correct: boolean, difficulty: 'easy' | 'medium' | 'hard' = 'easy', answeredAt = 0): QuestionAttempt {
  return {
    questionId: 'q',
    templateId: 't',
    topicId,
    subtopicId: 'sub',
    type: 'multiple-choice',
    difficulty,
    correct,
    selectedOptionId: 'a',
    timeMs: 5000,
    attempt: 1,
    answeredAt,
  };
}

describe('computeTopicMastery', () => {
  it('returns 0 with no attempts', () => {
    expect(computeTopicMastery([], Date.now())).toBe(0);
  });

  it('weights accuracy by difficulty', () => {
    const now = Date.now();
    // hard correct (w2) + easy wrong (w1) → 2/3 → 66.7
    const score = computeTopicMastery([att('t', true, 'hard', now), att('t', false, 'easy', now)], now);
    expect(score).toBeCloseTo(66.7, 1);
  });

  it('decays with a 14-day half-life since last practice', () => {
    const now = Date.now();
    const fresh = computeTopicMastery([att('t', true, 'easy', now)], now);
    expect(fresh).toBe(100);
    const stale = computeTopicMastery([att('t', true, 'easy', now - 14 * DAY)], now);
    expect(stale).toBeCloseTo(50, 0);
    const veryStale = computeTopicMastery([att('t', true, 'easy', now - 28 * DAY)], now);
    expect(veryStale).toBeCloseTo(25, 0);
  });
});

describe('masteryBand', () => {
  it('maps score ranges to bands', () => {
    expect(masteryBand(0)).toBe('unknown');
    expect(masteryBand(20)).toBe('unknown');
    expect(masteryBand(21)).toBe('weak');
    expect(masteryBand(40)).toBe('weak');
    expect(masteryBand(41)).toBe('learning');
    expect(masteryBand(60)).toBe('learning');
    expect(masteryBand(61)).toBe('good');
    expect(masteryBand(80)).toBe('good');
    expect(masteryBand(81)).toBe('strong');
    expect(masteryBand(95)).toBe('strong');
    expect(masteryBand(96)).toBe('mastered');
    expect(masteryBand(100)).toBe('mastered');
  });
});

describe('updateProgressAfterSession', () => {
  const subject = makeSubject({ topics: 2, easy: 4, medium: 0, hard: 0 });
  const session = (attempts: QuestionAttempt[], finishedAt: number): Session => ({
    id: 's1',
    subjectId: subject.id,
    levelId: 'beginner',
    mode: 'training',
    questions: [],
    attempts,
    startedAt: finishedAt - 1000,
    finishedAt,
  });

  it('accumulates xp, level, streak, mastery and achievements', () => {
    const t0 = Date.now();
    const attempts = subject.topics.map((t) => att(t.id, true, 'easy', t0));
    let p = emptyProgress(subject.id);
    p = updateProgressAfterSession(p, session(attempts, t0), subject);

    expect(p.totalSessions).toBe(1);
    expect(p.xp).toBeGreaterThan(0);
    expect(p.playerLevel).toBeGreaterThanOrEqual(1);
    expect(p.currentStreak).toBe(1);
    expect(p.bestStreak).toBe(1);
    for (const t of subject.topics) {
      expect(p.topicMastery[t.id]!.attempts).toBe(1);
      expect(p.topicMastery[t.id]!.score).toBe(100);
      expect(p.topicMastery[t.id]!.band).toBe('mastered');
    }
    expect(p.achievements.map((a) => a.id)).toContain('first-session');
    expect(p.achievements.map((a) => a.id)).toContain('perfect-session');
  });

  it('increments the daily streak on consecutive days and resets after a gap', () => {
    const t0 = 40 * DAY;
    let p = emptyProgress(subject.id);
    p = updateProgressAfterSession(p, session([att('t0', true)], t0), subject);
    p = updateProgressAfterSession(p, session([att('t0', true)], t0 + DAY), subject);
    expect(p.currentStreak).toBe(2);
    p = updateProgressAfterSession(p, session([att('t0', true)], t0 + 5 * DAY), subject);
    expect(p.currentStreak).toBe(1);
    expect(p.bestStreak).toBe(2);
  });
});

describe('buildRecommendations', () => {
  it('returns 2-4 motivated recommendations', () => {
    const subject = makeSubject({ topics: 5, easy: 1, medium: 0, hard: 0 });
    const p = emptyProgress(subject.id);
    // t0 weak (practiced, low score), t1 good, others unexplored
    p.topicMastery = {
      t0: { topicId: 't0', score: 30, band: 'weak', attempts: 3, weightedCorrect: 1, weightedTotal: 3 },
      t1: { topicId: 't1', score: 70, band: 'good', attempts: 5, weightedCorrect: 4, weightedTotal: 5 },
    };
    const recs = buildRecommendations(p, subject);
    expect(recs.length).toBeGreaterThanOrEqual(2);
    expect(recs.length).toBeLessThanOrEqual(4);
    expect(recs[0]!.kind).toBe('weak');
    expect(recs[0]!.topicId).toBe('t0');
    expect(recs.some((r) => r.kind === 'unexplored')).toBe(true);
    for (const r of recs) expect(r.reason.length).toBeGreaterThan(0);
  });
});
