import { z } from 'zod';
import type { GeneratedQuestion, Question } from '../models/index.js';
import { computeVariantKey } from '../question/generator.js';
import { validateQuestion } from '../question/validate.js';

const OptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const ExplanationSchema = z.object({
  short: z.string().min(1),
  whyCorrect: z.string().min(1),
  why: z.record(z.string(), z.string().min(1)),
  concept: z.string().optional(),
  commonMistake: z.string().optional(),
  example: z.string().optional(),
});

const BaseFields = {
  templateId: z.string().min(1),
  type: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topicId: z.string().min(1),
  subtopicId: z.string().min(1),
  skills: z.array(z.string()),
  prompt: z.string().min(1),
  code: z.string().optional(),
  explanation: ExplanationSchema,
  deepDiveRef: z.string().optional(),
};

const AIQuestionUnion = z.discriminatedUnion('format', [
  z.object({
    ...BaseFields,
    format: z.literal('choice'),
    options: z.array(OptionSchema).length(4),
    correctOptionId: z.string().min(1),
  }),
  z.object({
    ...BaseFields,
    format: z.literal('categorize'),
    categories: z.array(OptionSchema).min(2).max(3),
    items: z
      .array(z.object({ id: z.string().min(1), text: z.string().min(1), categoryId: z.string() }))
      .min(4)
      .max(8),
  }),
  z.object({
    ...BaseFields,
    format: z.literal('match'),
    choices: z.array(OptionSchema).min(2).max(4),
    rows: z
      .array(z.object({ id: z.string().min(1), text: z.string().min(1), choiceId: z.string() }))
      .min(3)
      .max(6),
  }),
  z.object({
    ...BaseFields,
    format: z.literal('true-false'),
    statements: z
      .array(z.object({ id: z.string().min(1), text: z.string().min(1), value: z.boolean() }))
      .min(4)
      .max(6),
  }),
  z.object({
    ...BaseFields,
    format: z.literal('text'),
    accepted: z.array(z.string().min(1)).min(1),
  }),
]);

export const AIQuestionSchema = z.preprocess(
  (v) =>
    typeof v === 'object' && v !== null && !('format' in v)
      ? { ...(v as Record<string, unknown>), format: 'choice' }
      : v,
  AIQuestionUnion,
);

export type AIQuestionInput = z.infer<typeof AIQuestionUnion>;

export interface ValidateAIQuestionResult {
  ok: boolean;
  errors: string[];
  question?: Question;
}

/** Parses unknown JSON against the schema, then applies full question validation. */
export function validateAIQuestion(json: unknown): ValidateAIQuestionResult {
  const parsed = AIQuestionSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    };
  }
  const generated = parsed.data as GeneratedQuestion;
  const variantKey = computeVariantKey(generated.templateId, generated);
  const question: Question = { ...generated, id: `ai_${variantKey}`, variantKey };
  const result = validateQuestion(question);
  return { ok: result.ok, errors: result.errors, question: result.ok ? question : undefined };
}
