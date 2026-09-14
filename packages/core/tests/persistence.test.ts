import { describe, expect, it } from 'vitest';
import {
  emptyProgress,
  InMemoryPersistence,
  recentVariantKeys,
  type QuestionHistoryEntry,
  type Session,
} from '../src/index.js';

describe('InMemoryPersistence', () => {
  it('round-trips users, sessions, answers, progress and history', async () => {
    const p = new InMemoryPersistence();

    await p.saveUser({ id: 'u1', name: 'Ada', createdAt: 1 });
    expect(await p.getUser('u1')).toEqual({ id: 'u1', name: 'Ada', createdAt: 1 });
    expect(await p.getUser('missing')).toBeUndefined();

    const session: Session = {
      id: 's1',
      subjectId: 'js',
      levelId: 'beginner',
      mode: 'training',
      questions: [],
      attempts: [],
      startedAt: 0,
    };
    await p.saveSession(session);
    expect(await p.getSessions('js')).toHaveLength(1);
    expect(await p.getSessions('other')).toHaveLength(0);

    await p.saveAnswer('s1', {
      questionId: 'q1',
      templateId: 't1',
      topicId: 'topic',
      subtopicId: 'sub',
      type: 'multiple-choice',
      difficulty: 'easy',
      correct: true,
      selectedOptionId: 'a',
      timeMs: 100,
      attempt: 1,
      answeredAt: 2,
    });
    const stored = await p.getSessions('js');
    expect(stored[0]!.attempts).toHaveLength(1);

    const progress = { ...emptyProgress('js'), xp: 42 };
    await p.saveProgress(progress);
    expect((await p.getProgress('js'))!.xp).toBe(42);
    expect(await p.getProgress('other')).toBeUndefined();

    const entries: QuestionHistoryEntry[] = [
      { templateId: 't', variantKey: 'v1', sessionId: 's1', answeredAt: 10 },
      { templateId: 't', variantKey: 'v2', sessionId: 's2', answeredAt: 20 },
    ];
    await p.appendQuestionHistory('js', entries);
    expect(await p.getQuestionHistory('js')).toHaveLength(2);
  });
});

describe('recentVariantKeys', () => {
  const entry = (sessionId: string, variantKey: string, answeredAt: number): QuestionHistoryEntry => ({
    templateId: 't',
    variantKey,
    sessionId,
    answeredAt,
  });

  it('returns keys from the last N distinct sessions only', () => {
    const history = [
      entry('s1', 'a', 1),
      entry('s2', 'b', 2),
      entry('s3', 'c', 3),
      entry('s3', 'c2', 3),
      entry('s4', 'd', 4),
      entry('s5', 'e', 5),
      entry('s6', 'f', 6),
      entry('s7', 'g', 7),
    ];
    const keys = recentVariantKeys(history, 5);
    expect(keys.has('g')).toBe(true);
    expect(keys.has('c')).toBe(true);
    expect(keys.has('c2')).toBe(true);
    expect(keys.has('a')).toBe(false);
    expect(keys.has('b')).toBe(false);
  });

  it('defaults to 5 sessions and handles empty history', () => {
    expect(recentVariantKeys([]).size).toBe(0);
    const keys = recentVariantKeys([entry('s1', 'a', 1)]);
    expect(keys.has('a')).toBe(true);
  });
});
