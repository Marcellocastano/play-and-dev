import type { QuestionTemplate } from '@lg/core';
import { makeOptions, pickInt, pickOf, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'primitive-types';
const DD = 'dd-primitive-types';

function shuffle3<T>(rng: Rng, items: readonly T[]): T[] {
  return shuffle(items, rng).slice(0, 3);
}

const typeofPo: QuestionTemplate = {
  id: 'pt-typeof-po',
  topicId: TOPIC,
  subtopicId: 'primitive-types-typeof',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['typeof'],
  tags: ['tipi'],
  generate(rng: Rng) {
    const cases = [
      { code: `console.log(typeof ${pickInt(rng, 1, 99)});`, out: 'number', fakes: ['int', 'integer'] },
      { code: `console.log(typeof '${pickOf(rng, ['ciao', 'js', 'ciao mondo'])}');`, out: 'string', fakes: ['text', 'char'] },
      { code: `console.log(typeof ${rng() < 0.5 ? 'true' : 'false'});`, out: 'boolean', fakes: ['bool', 'logic'] },
    ];
    const c = pickOf(rng, cases);
    const built = makeOptions(
      rng,
      { text: c.out, why: `typeof restituisce il nome del tipo: "${c.out}".` },
      [
        ...c.fakes.map((f) => ({ text: f, why: `"${f}" non è un nome di tipo restituito da typeof.` })),
        { text: 'undefined', why: 'Il valore esiste ed è tipizzato: typeof non restituisce undefined.' },
      ],
    );
    return {
      templateId: 'pt-typeof-po',
      type: 'predict-output',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-typeof',
      skills: ['typeof'],
      prompt: 'Cosa stampa questo codice?',
      code: c.code,
      ...built,
      explanation: {
        short: `typeof valuta il tipo del valore e restituisce la stringa "${c.out}".`,
        whyCorrect: 'typeof restituisce sempre una stringa con il nome del tipo primitivo.',
        whyOthersWrong: built.whyOthersWrong,
        concept: "L'operatore typeof",
        commonMistake: 'Aspettarsi nomi non inglesi o nomi di altri linguaggi (int, char, bool).',
        example: 'typeof 42 // "number"',
      },
      deepDiveRef: DD,
    };
  },
};

const notPrimitiveMc: QuestionTemplate = {
  id: 'pt-not-primitive-mc',
  topicId: TOPIC,
  subtopicId: 'primitive-types-list',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['tipi primitivi'],
  tags: ['tipi'],
  generate(rng: Rng) {
    const nonPrimitives = pickOf(rng, ['array', 'oggetto', 'funzione'] as const);
    const primitives = shuffle3(rng, ['string', 'number', 'boolean', 'undefined', 'symbol', 'bigint']);
    const built = makeOptions(
      rng,
      {
        text: nonPrimitives,
        why: `${nonPrimitives} non è un primitivo: è di tipo object/function.`,
      },
      primitives.map((p) => ({
        text: p,
        why: `${p} è uno dei sette tipi primitivi.`,
      })),
    );
    return {
      templateId: 'pt-not-primitive-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-list',
      skills: ['tipi primitivi'],
      prompt: 'Quale di questi NON è un tipo primitivo di JavaScript?',
      ...built,
      explanation: {
        short: 'array è un oggetto; i primitivi sono string, number, bigint, boolean, undefined, symbol, null.',
        whyCorrect: 'typeof [] restituisce "object": gli array non sono primitivi.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Primitivi vs oggetti',
        commonMistake: 'Pensare che array e oggetti siano tipi primitivi.',
        example: 'typeof [] // "object"',
      },
      deepDiveRef: DD,
    };
  },
};

const quirksCmp: QuestionTemplate = {
  id: 'pt-quirks-cmp',
  topicId: TOPIC,
  subtopicId: 'primitive-types-quirks',
  type: 'compare',
  difficulty: 'medium',
  skills: ['typeof', 'NaN', 'null'],
  tags: ['tipi', 'edge-case'],
  generate(rng: Rng) {
    const trueFacts = [
      { text: 'typeof NaN restituisce "number"', why: 'NaN è un valore numerico speciale: "Not a Number" è comunque di tipo number.' },
      { text: 'typeof [] restituisce "object"', why: 'Gli array sono oggetti: non esiste il tipo "array".' },
      { text: 'typeof undefined restituisce "undefined"', why: 'undefined è un tipo primitivo a sé.' },
      { text: 'typeof (() => {}) restituisce "function"', why: 'Le funzioni hanno un risultato typeof dedicato: "function".' },
      { text: 'typeof 10n restituisce "bigint"', why: 'I letterali con n finale sono bigint.' },
    ];
    const falseFacts = [
      { text: 'typeof null restituisce "null"', why: 'Per ragioni storiche typeof null restituisce "object".' },
      { text: 'NaN è un tipo primitivo a sé stante', why: 'NaN è un valore del tipo number, non un tipo.' },
      { text: 'typeof [] restituisce "array"', why: 'typeof [] restituisce "object": non esiste il tipo "array".' },
      { text: 'typeof "5" restituisce "number"', why: '"5" è una stringa: typeof restituisce "string".' },
      { text: 'undefined è un oggetto', why: 'undefined è un tipo primitivo, non un oggetto.' },
    ];
    const correct = pickOf(rng, trueFacts);
    const distractors = shuffle3(rng, falseFacts);
    const built = makeOptions(rng, correct, distractors);
    return {
      templateId: 'pt-quirks-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-quirks',
      skills: ['typeof'],
      prompt: 'Quale affermazione sui tipi in JavaScript è corretta?',
      ...built,
      explanation: {
        short: 'NaN è di tipo number; null e array restituiscono "object" con typeof.',
        whyCorrect: 'Nonostante il nome, NaN ("Not a Number") è un valore numerico.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Casi particolari di typeof',
        commonMistake: 'Aspettarsi "null" da typeof null: è un bug storico mai corretto.',
        example: 'typeof NaN // "number"; typeof null // "object"',
      },
      deepDiveRef: DD,
    };
  },
};

const typeofFg: QuestionTemplate = {
  id: 'pt-typeof-fg',
  topicId: TOPIC,
  subtopicId: 'primitive-types-typeof',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['typeof', '==='],
  tags: ['tipi'],
  generate(rng: Rng) {
    const name = pickOf(rng, ['x', 'valore', 'dato', 'input']);
    const t = pickOf(rng, ['number', 'string', 'boolean']);
    const label = t === 'number' ? 'è un numero' : t === 'string' ? 'è una stringa' : 'è un booleano';
    const code = `if (typeof ${name} ___ '${t}') {\n  console.log('${label}');\n}`;
    const built = makeOptions(
      rng,
      { text: '===', why: 'L\'uguaglianza stretta è il confronto corretto tra il risultato di typeof e la stringa.' },
      [
        { text: '=', why: '= è assegnazione, non confronto: renderebbe la condizione sempre vera (e darebbe errore).' },
        { text: 'equals', why: '"equals" non è un operatore di JavaScript.' },
        { text: '->', why: '"->" non esiste in JavaScript per i confronti.' },
      ],
    );
    return {
      templateId: 'pt-typeof-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-typeof',
      skills: ['typeof'],
      prompt: 'Completa il controllo di tipo con l\'operatore di uguaglianza stretta.',
      code,
      ...built,
      explanation: {
        short: 'typeof restituisce una stringa che si confronta con ===.',
        whyCorrect: 'typeof x === "number" è l\'idioma standard per controllare il tipo.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Controllo del tipo con typeof e ===',
        commonMistake: 'Usare = (assegnazione) dentro una condizione.',
        example: 'if (typeof v === "string") { ... }',
      },
      deepDiveRef: DD,
    };
  },
};

const checkStringBm: QuestionTemplate = {
  id: 'pt-check-string-bm',
  topicId: TOPIC,
  subtopicId: 'primitive-types-typeof',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['typeof'],
  tags: ['tipi', 'best-practice'],
  generate(rng: Rng) {
    const v = pickOf(rng, ['testo', 'messaggio', 'nome', 'dato', 'input']);
    const t = pickOf(rng, ['string', 'number', 'boolean'] as const);
    const checkFn = t === 'string' ? 'isString' : t === 'number' ? 'isNumber' : 'isBoolean';
    const built = makeOptions(
      rng,
      { text: `typeof ${v} === '${t}'`, why: 'typeof è il modo standard e sicuro per controllare un tipo primitivo.' },
      [
        { text: `${v}.type === '${t}'`, why: 'I primitivi non hanno una proprietà .type con il nome del tipo.' },
        { text: `${v} instanceof ${t}`, why: `instanceof funziona con i costruttori (${t[0]!.toUpperCase()}${t.slice(1)}), non col nome minuscolo.` },
        { text: `${checkFn}(${v})`, why: `${checkFn} non è una funzione nativa di JavaScript.` },
      ],
    );
    return {
      templateId: 'pt-check-string-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-typeof',
      skills: ['typeof'],
      prompt: `Vuoi verificare che \`${v}\` sia di tipo ${t}. Qual è il modo corretto?`,
      ...built,
      explanation: {
        short: 'typeof v === "string" è il controllo idiomatico per i tipi primitivi.',
        whyCorrect: 'typeof funziona su qualunque valore e non lancia errori.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Verifica del tipo primitivo',
        commonMistake: 'Cercare proprietà o funzioni helper che non esistono.',
        example: 'typeof "ciao" === "string" // true',
      },
      deepDiveRef: DD,
    };
  },
};

export const primitiveTypesTemplates: QuestionTemplate[] = [
  typeofPo,
  notPrimitiveMc,
  quirksCmp,
  typeofFg,
  checkStringBm,
];
