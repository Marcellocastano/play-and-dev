import type { GeneratedQuestion, QuestionTemplate } from '@lg/core';
import { pickOf, shuffle } from '../templates/helpers.js';
import { bankQuestions } from './data.generated.js';
import type { BankQuestion } from './types.js';

export type { BankFile, BankQuestion } from './types.js';
export { bankQuestions } from './data.generated.js';

export const MIN_BANK_SIZE = 6;

export function buildBankTemplates(questions: BankQuestion[]): QuestionTemplate[] {
  const groups = new Map<string, BankQuestion[]>();
  for (const q of questions) {
    const key = `${q.topicId}:${q.type}:${q.difficulty}`;
    const list = groups.get(key) ?? [];
    list.push(q);
    groups.set(key, list);
  }

  return [...groups.values()]
    .filter((qs) => qs.length >= MIN_BANK_SIZE)
    .map((qs) => {
      const first = qs[0]!;
      const templateId = `bank-${first.topicId}-${first.type}-${first.difficulty}`;
      return {
        id: templateId,
        topicId: first.topicId,
        subtopicId: first.subtopicId,
        type: first.type,
        difficulty: first.difficulty,
        skills: [...new Set(qs.flatMap((q) => q.skills))],
        tags: ['curated'],
        generate(rng): GeneratedQuestion {
          const q = pickOf(rng, qs);
          const idMap = new Map<string, string>();
          const options = shuffle(q.options, rng).map((o, i) => {
            const id = `opt${i}`;
            idMap.set(o.id, id);
            return { id, text: o.text };
          });
          const whyOthersWrong: Record<string, string> = {};
          for (const [oldId, why] of Object.entries(q.explanation.whyOthersWrong)) {
            const newId = idMap.get(oldId);
            if (newId) whyOthersWrong[newId] = why;
          }
          return {
            templateId,
            type: q.type,
            difficulty: q.difficulty,
            topicId: q.topicId,
            subtopicId: q.subtopicId,
            skills: q.skills,
            prompt: q.prompt,
            code: q.code,
            options,
            correctOptionId: idMap.get(q.correctOptionId)!,
            explanation: { ...q.explanation, whyOthersWrong },
            deepDiveRef: `dd-${q.topicId}`,
          };
        },
      };
    });
}

export const bankTemplates: QuestionTemplate[] = buildBankTemplates(bankQuestions);
