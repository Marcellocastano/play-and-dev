import { describe, expect, it } from 'vitest';
import {
  applyAnswer,
  composeSession,
  difficultyCounts,
  emptyProgress,
  MAX_SIMILAR_PER_SESSION,
  similarityKey,
  summarizeSession,
  type Question,
  type QuestionAttempt,
} from '../src/index.js';
import { makeSubject, makeTemplate } from './fixtures.js';

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
    response: {
      format: 'choice',
      optionId: correct && q.format === 'choice' ? q.correctOptionId : 'wrong',
    },
    score: correct ? 1 : 0,
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

  it('draws from an injected template pool instead of subject.templates', () => {
    const templates = [makeTemplate('only', 't0', 'easy')];
    const s = composeSession({
      subject,
      levelId: 'beginner',
      mode: 'training',
      seed: 2,
      count: 3,
      templates,
    });
    expect(s.questions.every((q) => q.templateId === 'only')).toBe(true);
  });

  it('lets a template with capacity contribute several distinct questions', () => {
    const base = makeTemplate('bank', 't0', 'easy');
    const bank = {
      ...base,
      capacity: 10,
      generate: (rng: () => number) => ({
        ...base.generate(rng),
        subtopicId: `t0-sub${Math.floor(rng() * 5)}`,
      }),
    };
    const s = composeSession({
      subject,
      levelId: 'beginner',
      mode: 'training',
      seed: 2,
      count: 6,
      templates: [bank, makeTemplate('single', 't1', 'easy')],
    });
    const byTemplate = new Map<string, number>();
    for (const q of s.questions) {
      byTemplate.set(q.templateId, (byTemplate.get(q.templateId) ?? 0) + 1);
    }
    expect(byTemplate.get('single')).toBe(1);
    expect(byTemplate.get('bank')).toBe(5);
    expect(new Set(s.questions.map((q) => q.variantKey)).size).toBe(6);
  });

  it('caps questions sharing topic, subtopic and type at MAX_SIMILAR_PER_SESSION', () => {
    // 2 topics × 1 subtopic × 1 type = 2 keys for 20 slots: the cap cannot be met, so it is relaxed.
    const many = makeSubject({ topics: 2, easy: 10, medium: 0, hard: 0 });
    const s = composeSession({ subject: many, levelId: 'beginner', mode: 'training', seed: 2 });
    expect(s.questions).toHaveLength(20);
    const small = makeSubject({ topics: 4, easy: 10, medium: 0, hard: 0 });
    const t = composeSession({
      subject: small,
      levelId: 'beginner',
      mode: 'training',
      seed: 2,
      count: 8,
    });
    const counts = new Map<string, number>();
    for (const q of t.questions)
      counts.set(similarityKey(q), (counts.get(similarityKey(q)) ?? 0) + 1);
    for (const n of counts.values()) expect(n).toBeLessThanOrEqual(MAX_SIMILAR_PER_SESSION);
  });

  it('allows template reuse with distinct variantKeys when templates are scarce', () => {
    const small = makeSubject({ topics: 1, easy: 3, medium: 0, hard: 0 });
    const s = composeSession({
      subject: small,
      levelId: 'beginner',
      mode: 'training',
      seed: 3,
      count: 6,
    });
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
      topicId,
      score: 100,
      band: 'mastered' as const,
      attempts: 10,
      weightedCorrect: 10,
      weightedTotal: 10,
    });
    const progress = {
      ...emptyProgress(fourTopics.id),
      topicMastery: {
        t0: {
          topicId: 't0',
          score: 0,
          band: 'unknown' as const,
          attempts: 0,
          weightedCorrect: 0,
          weightedTotal: 0,
        },
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

describe('TEXT_FORMAT_SHARE', () => {
  const poSubject = (() => {
    const s = makeSubject({ topics: 2, easy: 0, medium: 0, hard: 0 });
    s.templates = [
      makeTemplate('po-0', 't0', 'easy', 'predict-output'),
      makeTemplate('po-1', 't1', 'easy', 'predict-output'),
      makeTemplate('mc-0', 't0', 'easy'),
      makeTemplate('mc-1', 't1', 'easy'),
    ];
    return s;
  })();

  it('share 0 keeps every question in choice format', () => {
    const s = composeSession({
      subject: poSubject,
      levelId: 'beginner',
      mode: 'training',
      seed: 11,
      count: 8,
      textFormatShare: 0,
    });
    expect(s.questions.every((q) => q.format === 'choice')).toBe(true);
  });

  it('share 1 converts every predict-output to text, preserving variantKey', () => {
    const s = composeSession({
      subject: poSubject,
      levelId: 'beginner',
      mode: 'training',
      seed: 11,
      count: 8,
      textFormatShare: 1,
    });
    for (const q of s.questions) {
      if (q.type === 'predict-output') {
        expect(q.format).toBe('text');
        if (q.format === 'text') expect(q.accepted.length).toBeGreaterThan(0);
        expect(q.variantKey).toBeTruthy();
      } else {
        expect(q.format).toBe('choice');
      }
    }
  });
});
