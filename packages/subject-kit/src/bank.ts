import type { BankQuestion, GeneratedQuestion, QuestionTemplate } from '@lg/core';
import { pickOf, shuffle } from './dsl.js';

export const MIN_BANK_SIZE = 1;

type Rng = () => number;

function remapBody(q: BankQuestion, rng: Rng, templateId: string): GeneratedQuestion {
  const remapWhy = (idMap: Map<string, string>) => {
    const why: Record<string, string> = {};
    for (const [oldId, text] of Object.entries(q.explanation.why)) {
      const newId = idMap.get(oldId);
      if (newId) why[newId] = text;
    }
    return why;
  };

  const base = {
    type: q.type,
    difficulty: q.difficulty,
    topicId: q.topicId,
    subtopicId: q.subtopicId,
    skills: q.skills,
    prompt: q.prompt,
    code: q.code,
    deepDiveRef: `dd-${q.topicId}`,
  };

  switch (q.format) {
    case 'choice': {
      const idMap = new Map<string, string>();
      const options = shuffle(q.options, rng).map((o, i) => {
        const id = `opt${i}`;
        idMap.set(o.id, id);
        return { id, text: o.text };
      });
      return {
        ...base,
        templateId,
        format: 'choice',
        options,
        correctOptionId: idMap.get(q.correctOptionId)!,
        explanation: { ...q.explanation, why: remapWhy(idMap) },
      };
    }
    case 'categorize': {
      const idMap = new Map<string, string>();
      const categories = shuffle(q.categories, rng).map((c, i) => {
        const id = `cat${i}`;
        idMap.set(c.id, id);
        return { id, text: c.text };
      });
      const items = shuffle(q.items, rng).map((it, i) => {
        const id = `item${i}`;
        idMap.set(it.id, id);
        return { id, text: it.text, categoryId: idMap.get(it.categoryId)! };
      });
      return {
        ...base,
        templateId,
        format: 'categorize',
        categories,
        items,
        explanation: { ...q.explanation, why: remapWhy(idMap) },
      };
    }
    case 'match': {
      const idMap = new Map<string, string>();
      const choices = shuffle(q.choices, rng).map((c, i) => {
        const id = `choice${i}`;
        idMap.set(c.id, id);
        return { id, text: c.text };
      });
      const rows = shuffle(q.rows, rng).map((r, i) => {
        const id = `row${i}`;
        idMap.set(r.id, id);
        return { id, text: r.text, choiceId: idMap.get(r.choiceId)! };
      });
      return {
        ...base,
        templateId,
        format: 'match',
        choices,
        rows,
        explanation: { ...q.explanation, why: remapWhy(idMap) },
      };
    }
    case 'true-false': {
      const idMap = new Map<string, string>();
      const statements = shuffle(q.statements, rng).map((s, i) => {
        const id = `st${i}`;
        idMap.set(s.id, id);
        return { id, text: s.text, value: s.value };
      });
      return {
        ...base,
        templateId,
        format: 'true-false',
        statements,
        explanation: { ...q.explanation, why: remapWhy(idMap) },
      };
    }
    case 'text':
      return {
        ...base,
        templateId,
        format: 'text',
        accepted: [...q.accepted],
        explanation: q.explanation,
      };
  }
}

export function buildBankTemplates(
  questions: BankQuestion[],
  minSize = MIN_BANK_SIZE,
): QuestionTemplate[] {
  const groups = new Map<string, BankQuestion[]>();
  for (const q of questions) {
    const key = `${q.topicId}:${q.type}:${q.difficulty}`;
    const list = groups.get(key) ?? [];
    list.push(q);
    groups.set(key, list);
  }

  return [...groups.values()]
    .filter((qs) => qs.length >= minSize)
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
        capacity: qs.length,
        generate(rng): GeneratedQuestion {
          const q = pickOf(rng, qs);
          return remapBody(q, rng, templateId);
        },
      };
    });
}
