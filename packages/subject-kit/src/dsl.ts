import { shuffle, type Difficulty, type Option, type QuestionTemplate } from '@lg/core';

export { shuffle };

export type Rng = () => number;

export function pickInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pickInts(rng: Rng, n: number, min: number, max: number, unique = false): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  let guard = 0;
  while (out.length < n && guard++ < 1000) {
    const v = pickInt(rng, min, max);
    if (unique && seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  if (out.length < n) throw new Error('pickInts: range troppo piccolo');
  return out;
}

export function pickOf<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

export interface Distractor {
  text: string;
  why: string;
}

export interface BuiltOptions {
  options: Option[];
  correctOptionId: string;
  why: Record<string, string>;
}

export function makeOptions(
  rng: Rng,
  correct: Distractor,
  distractors: readonly Distractor[],
): BuiltOptions {
  const byText = new Map<string, Distractor>();
  for (const d of distractors) {
    if (d.text !== correct.text && !byText.has(d.text)) byText.set(d.text, d);
  }
  const finalDistractors = [...byText.values()].slice(0, 3);
  if (finalDistractors.length < 3) {
    throw new Error('makeOptions: distrattori insufficienti o duplicati');
  }
  const all = shuffle([correct, ...finalDistractors], rng);
  const options = all.map((d, i) => ({ id: `opt${i}`, text: d.text }));
  const correctOptionId = options[all.indexOf(correct)]!.id;
  const why: Record<string, string> = {};
  for (const o of options) {
    if (o.id === correctOptionId) continue;
    const src = all.find((d) => d.text === o.text)!;
    why[o.id] = src.why;
  }
  return { options, correctOptionId, why };
}

export function retry<T>(fn: () => T, limit = 60): T {
  let lastError: unknown;
  for (let i = 0; i < limit; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export interface TemplateMeta {
  id: string;
  topicId: string;
  subtopicId: string;
  type: string;
  difficulty: Difficulty;
  skills: string[];
  tags?: string[];
}

export interface Draft {
  prompt: string;
  code?: string;
  correct: Distractor;
  distractors: Distractor[];
  short: string;
  whyCorrect: string;
  concept?: string;
  commonMistake?: string;
  example?: string;
}

export function defineTemplate(meta: TemplateMeta, build: (rng: Rng) => Draft): QuestionTemplate {
  return {
    id: meta.id,
    topicId: meta.topicId,
    subtopicId: meta.subtopicId,
    type: meta.type,
    difficulty: meta.difficulty,
    skills: meta.skills,
    tags: meta.tags ?? [],
    generate(rng) {
      return retry(() => {
        const d = build(rng);
        const built = makeOptions(rng, d.correct, d.distractors);
        return {
          templateId: meta.id,
          type: meta.type,
          difficulty: meta.difficulty,
          topicId: meta.topicId,
          subtopicId: meta.subtopicId,
          skills: meta.skills,
          prompt: d.prompt,
          code: d.code,
          format: 'choice' as const,
          options: built.options,
          correctOptionId: built.correctOptionId,
          explanation: {
            short: d.short,
            whyCorrect: d.whyCorrect,
            why: built.why,
            concept: d.concept,
            commonMistake: d.commonMistake,
            example: d.example,
          },
          deepDiveRef: `dd-${meta.topicId}`,
        };
      });
    },
  };
}

interface ExplainFields {
  short: string;
  whyCorrect: string;
  concept?: string;
  commonMistake?: string;
  example?: string;
}

function baseQuestion(meta: TemplateMeta, d: { prompt: string; code?: string }) {
  return {
    templateId: meta.id,
    type: meta.type,
    difficulty: meta.difficulty,
    topicId: meta.topicId,
    subtopicId: meta.subtopicId,
    skills: meta.skills,
    prompt: d.prompt,
    code: d.code,
    deepDiveRef: `dd-${meta.topicId}`,
  };
}

export interface CategorizeDraft extends ExplainFields {
  prompt: string;
  code?: string;
  categories: { id: string; text: string }[];
  items: { text: string; categoryId: string; why: string }[];
}

export function defineCategorize(
  meta: TemplateMeta,
  build: (rng: Rng) => CategorizeDraft,
): QuestionTemplate {
  return {
    id: meta.id,
    topicId: meta.topicId,
    subtopicId: meta.subtopicId,
    type: meta.type,
    difficulty: meta.difficulty,
    skills: meta.skills,
    tags: meta.tags ?? [],
    generate(rng) {
      return retry(() => {
        const d = build(rng);
        const items = shuffle(
          d.items.map((it, i) => ({ id: `i${i}`, text: it.text, categoryId: it.categoryId })),
          rng,
        );
        const why: Record<string, string> = {};
        d.items.forEach((it, i) => {
          why[`i${i}`] = it.why;
        });
        return {
          ...baseQuestion(meta, d),
          format: 'categorize' as const,
          categories: d.categories,
          items,
          explanation: {
            short: d.short,
            whyCorrect: d.whyCorrect,
            why,
            concept: d.concept,
            commonMistake: d.commonMistake,
            example: d.example,
          },
        };
      });
    },
  };
}

export interface MatchDraft extends ExplainFields {
  prompt: string;
  code?: string;
  choices: string[];
  rows: { text: string; choice: string; why: string }[];
}

export function defineMatch(meta: TemplateMeta, build: (rng: Rng) => MatchDraft): QuestionTemplate {
  return {
    id: meta.id,
    topicId: meta.topicId,
    subtopicId: meta.subtopicId,
    type: meta.type,
    difficulty: meta.difficulty,
    skills: meta.skills,
    tags: meta.tags ?? [],
    generate(rng) {
      return retry(() => {
        const d = build(rng);
        const choiceIds = new Map<string, string>();
        const choices = d.choices.map((text, i) => {
          const id = `c${i}`;
          choiceIds.set(text, id);
          return { id, text };
        });
        const rows = shuffle(
          d.rows.map((r, i) => {
            const choiceId = choiceIds.get(r.choice);
            if (!choiceId) throw new Error(`defineMatch: scelta assente per la riga "${r.text}"`);
            return { id: `r${i}`, text: r.text, choiceId };
          }),
          rng,
        );
        const why: Record<string, string> = {};
        d.rows.forEach((r, i) => {
          why[`r${i}`] = r.why;
        });
        return {
          ...baseQuestion(meta, d),
          format: 'match' as const,
          choices,
          rows,
          explanation: {
            short: d.short,
            whyCorrect: d.whyCorrect,
            why,
            concept: d.concept,
            commonMistake: d.commonMistake,
            example: d.example,
          },
        };
      });
    },
  };
}

export interface TrueFalseDraft extends ExplainFields {
  prompt: string;
  code?: string;
  statements: { text: string; value: boolean; why: string }[];
}

export function defineTrueFalse(
  meta: TemplateMeta,
  build: (rng: Rng) => TrueFalseDraft,
): QuestionTemplate {
  return {
    id: meta.id,
    topicId: meta.topicId,
    subtopicId: meta.subtopicId,
    type: meta.type,
    difficulty: meta.difficulty,
    skills: meta.skills,
    tags: meta.tags ?? [],
    generate(rng) {
      return retry(() => {
        const d = build(rng);
        const statements = d.statements.map((s, i) => ({
          id: `s${i}`,
          text: s.text,
          value: s.value,
        }));
        if (!statements.some((s) => s.value) || !statements.some((s) => !s.value)) {
          throw new Error('defineTrueFalse: servono affermazioni vere e false');
        }
        const why: Record<string, string> = {};
        d.statements.forEach((s, i) => {
          why[`s${i}`] = s.why;
        });
        return {
          ...baseQuestion(meta, d),
          format: 'true-false' as const,
          statements,
          explanation: {
            short: d.short,
            whyCorrect: d.whyCorrect,
            why,
            concept: d.concept,
            commonMistake: d.commonMistake,
            example: d.example,
          },
        };
      });
    },
  };
}
