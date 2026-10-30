import { describe, expect, it } from 'vitest';
import { checkCandidate, wrapCodeText } from '../scripts/checkCandidate.js';

const ctx = {
  topicId: 'json',
  type: 'match',
  difficulty: 'medium' as const,
  seenKeys: new Set<string>(),
};

function matchCandidate(rows: { text: string; choiceId: string }[]) {
  return {
    subtopicId: 'json-parse',
    type: 'match',
    difficulty: 'medium',
    skills: ['JSON.parse'],
    prompt: 'Abbina ogni espressione al suo valore.',
    format: 'match',
    choices: [
      { id: 'c0', text: '2' },
      { id: 'c1', text: "'ab'" },
      { id: 'c2', text: '3' },
    ],
    rows: rows.map((r, i) => ({ id: `r${i}`, ...r })),
    explanation: {
      short: 'Ogni espressione produce il valore abbinato secondo le regole di JavaScript.',
      whyCorrect: "Le espressioni vanno valutate una a una contro l'output reale.",
      why: Object.fromEntries(
        rows.map((_, i) => [
          `r${i}`,
          "L'espressione viene valutata con le regole standard degli operatori e dei metodi coinvolti.",
        ]),
      ),
    },
  };
}

describe('wrapCodeText', () => {
  it('avvolge una arrow function', () => {
    expect(wrapCodeText('(n) => n * 2')).toBe('`(n) => n * 2`');
  });
  it('avvolge una chiamata di funzione/metodo', () => {
    expect(wrapCodeText('numeri.filter((n) => n)')).toBe('`numeri.filter((n) => n)`');
  });
  it('non tocca una frase italiana con parentesi', () => {
    expect(wrapCodeText('Restituisce un array (nuovo)')).toBe('Restituisce un array (nuovo)');
  });
  it('non tocca un testo già tra backtick', () => {
    expect(wrapCodeText('`numeri.map(f)`')).toBe('`numeri.map(f)`');
  });
});

describe('checkCandidate — match eseguibile', () => {
  it('accetta un match le cui righe producono le scelte dichiarate', () => {
    const { q, reasons } = checkCandidate(
      matchCandidate([
        { text: '`1 + 1`', choiceId: 'c0' },
        { text: "`'a' + 'b'`", choiceId: 'c1' },
        { text: '`[1, 2].length + 1`', choiceId: 'c2' },
      ]),
      { ...ctx, seenKeys: new Set() },
    );
    expect(reasons).toEqual([]);
    expect(q).toBeDefined();
  });

  it('scarta un match con una riga abbinata alla scelta sbagliata', () => {
    const { reasons } = checkCandidate(
      matchCandidate([
        { text: '`1 + 1`', choiceId: 'c1' },
        { text: "`'a' + 'b'`", choiceId: 'c1' },
        { text: '`[1, 2].length + 1`', choiceId: 'c2' },
      ]),
      { ...ctx, seenKeys: new Set() },
    );
    expect(reasons.some((r) => r.startsWith('match:'))).toBe(true);
  });

  it('ignora il controllo quando una riga non è un espressione eseguibile', () => {
    const { reasons } = checkCandidate(
      matchCandidate([
        { text: 'Il metodo che rimuove il primo elemento', choiceId: 'c0' },
        { text: "`'a' + 'b'`", choiceId: 'c1' },
        { text: '`[1, 2].length + 1`', choiceId: 'c2' },
      ]),
      { ...ctx, seenKeys: new Set() },
    );
    expect(reasons.some((r) => r.startsWith('match:'))).toBe(false);
  });
});

describe('checkCandidate — true-false eseguibile', () => {
  function tfCandidate(statements: { text: string; value: boolean }[]) {
    return {
      subtopicId: 'json-parse',
      type: 'true-false',
      difficulty: 'easy',
      skills: ['JSON.parse'],
      prompt: 'Per ogni affermazione, indica se è vera o falsa.',
      format: 'true-false',
      statements: statements.map((s, i) => ({ id: `s${i}`, ...s })),
      explanation: {
        short: 'Ogni affermazione va verificata contro il comportamento reale del linguaggio.',
        whyCorrect: 'Le espressioni producono i valori indicati dalle regole di JavaScript.',
        why: Object.fromEntries(
          statements.map((_, i) => [
            `s${i}`,
            "L'espressione viene valutata con le regole standard degli operatori e dei metodi coinvolti.",
          ]),
        ),
      },
    };
  }

  const statements = [
    { text: "`'5' == 5` restituisce `true`", value: true },
    { text: "`'5' === 5` restituisce `false`", value: true },
    { text: '`[1] === [1]` restituisce `true`', value: false },
    { text: "`typeof null` restituisce `'object'`", value: true },
  ];

  it('accetta affermazioni il cui valore coincide con il risultato reale', () => {
    const { q, reasons } = checkCandidate(tfCandidate(statements), {
      topicId: 'json',
      type: 'true-false',
      difficulty: 'easy',
      seenKeys: new Set(),
    });
    expect(reasons).toEqual([]);
    expect(q).toBeDefined();
  });

  it('scarta un affermazione con value che non coincide con il risultato', () => {
    const wrong = statements.map((s, i) => (i === 0 ? { ...s, value: false } : s));
    const { reasons } = checkCandidate(tfCandidate(wrong), {
      topicId: 'json',
      type: 'true-false',
      difficulty: 'easy',
      seenKeys: new Set(),
    });
    expect(reasons.some((r) => r.startsWith('true-false:'))).toBe(true);
  });
});
