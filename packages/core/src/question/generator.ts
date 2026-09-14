import type { Question, QuestionTemplate } from '../models/index.js';
import { seededRandom, stableHash } from '../utils/index.js';

export function computeVariantKey(
  templateId: string,
  prompt: string,
  code: string | undefined,
  options: readonly { text: string }[],
): string {
  const optionPart = options
    .map((o) => o.text)
    .slice()
    .sort()
    .join('|');
  return stableHash(`${templateId}::${prompt}::${code ?? ''}::${optionPart}`);
}

/**
 * Generates a deterministic question variant from a template.
 * Same template + same seed → same variantKey.
 */
export function generateQuestion(template: QuestionTemplate, seed: number): Question {
  const rng = seededRandom(seed);
  const generated = template.generate(rng);
  const variantKey = computeVariantKey(
    template.id,
    generated.prompt,
    generated.code,
    generated.options,
  );
  return {
    ...generated,
    id: `q_${variantKey}`,
    templateId: template.id,
    variantKey,
  };
}
