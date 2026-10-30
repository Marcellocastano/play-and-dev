import type { AnswerResponse, Question } from '../models/index.js';

export interface GradeResult {
  score: number;
  correct: boolean;
  perItem: Record<string, boolean>;
}

/**
 * Normalizes user/model output for comparison: trim, \r\n → \n, collapse
 * repeated spaces, drop spaces just inside brackets and around , and :,
 * double quotes → single, drop trailing empty lines. Case-sensitive.
 */
export function normalizeOutput(s: string): string {
  const lines = s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) =>
      line
        .trim()
        .replace(/ +/g, ' ')
        .replace(/([[{]) /g, '$1')
        .replace(/ ([\]},:])/g, '$1')
        .replace(/([,:]) /g, '$1')
        .replace(/"/g, "'"),
    );
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

export function gradeAnswer(q: Question, r: AnswerResponse): GradeResult {
  if (r.format !== q.format) {
    throw new Error(`response format "${r.format}" does not match question format "${q.format}"`);
  }
  switch (q.format) {
    case 'choice': {
      const optionId = (r as Extract<AnswerResponse, { format: 'choice' }>).optionId;
      const ok = optionId === q.correctOptionId;
      return { score: ok ? 1 : 0, correct: ok, perItem: { [optionId]: ok } };
    }
    case 'categorize': {
      const placement = (r as Extract<AnswerResponse, { format: 'categorize' }>).placement;
      const perItem: Record<string, boolean> = {};
      let n = 0;
      for (const item of q.items) {
        perItem[item.id] = placement[item.id] === item.categoryId;
        if (perItem[item.id]) n++;
      }
      const score = q.items.length === 0 ? 0 : n / q.items.length;
      return { score, correct: score === 1, perItem };
    }
    case 'match': {
      const selection = (r as Extract<AnswerResponse, { format: 'match' }>).selection;
      const perItem: Record<string, boolean> = {};
      let n = 0;
      for (const row of q.rows) {
        perItem[row.id] = selection[row.id] === row.choiceId;
        if (perItem[row.id]) n++;
      }
      const score = q.rows.length === 0 ? 0 : n / q.rows.length;
      return { score, correct: score === 1, perItem };
    }
    case 'true-false': {
      const values = (r as Extract<AnswerResponse, { format: 'true-false' }>).values;
      const perItem: Record<string, boolean> = {};
      let n = 0;
      for (const st of q.statements) {
        perItem[st.id] = values[st.id] === st.value;
        if (perItem[st.id]) n++;
      }
      const score = q.statements.length === 0 ? 0 : n / q.statements.length;
      return { score, correct: score === 1, perItem };
    }
    case 'text': {
      const text = normalizeOutput((r as Extract<AnswerResponse, { format: 'text' }>).text);
      const ok = q.accepted.some((a) => normalizeOutput(a) === text);
      return { score: ok ? 1 : 0, correct: ok, perItem: { response: ok } };
    }
  }
}

/** Converts a choice-format question to type-output: accepted = [correct option text]. */
export function toTextFormat(q: Question & { format: 'choice' }): Question & { format: 'text' } {
  const correct = q.options.find((o) => o.id === q.correctOptionId);
  const { options: _options, correctOptionId: _correctOptionId, ...rest } = q;
  return {
    ...rest,
    format: 'text',
    accepted: correct ? [correct.text] : [],
    explanation: { ...q.explanation, why: {} },
  };
}
