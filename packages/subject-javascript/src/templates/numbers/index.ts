import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, retry, type Rng } from '../helpers.js';

const TOPIC = 'numbers';
const DD = 'dd-numbers';

const modPo: QuestionTemplate = {
  id: 'num-mod-po',
  topicId: TOPIC,
  subtopicId: 'numbers-arithmetic',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['%'],
  tags: ['numeri'],
  generate(rng: Rng) {
    return retry(() => {
      const b = pickInt(rng, 2, 6);
      const a = pickInt(rng, b + 1, b * 4);
      const code = `console.log(${a} % ${b});`;
      const built = makeOptions(
        rng,
        { text: fmt(a % b), why: `${a} % ${b} è il resto della divisione: ${a % b}.` },
        [
          { text: fmt(Math.floor(a / b)), why: `${Math.floor(a / b)} è il quoziente intero, non il resto.` },
          { text: fmt(b % a), why: `${b} % ${a} calcola il resto invertendo gli operandi.` },
          { text: fmt(a - b), why: 'La sottrazione non è il resto della divisione.' },
        ],
      );
      return {
        templateId: 'num-mod-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-arithmetic',
        skills: ['%'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `% è l'operatore resto: ${a} % ${b} vale ${a % b}.`,
          whyCorrect: `${a} diviso ${b} fa ${Math.floor(a / b)} con resto ${a % b}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatore modulo (resto)',
          commonMistake: 'Confondere il resto con il quoziente.',
          example: '10 % 3 // 1',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const powPo: QuestionTemplate = {
  id: 'num-pow-po',
  topicId: TOPIC,
  subtopicId: 'numbers-arithmetic',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['**'],
  tags: ['numeri'],
  generate(rng: Rng) {
    return retry(() => {
      const a = pickInt(rng, 2, 5);
      const e = pickInt(rng, 2, 4);
      const code = `console.log(${a} ** ${e});`;
      const built = makeOptions(
        rng,
        { text: fmt(a ** e), why: `${a} elevato a ${e} vale ${a ** e}.` },
        [
          { text: fmt(a * e), why: `${a} * ${e} è una moltiplicazione, non una potenza.` },
          { text: fmt(e ** a), why: `${e} ** ${a} inverte base ed esponente.` },
          { text: fmt(a * a), why: e === 2 ? 'Coincide col quadrato, ma l\'esponente qui è diverso.' : `${a} * ${a} è solo il quadrato, non ${a}^${e}.` },
        ],
      );
      return {
        templateId: 'num-pow-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-arithmetic',
        skills: ['**'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `** è l'operatore di potenza: ${a} ** ${e} = ${a ** e}.`,
          whyCorrect: `${a} moltiplicato per sé stesso ${e} volte dà ${a ** e}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatore di potenza **',
          commonMistake: 'Confondere ** con * (moltiplicazione).',
          example: '2 ** 3 // 8',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const floorPo: QuestionTemplate = {
  id: 'num-floor-po',
  topicId: TOPIC,
  subtopicId: 'numbers-math',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['Math.floor', 'divisione'],
  tags: ['numeri', 'Math'],
  generate(rng: Rng) {
    return retry(() => {
      const b = pickInt(rng, 2, 5);
      const a = pickInt(rng, b + 1, b * 4 - 1); // non multiplo esatto
      const code = `console.log(Math.floor(${a} / ${b}));`;
      const built = makeOptions(
        rng,
        { text: fmt(Math.floor(a / b)), why: `Math.floor arrotonda per difetto: ${a}/${b} = ${a / b} → ${Math.floor(a / b)}.` },
        [
          { text: fmt(Math.round(a / b)), why: `Math.round arrotonda al più vicino (${Math.round(a / b)}), floor sempre giù.` },
          { text: fmt(a / b), why: 'Math.floor elimina la parte decimale: il risultato è intero.' },
          { text: fmt(a % b), why: `${a} % ${b} è il resto, non il quoziente.` },
        ],
      );
      return {
        templateId: 'num-floor-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-math',
        skills: ['Math.floor'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Math.floor(${a} / ${b}) arrotonda ${(a / b).toFixed(2)}… verso il basso: ${Math.floor(a / b)}.`,
          whyCorrect: 'floor va sempre all\'intero inferiore, anche con decimali alti.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Math.floor vs Math.round',
          commonMistake: 'Pensare che floor arrotondi al più vicino: tronca sempre.',
          example: 'Math.floor(4.9) // 4',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const nanMc: QuestionTemplate = {
  id: 'num-nan-mc',
  topicId: TOPIC,
  subtopicId: 'numbers-conversion',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['NaN'],
  tags: ['numeri', 'NaN'],
  generate(rng: Rng) {
    const word = pickOf(rng, ['ciao', 'abc', 'test']);
    const n = pickInt(rng, 2, 9);
    const built = makeOptions(
      rng,
      { text: 'NaN', why: `Moltiplicare una stringa non numerica per ${n} è un'operazione impossibile: il risultato è NaN.` },
      [
        { text: `'${word}${n}'`, why: 'La concatenazione avviene solo con +, non con *.' },
        { text: '0', why: 'Le operazioni impossibili non danno 0: danno NaN.' },
        { text: 'undefined', why: 'Il risultato esiste: è il valore numerico speciale NaN.' },
      ],
    );
    return {
      templateId: 'num-nan-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-conversion',
      skills: ['NaN'],
      prompt: `Quanto vale \`'${word}' * ${n}\`?`,
      ...built,
      explanation: {
        short: `'${word}' * ${n} non si può calcolare: JavaScript restituisce NaN.`,
        whyCorrect: 'NaN (Not a Number) è il risultato delle operazioni numeriche impossibili.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'NaN',
        commonMistake: 'Aspettarsi un errore: NaN è un valore, non un\'eccezione.',
        example: "'x' * 2 // NaN; typeof NaN // 'number'",
      },
      deepDiveRef: DD,
    };
  },
};

const coerceFb: QuestionTemplate = {
  id: 'num-coerce-fb',
  topicId: TOPIC,
  subtopicId: 'numbers-conversion',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['coercion', 'conversione'],
  tags: ['numeri', 'bug'],
  generate(rng: Rng) {
    const s = String(pickInt(rng, 1, 9));
    const n = pickInt(rng, 1, 9);
    const code = `let totale = '${s}' + ${n};\nconsole.log(totale);`;
    const built = makeOptions(
      rng,
      {
        text: `'${s}' è una stringa: + concatena invece di sommare (serve Number('${s}'))`,
        why: `Con + tra stringa e numero, JS concatena: risultato '${s + n}' invece di ${Number(s) + n}.`,
      },
      [
        { text: 'console.log non accetta variabili let', why: 'console.log stampa qualunque valore.' },
        { text: 'Manca il punto e virgola', why: 'Il punto e virgola è presente e comunque opzionale.' },
        { text: `${n} non è un numero valido`, why: `${n} è un numero perfettamente valido; il problema è il tipo di '${s}'.` },
      ],
    );
    return {
      templateId: 'num-coerce-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-conversion',
      skills: ['coercion'],
      prompt: `Questo codice dovrebbe stampare ${Number(s) + n} ma stampa '${s + n}'. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: `+ con una stringa concatena: '${s}' + ${n} vale '${s + n}'.`,
        whyCorrect: `Per sommare serve convertire: Number('${s}') + ${n} = ${Number(s) + n}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Coercion con l\'operatore +',
        commonMistake: 'Sommare valori letti come stringhe senza convertirli.',
        example: "Number('5') + 3 // 8",
      },
      deepDiveRef: DD,
    };
  },
};

const roundBm: QuestionTemplate = {
  id: 'num-round-bm',
  topicId: TOPIC,
  subtopicId: 'numbers-math',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['Math.round'],
  tags: ['numeri', 'best-practice'],
  generate(rng: Rng) {
    const v = pickInt(rng, 15, 95) / 10; // es. 4.6
    const built = makeOptions(
      rng,
      { text: `Math.round(${v}) → ${Math.round(v)}`, why: `Math.round arrotonda al più vicino: ${v} → ${Math.round(v)}.` },
      [
        { text: `Math.floor(${v}) → ${Math.floor(v)}`, why: 'floor arrotonda sempre giù, non al più vicino.' },
        { text: `Math.ceil(${v}) → ${Math.ceil(v)}`, why: 'ceil arrotonda sempre su, non al più vicino.' },
        { text: `(${v}).toFixed(0) è un numero`, why: `toFixed ritorna la STRINGA '${v.toFixed(0)}', non un numero.` },
      ],
    );
    return {
      templateId: 'num-round-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-math',
      skills: ['Math.round'],
      prompt: `Vuoi arrotondare ${v} all'intero più vicino. Quale metodo usi?`,
      ...built,
      explanation: {
        short: `Math.round(${v}) restituisce ${Math.round(v)}.`,
        whyCorrect: 'round va all\'intero più vicino; floor, ceil e trunc hanno regole diverse.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Metodi di arrotondamento di Math',
        commonMistake: 'Confondere round (più vicino), floor (giù), ceil (su) e trunc (taglia).',
        example: 'Math.round(4.5) // 5; Math.floor(4.9) // 4',
      },
      deepDiveRef: DD,
    };
  },
};

export const numbersTemplates: QuestionTemplate[] = [
  modPo,
  powPo,
  floorPo,
  nanMc,
  coerceFb,
  roundBm,
];
