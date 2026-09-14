import { describe, expect, it } from 'vitest';
import {
  evaluateAchievements,
  maxStreak,
  playerLevelForXp,
  speedBonus,
  streakMultiplier,
  xpForAttempt,
  xpForLevel,
  xpForSession,
  type QuestionAttempt,
  type Session,
} from '../src/index.js';
import { emptyProgress } from '../src/index.js';

function att(correct: boolean, difficulty: 'easy' | 'medium' | 'hard' = 'easy', timeMs = 20000): QuestionAttempt {
  return {
    questionId: 'q',
    templateId: 't',
    topicId: 'topic',
    subtopicId: 'sub',
    type: 'multiple-choice',
    difficulty,
    correct,
    selectedOptionId: 'a',
    timeMs,
    attempt: 1,
    answeredAt: 0,
  };
}

describe('xp', () => {
  it('awards base xp by difficulty', () => {
    expect(xpForAttempt(att(true, 'easy'), 0)).toBe(10);
    expect(xpForAttempt(att(true, 'medium'), 0)).toBe(15);
    expect(xpForAttempt(att(true, 'hard'), 0)).toBe(25);
  });

  it('awards 0 for wrong answers', () => {
    expect(xpForAttempt(att(false), 10)).toBe(0);
  });

  it('speed bonus is linear and capped at +5 under 10s', () => {
    expect(speedBonus(0)).toBe(5);
    expect(speedBonus(5000)).toBe(3);
    expect(speedBonus(9999)).toBe(0);
    expect(speedBonus(10000)).toBe(0);
    expect(speedBonus(15000)).toBe(0);
  });

  it('streak multiplier grows by 5% capped at 1.5x', () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(2)).toBeCloseTo(1.1);
    expect(streakMultiplier(10)).toBeCloseTo(1.5);
    expect(streakMultiplier(50)).toBeCloseTo(1.5);
  });

  it('xpForSession applies the running streak', () => {
    const attempts = [att(true, 'easy'), att(true, 'easy'), att(false), att(true, 'easy')];
    // streaks before each: 0,1,*,0 → 10 + 11 + 0 + 10 = 31
    expect(xpForSession(attempts)).toBe(31);
  });
});

describe('maxStreak', () => {
  it('tracks the longest correct run', () => {
    expect(maxStreak([att(true), att(true), att(false), att(true)])).toBe(2);
    expect(maxStreak([])).toBe(0);
  });
});

describe('playerLevelForXp', () => {
  it('uses increasing thresholds', () => {
    expect(playerLevelForXp(0)).toBe(1);
    expect(playerLevelForXp(99)).toBe(1);
    expect(playerLevelForXp(xpForLevel(2))).toBe(2);
    expect(playerLevelForXp(xpForLevel(5) - 1)).toBe(4);
    expect(playerLevelForXp(xpForLevel(5))).toBe(5);
    // thresholds strictly increase
    for (let l = 2; l < 10; l++) {
      expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l));
    }
  });
});

describe('evaluateAchievements', () => {
  const session = (attempts: QuestionAttempt[]): Session => ({
    id: 's1',
    subjectId: 'sub',
    levelId: 'beginner',
    mode: 'training',
    questions: [],
    attempts,
    startedAt: 0,
    finishedAt: 1000,
  });

  it('unlocks first-session after the first session', () => {
    const progress = { ...emptyProgress('sub'), totalSessions: 1 };
    const unlocked = evaluateAchievements(progress, session([att(true)]));
    expect(unlocked.map((a) => a.id)).toContain('first-session');
  });

  it('unlocks perfect-session only when all answers are correct', () => {
    const p = { ...emptyProgress('sub'), totalSessions: 1 };
    expect(
      evaluateAchievements(p, session([att(true), att(true)])).map((a) => a.id),
    ).toContain('perfect-session');
    expect(
      evaluateAchievements(p, session([att(true), att(false)])).map((a) => a.id),
    ).not.toContain('perfect-session');
  });

  it('unlocks streak-10 on a 10-correct run', () => {
    const p = { ...emptyProgress('sub'), totalSessions: 1 };
    const unlocked = evaluateAchievements(
      p,
      session(Array.from({ length: 10 }, () => att(true))),
    );
    expect(unlocked.map((a) => a.id)).toContain('streak-10');
  });

  it('does not re-unlock achievements already earned', () => {
    const p = {
      ...emptyProgress('sub'),
      totalSessions: 1,
      achievements: [{ id: 'first-session', name: '', description: '' }],
    };
    const unlocked = evaluateAchievements(p, session([att(true)]));
    expect(unlocked.map((a) => a.id)).not.toContain('first-session');
  });
});
