import type {
  Difficulty,
  GameMode,
  LevelId,
  Question,
  QuestionAttempt,
  QuestionTemplate,
  Session,
  SessionSummary,
  SubjectDefinition,
  UserProgress,
} from '../models/index.js';
import { generateQuestion } from '../question/generator.js';
import { recentVariantKeys, type QuestionHistoryEntry } from '../question/antiDup.js';
import { maxStreak, xpForSession } from '../scoring/index.js';
import { id, now, seededRandom, shuffle } from '../utils/index.js';

export const DIFFICULTY_MIX: Record<LevelId, Record<Difficulty, number>> = {
  beginner: { easy: 0.6, medium: 0.3, hard: 0.1 },
  intermediate: { easy: 0.3, medium: 0.45, hard: 0.25 },
  advanced: { easy: 0.1, medium: 0.25, hard: 0.65 },
};

const MAX_VARIANT_ATTEMPTS = 30;

export interface ComposeSessionInput {
  subject: SubjectDefinition;
  levelId: LevelId;
  mode: GameMode;
  progress?: UserProgress;
  history?: readonly QuestionHistoryEntry[];
  seed: number;
  count?: number;
}

/** Largest-remainder apportionment of `count` over the mix; sums to `count`. */
export function difficultyCounts(
  levelId: LevelId,
  count: number,
): Record<Difficulty, number> {
  const mix = DIFFICULTY_MIX[levelId];
  const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
  const raw = diffs.map((d) => ({ d, exact: mix[d] * count }));
  const counts: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  let assigned = 0;
  for (const r of raw) {
    counts[r.d] = Math.floor(r.exact);
    assigned += counts[r.d];
  }
  const byRemainder = raw
    .slice()
    .sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)));
  for (let i = 0; assigned < count; i = (i + 1) % byRemainder.length) {
    counts[byRemainder[i]!.d]++;
    assigned++;
  }
  return counts;
}

function topicWeight(topicId: string, progress: UserProgress | undefined): number {
  const mastery = progress?.topicMastery[topicId]?.score ?? 0;
  return 1 + (100 - mastery) / 100;
}

/** Weighted shuffle: samples all ids without replacement, probability ∝ weight. */
function weightedOrder(ids: string[], weight: (id: string) => number, rng: () => number): string[] {
  const remaining = ids.slice();
  const out: string[] = [];
  while (remaining.length > 0) {
    const total = remaining.reduce((s, id) => s + weight(id), 0);
    let r = rng() * total;
    let idx = remaining.length - 1;
    for (let i = 0; i < remaining.length; i++) {
      r -= weight(remaining[i]!);
      if (r < 0) {
        idx = i;
        break;
      }
    }
    out.push(remaining.splice(idx, 1)[0]!);
  }
  return out;
}

/**
 * Pick `n` templates for one difficulty, cycling across topics so the
 * distribution is balanced. Each round-robin pass visits the topics in a
 * weighted-shuffle order (probability ∝ topicWeight), so low-mastery topics
 * are drawn earlier more often while the spread stays random.
 * Reuses templates (wrapping) when the pool is smaller than `n`.
 */
function pickTemplates(
  pool: readonly QuestionTemplate[],
  n: number,
  progress: UserProgress | undefined,
  rng: () => number,
): QuestionTemplate[] {
  const byTopic = new Map<string, QuestionTemplate[]>();
  for (const t of shuffle(pool, rng)) {
    const list = byTopic.get(t.topicId) ?? [];
    list.push(t);
    byTopic.set(t.topicId, list);
  }
  const topicIds = [...byTopic.keys()];
  const out: QuestionTemplate[] = [];
  const cursor = new Map<string, number>();
  while (out.length < n && topicIds.length > 0) {
    for (const topicId of weightedOrder(topicIds, (t) => topicWeight(t, progress), rng)) {
      if (out.length >= n) break;
      const list = byTopic.get(topicId)!;
      const i = cursor.get(topicId) ?? 0;
      out.push(list[i % list.length]!);
      cursor.set(topicId, i + 1);
    }
  }
  return out;
}

export function composeSession(input: ComposeSessionInput): Session {
  const { subject, levelId, mode, progress, seed } = input;
  const count = input.count ?? 20;
  const history = input.history ?? [];

  const level = subject.levels.find((l) => l.id === levelId);
  if (!level) throw new Error(`Unknown level ${levelId} for subject ${subject.id}`);

  const levelTopicIds = new Set(level.topicIds);
  const topicIds = new Set(
    subject.topics.filter((t) => t.levelId === levelId && levelTopicIds.has(t.id)).map((t) => t.id),
  );
  const templates = subject.templates.filter((t) => topicIds.has(t.topicId));
  if (templates.length === 0) {
    throw new Error(`No templates for level ${levelId} of subject ${subject.id}`);
  }

  const rng = seededRandom(seed);
  const recent = recentVariantKeys(history);
  const counts = difficultyCounts(levelId, count);

  const poolByDifficulty = new Map<Difficulty, QuestionTemplate[]>();
  for (const t of templates) {
    const list = poolByDifficulty.get(t.difficulty) ?? [];
    list.push(t);
    poolByDifficulty.set(t.difficulty, list);
  }

  // Redistribute slots of difficulties with no templates to those that have some.
  const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
  const available = diffs.filter((d) => (poolByDifficulty.get(d)?.length ?? 0) > 0);
  for (const d of diffs) {
    if ((poolByDifficulty.get(d)?.length ?? 0) === 0 && counts[d] > 0) {
      let remaining = counts[d]!;
      counts[d] = 0;
      for (let i = 0; remaining > 0; i = (i + 1) % available.length) {
        counts[available[i]!]++;
        remaining--;
      }
    }
  }

  const usedVariants = new Set<string>();
  const questions: Question[] = [];

  for (const d of diffs) {
    const pool = poolByDifficulty.get(d) ?? [];
    if (pool.length === 0 || counts[d] === 0) continue;
    const chosen = pickTemplates(pool, counts[d]!, progress, rng);
    for (const template of chosen) {
      let question: Question | undefined;
      for (let attemptIdx = 0; attemptIdx < MAX_VARIANT_ATTEMPTS; attemptIdx++) {
        const variantSeed = seed * 31 + attemptIdx * 7919 + questions.length * 104729;
        const candidate = generateQuestion(template, variantSeed);
        if (recent.has(candidate.variantKey) || usedVariants.has(candidate.variantKey)) continue;
        question = candidate;
        break;
      }
      if (!question) {
        question = generateQuestion(template, seed * 31 + questions.length * 104729 + 99991);
      }
      usedVariants.add(question.variantKey);
      questions.push(question);
    }
  }

  return {
    id: id('session'),
    subjectId: subject.id,
    levelId,
    mode,
    questions: shuffle(questions, rng),
    attempts: [],
    startedAt: now(),
  };
}

/** Pure: returns a new session with the attempt appended. */
export function applyAnswer(session: Session, attempt: QuestionAttempt): Session {
  return { ...session, attempts: [...session.attempts, attempt] };
}

export function summarizeSession(session: Session): SessionSummary {
  const attempts = session.attempts;
  const correct = attempts.filter((a) => a.correct).length;
  const incorrect = attempts.length - correct;
  const accuracy = attempts.length === 0 ? 0 : (correct / attempts.length) * 100;
  const xp = xpForSession(attempts);
  const avgTimeMs =
    attempts.length === 0 ? 0 : attempts.reduce((s, a) => s + a.timeMs, 0) / attempts.length;

  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const a of attempts) {
    const agg = byTopic.get(a.topicId) ?? { correct: 0, total: 0 };
    agg.total++;
    if (a.correct) agg.correct++;
    byTopic.set(a.topicId, agg);
  }
  const ranked = [...byTopic.entries()]
    .map(([topicId, s]) => ({ topicId, acc: s.correct / s.total }))
    .sort((a, b) => b.acc - a.acc);

  return {
    score: xp,
    accuracy: Math.round(accuracy * 10) / 10,
    xp,
    correct,
    incorrect,
    maxStreak: maxStreak(attempts),
    avgTimeMs: Math.round(avgTimeMs),
    bestTopics: ranked.slice(0, 3).map((r) => r.topicId),
    worstTopics: ranked.slice(-3).reverse().map((r) => r.topicId),
  };
}
