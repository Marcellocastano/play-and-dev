import type { Question } from '../models/index.js';
import { questionTypeRegistry, type QuestionTypeRegistry } from './types.js';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateQuestion(
  q: Question,
  registry: QuestionTypeRegistry = questionTypeRegistry,
): ValidationResult {
  const errors: string[] = [];

  if (!q.prompt || q.prompt.trim().length === 0) {
    errors.push('prompt is empty');
  }

  if (q.options.length !== 4) {
    errors.push(`expected 4 options, got ${q.options.length}`);
  }
  const texts = new Set(q.options.map((o) => o.text.trim()));
  if (q.options.some((o) => o.text.trim().length === 0)) {
    errors.push('options must be non-empty');
  }
  if (texts.size !== q.options.length) {
    errors.push('options must be distinct');
  }

  const optionIds = new Set(q.options.map((o) => o.id));
  if (!optionIds.has(q.correctOptionId)) {
    errors.push('correctOptionId does not match any option');
  }

  const ex = q.explanation;
  if (!ex) {
    errors.push('explanation is missing');
  } else {
    if (!ex.short || ex.short.trim().length === 0) errors.push('explanation.short is empty');
    if (!ex.whyCorrect || ex.whyCorrect.trim().length === 0)
      errors.push('explanation.whyCorrect is empty');
    if (!ex.concept || ex.concept.trim().length === 0)
      errors.push('explanation.concept is empty');
    for (const opt of q.options) {
      if (opt.id === q.correctOptionId) continue;
      const why = ex.whyOthersWrong?.[opt.id];
      if (!why || why.trim().length === 0) {
        errors.push(`explanation.whyOthersWrong missing for distractor ${opt.id}`);
      }
    }
  }

  const typeDef = registry.has(q.type) ? registry.get(q.type) : undefined;
  if (!typeDef) {
    errors.push(`unknown question type: ${q.type}`);
  } else if (typeDef.requiresCode && (!q.code || q.code.trim().length === 0)) {
    errors.push(`question type ${q.type} requires code`);
  }

  return { ok: errors.length === 0, errors };
}
