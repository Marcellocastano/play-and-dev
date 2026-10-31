import {
  generateQuestion,
  qualityIssues,
  validateQuestion,
  type Question,
  type QuestionTemplate,
  type SubjectDefinition,
} from '@lg/core';
import type { CodeRunner } from './runner.js';

export const DEFAULT_TEMPLATE_SEEDS = Array.from({ length: 25 }, (_, i) => i * 97 + 13);

export interface TemplateCheckContext {
  subject: SubjectDefinition;
  runner?: CodeRunner;
  seeds?: readonly number[];
  /** Se impostato: per domande `choice` serve almeno N risposte corrette distinte tra i seed. */
  minDistinctAnswers?: number;
}

const MAX_REASONS = 15;

/**
 * Validates one generative template across `seeds`: generate → validateQuestion →
 * qualityIssues → topic/subtopic exist → predict-output executed against the declared
 * answer (when a runner is given) → enough distinct variantKeys. Returns the reasons
 * (empty = ok), deduplicated and capped.
 */
export async function checkTemplate(
  template: QuestionTemplate,
  ctx: TemplateCheckContext,
): Promise<string[]> {
  const seeds = ctx.seeds ?? DEFAULT_TEMPLATE_SEEDS;
  const topicIds = new Set(ctx.subject.topics.map((t) => t.id));
  const subtopicIds = new Set(ctx.subject.topics.flatMap((t) => t.subtopics.map((s) => s.id)));
  const reasons: string[] = [];
  const variantKeys = new Set<string>();
  const correctTexts = new Set<string>();

  for (const seed of seeds) {
    let q: Question;
    try {
      q = generateQuestion(template, seed);
    } catch (err) {
      reasons.push(`seed ${seed}: generate lancia: ${(err as Error).message.split('\n')[0]}`);
      continue;
    }
    for (const e of validateQuestion(q).errors) reasons.push(`seed ${seed}: ${e}`);
    for (const issue of qualityIssues(q)) reasons.push(`seed ${seed}: ${issue}`);
    if (!topicIds.has(q.topicId)) reasons.push(`seed ${seed}: topicId sconosciuto: ${q.topicId}`);
    if (!subtopicIds.has(q.subtopicId))
      reasons.push(`seed ${seed}: subtopicId sconosciuto: ${q.subtopicId}`);
    variantKeys.add(q.variantKey);
    if (q.format === 'choice') {
      const correct = q.options.find((o) => o.id === q.correctOptionId)?.text;
      if (correct !== undefined) correctTexts.add(correct);
    }
    if (ctx.runner && q.type === 'predict-output' && q.format === 'choice' && q.code) {
      let actual: string;
      try {
        actual = await ctx.runner.run(q.code);
      } catch (err) {
        reasons.push(`seed ${seed}: codice non valido: ${(err as Error).message.split('\n')[0]}`);
        continue;
      }
      const correct = q.options.find((o) => o.id === q.correctOptionId)?.text;
      if (actual !== correct) {
        reasons.push(
          `seed ${seed}: predict-output: eseguito "${actual.replace(/\n/g, '|')}", dichiarato "${correct}"`,
        );
      }
    }
  }

  const summary: string[] = [];
  if (ctx.minDistinctAnswers !== undefined && correctTexts.size < ctx.minDistinctAnswers) {
    summary.push(
      `risposta corretta costante: ${correctTexts.size} risposte corrette distinte su ${seeds.length} seed (minimo ${ctx.minDistinctAnswers})`,
    );
  }
  const minVariants = Math.min(5, template.capacity ?? 5);
  if (variantKeys.size < minVariants) {
    summary.push(
      `varietà insufficiente: ${variantKeys.size} varianti su ${seeds.length} seed (minimo ${minVariants})`,
    );
  }
  return [...summary, ...new Set(reasons)].slice(0, MAX_REASONS);
}
