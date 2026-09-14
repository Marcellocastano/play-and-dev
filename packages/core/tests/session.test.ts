import { describe, expect, it } from 'vitest';
import {
  applyAnswer,
  composeSession,
  difficultyCounts,
  emptyProgress,
  summarizeSession,
  type Question,
  type QuestionAttempt,
} from '../src/index.js';
import { makeSubject } from './fixtures.js';

const subject = makeSubject({ topics: 4, easy: 20, medium: 10, hard: 5 });

function attemptFor(q: Question, correct: boolean, timeMs = 5000): QuestionAttempt {
  return {
    questionId: q.id,
    templateId: q.templateId,
    topicId: q.topicId,
    subtopicId: q.subtopicId,
    type: q.type,
    difficulty: q.difficulty,
    correct,
    selectedOptionId: correct ? q.correctOptionId : 'wrong',
    timeMs,
    attempt: 1,
    answeredAt: Date.now(),
  };
}

describe('difficultyCounts', () => {
  it('matches the level mix and sums to count', () => {
    expect(difficultyCounts('beginner', 20)).toEqual({ easy: 12, medium: 6, hard: 2 });
    expect(difficultyCounts('intermediate', 20)).toEqual({ easy: 6, medium: 9, hard: 5 });
    expect(difficultyCounts('advanced', 20)).toEqual({ easy: 2, medium: 5, hard: 13 });
  });
});

describe('composeSession', () => {
  it('composes 20 questions with the beginner difficulty mix', () => {
    const s = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 1 });
    expect(s.questions).toHaveLength(20);
    const by = { easy: 0, medium: 0, hard: 0 };
    for (const q of s.questions) by[q.difficulty]++;
    expect(by).toEqual({ easy: 12, medium: 6, hard: 2 });
  });

  it('never repeats a template when enough templates exist', () => {
    const s = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 2 });
    const ids = s.questions.map((q) => q.templateId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('allows template reuse with distinct variantKeys when templates are scarce', () => {
    const small = makeSubject({ topics: 1, easy: 3, medium: 0, hard: 0 });
    const s = composeSession({ subject: small, levelId: 'beginner', mode: 'training', seed: 3, count: 6 });
    expect(s.questions).toHaveLength(6);
    expect(new Set(s.questions.map((q) => q.variantKey)).size).toBe(6);
  });

  it('is deterministic for the same seed', () => {
    const a = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 9 });
    const b = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 9 });
    expect(a.questions.map((q) => q.variantKey)).toEqual(b.questions.map((q) => q.variantKey));
  });

  it('excludes variantKeys from recent history', () => {
    const first = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 5 });
    const history = first.questions.map((q) => ({
      templateId: q.templateId,
      variantKey: q.variantKey,
      sessionId: 's1',
      answeredAt: Date.now(),
    }));
    const second = composeSession({
      subject,
      levelId: 'beginner',
      mode: 'training',
      seed: 5,
      history,
    });
    const seen = new Set(history.map((h) => h.variantKey));
    for (const q of second.questions) {
      expect(seen.has(q.variantKey)).toBe(false);
    }
  });

  it('falls back to other difficulties when one is missing', () => {
    const noHard = makeSubject({ topics: 3, easy: 15, medium: 10, hard: 0 });
    const s = composeSession({ subject: noHard, levelId: 'beginner', mode: 'training', seed: 4 });
    expect(s.questions).toHaveLength(20);
    expect(s.questions.every((q) => q.difficulty !== 'hard')).toBe(true);
  });

  it('favors low-mastery topics when progress is provided', () => {
    // 4 topics, only 2 slots per session → weighted order decides inclusion.
    const fourTopics = makeSubject({ topics: 4, easy: 40, medium: 0, hard: 0 });
    const mastered = (topicId: string) => ({
      topicId, score: 100, band: 'mastered' as const, attempts: 10, weightedCorrect: 10, weightedTotal: 10,
    });
    const progress = {
      ...emptyProgress(fourTopics.id),
      topicMastery: {
        t0: { topicId: 't0', score: 0, band: 'unknown' as const, attempts: 0, weightedCorrect: 0, weightedTotal: 0 },
        t1: mastered('t1'),
        t2: mastered('t2'),
        t3: mastered('t3'),
      },
    };
    let t0Count = 0;
    let t1Count = 0;
    const RUNS = 200;
    for (let seed = 0; seed < RUNS; seed++) {
      const s = composeSession({
        subject: fourTopics,
        levelId: 'beginner',
        mode: 'training',
        seed,
        progress,
        count: 2,
      });
      const topics = new Set(s.questions.map((q) => q.topicId));
      if (topics.has('t0')) t0Count++;
      if (topics.has('t1')) t1Count++;
    }
    // t0 has weight 2 vs 1 for the mastered topics → included far more often
    expect(t0Count).toBeGreaterThan(t1Count);
    expect(t0Count / RUNS).toBeGreaterThan(0.6);
  });
});

describe('applyAnswer / summarizeSession', () => {
  it('applyAnswer is pure and appends', () => {
    const s = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 1 });
    const a = attemptFor(s.questions[0]!, true);
    const s2 = applyAnswer(s, a);
    expect(s.attempts).toHaveLength(0);
    expect(s2.attempts).toHaveLength(1);
  });

  it('summarizes score, accuracy, streak and topics', () => {
    let s = composeSession({ subject, levelId: 'beginner', mode: 'training', seed: 1 });
    s.questions.forEach((q, i) => {
      s = applyAnswer(s, attemptFor(q, i % 4 !== 3, 3000));
    });
    const summary = summarizeSession(s);
    expect(summary.correct).toBe(15);
    expect(summary.incorrect).toBe(5);
    expect(summary.accuracy).toBe(75);
    expect(summary.xp).toBeGreaterThan(0);
    expect(summary.maxStreak).toBe(3);
    expect(summary.avgTimeMs).toBe(3000);
    expect(summary.bestTopics.length).toBeGreaterThan(0);
    expect(summary.worstTopics.length).toBeGreaterThan(0);
  });
});
