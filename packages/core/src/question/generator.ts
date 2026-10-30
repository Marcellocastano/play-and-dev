import type { Question, QuestionBody, QuestionTemplate } from '../models/index.js';
import { seededRandom, stableHash } from '../utils/index.js';

type VariantInput = { prompt: string; code?: string } & QuestionBody;

function bodyTexts(q: VariantInput): string[] {
  switch (q.format) {
    case 'choice':
      return q.options.map((o) => o.text);
    case 'categorize':
      return [...q.categories.map((c) => c.text), ...q.items.map((i) => i.text)];
    case 'match':
      return [...q.choices.map((c) => c.text), ...q.rows.map((r) => r.text)];
    case 'true-false':
      return q.statements.map((s) => s.text);
    case 'text':
      return [...q.accepted];
  }
}

export function computeVariantKey(templateId: string, q: VariantInput): string {
  const optionPart = bodyTexts(q).slice().sort().join('|');
  return stableHash(`${templateId}::${q.prompt}::${q.code ?? ''}::${optionPart}`);
}

/**
 * Generates a deterministic question variant from a template.
 * Same template + same seed → same variantKey.
 */
export function generateQuestion(template: QuestionTemplate, seed: number): Question {
  const rng = seededRandom(seed);
  const generated = template.generate(rng);
  const variantKey = computeVariantKey(template.id, generated);
  return {
    ...generated,
    id: `q_${variantKey}`,
    templateId: template.id,
    variantKey,
  };
}
