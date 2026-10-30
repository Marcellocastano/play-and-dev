import type { Option, Question } from '../models/index.js';
import { questionTypeRegistry, type QuestionTypeRegistry } from './types.js';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function distinctTexts(list: readonly { text: string }[], label: string, errors: string[]): void {
  const texts = new Set(list.map((o) => o.text.trim()));
  if (list.some((o) => o.text.trim().length === 0)) errors.push(`${label} must be non-empty`);
  if (texts.size !== list.length) errors.push(`${label} must be distinct`);
}

function whyCover(ids: readonly string[], q: Question, label: string, errors: string[]): void {
  for (const id of ids) {
    const why = q.explanation?.why?.[id];
    if (!why || why.trim().length === 0) {
      errors.push(`explanation.why missing for ${label} ${id}`);
    }
  }
}

export function validateQuestion(
  q: Question,
  registry: QuestionTypeRegistry = questionTypeRegistry,
): ValidationResult {
  const errors: string[] = [];

  if (!q.prompt || q.prompt.trim().length === 0) {
    errors.push('prompt is empty');
  }

  const ex = q.explanation;
  if (!ex) {
    errors.push('explanation is missing');
  } else {
    if (!ex.short || ex.short.trim().length === 0) errors.push('explanation.short is empty');
    if (!ex.whyCorrect || ex.whyCorrect.trim().length === 0)
      errors.push('explanation.whyCorrect is empty');
  }

  switch (q.format) {
    case 'choice': {
      if (q.options.length !== 4) errors.push(`expected 4 options, got ${q.options.length}`);
      distinctTexts(q.options, 'options', errors);
      if (!q.options.some((o) => o.id === q.correctOptionId)) {
        errors.push('correctOptionId does not match any option');
      }
      whyCover(
        q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.id),
        q,
        'distractor',
        errors,
      );
      break;
    }
    case 'categorize': {
      if (q.categories.length < 2 || q.categories.length > 3)
        errors.push(`expected 2-3 categories, got ${q.categories.length}`);
      if (q.items.length < 4 || q.items.length > 8)
        errors.push(`expected 4-8 items, got ${q.items.length}`);
      distinctTexts(q.categories, 'categories', errors);
      distinctTexts(q.items, 'items', errors);
      const catIds = new Set(q.categories.map((c: Option) => c.id));
      for (const item of q.items) {
        if (!catIds.has(item.categoryId)) {
          errors.push(`item ${item.id} references unknown category ${item.categoryId}`);
        }
      }
      for (const cat of q.categories) {
        if (!q.items.some((i) => i.categoryId === cat.id)) {
          errors.push(`category ${cat.id} has no items`);
        }
      }
      whyCover(
        q.items.map((i) => i.id),
        q,
        'item',
        errors,
      );
      break;
    }
    case 'match': {
      if (q.choices.length < 2 || q.choices.length > 4)
        errors.push(`expected 2-4 choices, got ${q.choices.length}`);
      if (q.rows.length < 3 || q.rows.length > 6)
        errors.push(`expected 3-6 rows, got ${q.rows.length}`);
      distinctTexts(q.choices, 'choices', errors);
      distinctTexts(q.rows, 'rows', errors);
      const choiceIds = new Set(q.choices.map((c: Option) => c.id));
      for (const row of q.rows) {
        if (!choiceIds.has(row.choiceId)) {
          errors.push(`row ${row.id} references unknown choice ${row.choiceId}`);
        }
      }
      whyCover(
        q.rows.map((r) => r.id),
        q,
        'row',
        errors,
      );
      break;
    }
    case 'true-false': {
      if (q.statements.length < 4 || q.statements.length > 6)
        errors.push(`expected 4-6 statements, got ${q.statements.length}`);
      distinctTexts(q.statements, 'statements', errors);
      if (!q.statements.some((s) => s.value)) errors.push('no true statement');
      if (!q.statements.some((s) => !s.value)) errors.push('no false statement');
      whyCover(
        q.statements.map((s) => s.id),
        q,
        'statement',
        errors,
      );
      break;
    }
    case 'text': {
      if (!Array.isArray(q.accepted) || q.accepted.length === 0) {
        errors.push('accepted is empty');
      } else if (q.accepted.some((a) => a.trim().length === 0)) {
        errors.push('accepted must be non-empty');
      }
      break;
    }
    default:
      errors.push(`unknown question format: ${(q as Question).format}`);
  }

  const typeDef = registry.has(q.type) ? registry.get(q.type) : undefined;
  if (!typeDef) {
    errors.push(`unknown question type: ${q.type}`);
  } else if (typeDef.requiresCode && (!q.code || q.code.trim().length === 0)) {
    errors.push(`question type ${q.type} requires code`);
  }

  return { ok: errors.length === 0, errors };
}
