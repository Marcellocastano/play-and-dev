import { describe, expect, it } from 'vitest';
import type { QuestionTemplate, SubjectDefinition } from '@lg/core';
import { checkTemplate, type CodeRunner } from '../src/index.js';

const subject: SubjectDefinition = {
  id: 'test',
  name: 'Test',
  kind: 'language',
  description: 'd',
  icon: 'T',
  theme: {
    primary: '',
    secondary: '',
    background: '',
    surface: '',
    accent: '',
    text: '',
    success: '',
    danger: '',
    gradients: { hero: '', card: '', progress: '' },
  },
  status: 'available',
  levels: [],
  topics: [
    {
      id: 'json',
      subjectId: 'test',
      levelId: 'beginner',
      name: 'JSON',
      overview: 'Panoramica',
      subtopics: [{ id: 'json-parse', name: 'parse' }],
      learningObjectives: ['obiettivo'],
      commonMistakes: ['errore'],
      examples: ['esempio'],
      prerequisites: [],
    },
  ],
  templates: [],
  learningObjectives: [],
};

const WHY_A =
  'Il valore mostrato deriva dalla somma calcolata nel codice, non dal dato di partenza.';
const WHY_B =
  'La risposta corretta è un numero diverso: questa opzione confonde il risultato finale.';
const WHY_C = 'Questa opzione non corrisponde al risultato della valutazione dell’espressione.';

function poTemplate(id: string, build: (rng: () => number) => number): QuestionTemplate {
  return {
    id,
    topicId: 'json',
    subtopicId: 'json-parse',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['somma'],
    tags: [],
    generate(rng) {
      const n = build(rng);
      return {
        templateId: id,
        type: 'predict-output',
        difficulty: 'easy',
        topicId: 'json',
        subtopicId: 'json-parse',
        skills: ['somma'],
        prompt: 'Cosa stampa questo codice?',
        code: `console.log(${n} + 1)`,
        format: 'choice',
        options: [
          { id: 'opt0', text: String(n + 1) },
          { id: 'opt1', text: String(n) },
          { id: 'opt2', text: String(n + 2) },
          { id: 'opt3', text: String(n - 1) },
        ],
        correctOptionId: 'opt0',
        explanation: {
          short: `La somma vale ${n + 1}.`,
          whyCorrect: `Il codice valuta ${n} + 1 e stampa ${n + 1}.`,
          why: { opt1: WHY_A, opt2: WHY_B, opt3: WHY_C },
        },
        deepDiveRef: 'dd-json',
      };
    },
  };
}

const fakeRunner: CodeRunner = {
  lang: 'fake',
  async run(code) {
    const m = /console\.log\((\d+) \+ (\d+)\)/.exec(code);
    return m ? String(Number(m[1]) + Number(m[2])) : 'SyntaxError';
  },
};

const wrongRunner: CodeRunner = {
  lang: 'fake',
  async run() {
    return '999';
  },
};

describe('checkTemplate', () => {
  it('accetta un template valido con e senza runner', async () => {
    const t = poTemplate('good-po', (rng) => 2 + Math.floor(rng() * 8));
    expect(await checkTemplate(t, { subject })).toEqual([]);
    expect(await checkTemplate(t, { subject, runner: fakeRunner })).toEqual([]);
  });

  it('scarta un template a risposta costante (varietà insufficiente)', async () => {
    const t = poTemplate('const-po', () => 4);
    const reasons = await checkTemplate(t, { subject });
    expect(reasons.some((r) => r.includes('varietà insufficiente'))).toBe(true);
  });

  it('scarta un predict-output la cui risposta non coincide con l’esecuzione', async () => {
    const t = poTemplate('wrong-po', (rng) => 2 + Math.floor(rng() * 8));
    const reasons = await checkTemplate(t, { subject, runner: wrongRunner });
    expect(reasons.some((r) => r.includes('predict-output') && r.includes('seed'))).toBe(true);
  });

  it('con minDistinctAnswers scarta una risposta corretta costante', async () => {
    const constant = poTemplate('flat-po', (rng) => 2 + Math.floor(rng() * 8));
    const flat: QuestionTemplate = {
      ...constant,
      generate(rng) {
        const q = constant.generate(rng);
        const options = q.options.map((o) =>
          o.id === q.correctOptionId ? { ...o, text: '0' } : o,
        );
        return { ...q, options };
      },
    };
    const off = await checkTemplate(flat, { subject });
    expect(off.some((r) => r.includes('risposta corretta costante'))).toBe(false);
    const on = await checkTemplate(flat, { subject, minDistinctAnswers: 3 });
    expect(
      on.some((r) => r.includes('risposta corretta costante: 1 risposte corrette distinte')),
    ).toBe(true);
  });
});
