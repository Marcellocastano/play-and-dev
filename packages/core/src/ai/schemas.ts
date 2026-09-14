import { z } from 'zod';
import type { GeneratedQuestion, Question } from '../models/index.js';
import { computeVariantKey } from '../question/generator.js';
import { validateQuestion } from '../question/validate.js';

const OptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const AIQuestionSchema = z.object({
  templateId: z.string().min(1),
  type: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topicId: z.string().min(1),
  subtopicId: z.string().min(1),
  skills: z.array(z.string()),
  prompt: z.string().min(1),
  code: z.string().optional(),
  options: z.array(OptionSchema).length(4),
  correctOptionId: z.string().min(1),
  explanation: z.object({
    short: z.string().min(1),
    whyCorrect: z.string().min(1),
    whyOthersWrong: z.record(z.string(), z.string().min(1)),
    concept: z.string().min(1),
    commonMistake: z.string().optional(),
    example: z.string().optional(),
  }),
  deepDiveRef: z.string().optional(),
});

export type AIQuestionInput = z.infer<typeof AIQuestionSchema>;

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
  const generated: GeneratedQuestion = parsed.data;
  const variantKey = computeVariantKey(
    generated.templateId,
    generated.prompt,
    generated.code,
    generated.options,
  );
  const question: Question = { ...generated, id: `ai_${variantKey}`, variantKey };
  const result = validateQuestion(question);
  return { ok: result.ok, errors: result.errors, question: result.ok ? question : undefined };
}
