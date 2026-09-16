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
      {
        code: `console.log(typeof ${pickInt(rng, 1, 99)});`,
        out: 'number',
        fakes: ['int', 'integer'],
      },
      {
        code: `console.log(typeof '${pickOf(rng, ['ciao', 'js', 'ciao mondo'])}');`,
        out: 'string',
        fakes: ['text', 'char'],
      },
      {
        code: `console.log(typeof ${rng() < 0.5 ? 'true' : 'false'});`,
        out: 'boolean',
        fakes: ['bool', 'logic'],
      },
    ];
    const c = pickOf(rng, cases);
    const built = makeOptions(
      rng,
      {
        text: c.out,
        why: `typeof valuta il tipo del valore e restituisce la stringa "${c.out}".`,
      },
      [
        ...c.fakes.map((f) => ({
          text: f,
          why: `"${f}" è il nome usato in altri linguaggi, ma non è tra le stringhe che typeof può restituire: qui il risultato è "${c.out}".`,
        })),
        {
          text: 'undefined',
          why: `Il valore esiste ed è tipizzato, quindi typeof restituisce una stringa ("${c.out}"), non undefined.`,
        },
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
    const primitives = shuffle3(rng, [
      'string',
      'number',
      'boolean',
      'undefined',
      'symbol',
      'bigint',
    ]);
    const built = makeOptions(
      rng,
      {
        text: nonPrimitives,
        why: `\`${nonPrimitives}\` non è nella lista dei primitivi: gli array, gli oggetti e le funzioni appartengono al tipo object/function.`,
      },
      primitives.map((p) => ({
        text: p,
        why: `\`${p}\` è uno dei sette tipi primitivi di JavaScript (string, number, bigint, boolean, undefined, symbol, null), quindi non può essere la risposta.`,
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
        short:
          'array è un oggetto; i primitivi sono string, number, bigint, boolean, undefined, symbol, null.',
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
    const variants = [
      {
        prompt: "Quale espressione restituisce 'object'?",
        correct: {
          text: 'typeof null',
          why: "Per un bug storico mai corretto, `typeof null` restituisce 'object' anche se null è un primitivo.",
        },
        wrong: [
          {
            text: 'typeof undefined',
            why: "`undefined` è un tipo primitivo a sé: `typeof undefined` restituisce 'undefined', non 'object'.",
          },
          {
            text: 'typeof NaN',
            why: "Nonostante il nome, NaN è un valore numerico: `typeof NaN` restituisce 'number'.",
          },
          {
            text: 'typeof 0n',
            why: "Il suffisso `n` crea un bigint: `typeof 0n` restituisce 'bigint', non 'object'.",
          },
        ],
        concept: 'typeof null === "object"',
      },
      {
        prompt: "Quale espressione restituisce 'number'?",
        correct: {
          text: 'typeof NaN',
          why: "Nonostante il nome ('Not a Number'), NaN è un valore numerico: `typeof NaN` restituisce 'number'.",
        },
        wrong: [
          {
            text: "typeof '42'",
            why: "Il contenuto numerico non cambia il tipo: `'42'` resta una stringa, quindi typeof restituisce 'string'.",
          },
          {
            text: 'typeof null',
            why: "Per il bug storico, `typeof null` restituisce 'object', non 'number'.",
          },
          {
            text: 'typeof true',
            why: "`true` è un booleano: `typeof true` restituisce 'boolean', non 'number'.",
          },
        ],
        concept: 'typeof NaN === "number"',
      },
      {
        prompt: "Quale espressione restituisce 'function'?",
        correct: {
          text: 'typeof (() => {})',
          why: "Le funzioni sono l'unico oggetto con un risultato dedicato: `typeof` di una funzione restituisce 'function'.",
        },
        wrong: [
          {
            text: 'typeof {}',
            why: "`{}` è un oggetto normale: `typeof {}` restituisce 'object', mentre solo le funzioni danno 'function'.",
          },
          {
            text: 'typeof []',
            why: "Gli array sono oggetti: `typeof []` restituisce 'object', non 'function'.",
          },
          {
            text: 'typeof null',
            why: "Per il bug storico `typeof null` restituisce 'object', non 'function'.",
          },
        ],
        concept: 'typeof di una funzione',
      },
      {
        prompt: "Quale espressione restituisce 'undefined'?",
        correct: {
          text: 'typeof undefined',
          why: "`undefined` è un tipo primitivo con il suo stesso nome: `typeof undefined` restituisce 'undefined'.",
        },
        wrong: [
          {
            text: 'typeof null',
            why: "Per il bug storico, `typeof null` restituisce 'object', non 'undefined'.",
          },
          {
            text: 'typeof NaN',
            why: "NaN è un valore numerico: `typeof NaN` restituisce 'number', non 'undefined'.",
          },
          {
            text: 'typeof 0',
            why: "Essere falsy non significa essere undefined: `0` è un numero e typeof restituisce 'number'.",
          },
        ],
        concept: 'typeof undefined === "undefined"',
      },
      {
        prompt: "Quale espressione restituisce 'bigint'?",
        correct: {
          text: 'typeof 10n',
          why: "Il suffisso `n` crea un bigint: `typeof 10n` restituisce 'bigint'.",
        },
        wrong: [
          {
            text: 'typeof 10',
            why: "Senza il suffisso `n`, `10` è un numero normale: `typeof 10` restituisce 'number'.",
          },
          {
            text: "typeof 'n'",
            why: "La `n` va attaccata al numero come suffisso: `'n'` è una stringa e typeof restituisce 'string'.",
          },
          {
            text: 'typeof Infinity',
            why: "`Infinity` è un numero speciale: `typeof Infinity` restituisce 'number', non 'bigint'.",
          },
        ],
        concept: 'typeof 10n === "bigint"',
      },
    ];
    const v = pickOf(rng, variants);
    const built = makeOptions(rng, v.correct, shuffle3(rng, v.wrong));
    return {
      templateId: 'pt-quirks-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-quirks',
      skills: ['typeof'],
      prompt: v.prompt,
      ...built,
      explanation: {
        short: v.concept,
        whyCorrect: v.correct.why,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Casi particolari di typeof',
        commonMistake: 'Aspettarsi "null" da typeof null o che NaN non sia "number".',
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
    const label =
      t === 'number' ? 'è un numero' : t === 'string' ? 'è una stringa' : 'è un booleano';
    const code = `if (typeof ${name} ___ '${t}') {\n  console.log('${label}');\n}`;
    const built = makeOptions(
      rng,
      {
        text: '===',
        why: `Per confrontare il risultato di \`typeof ${name}\` con la stringa '${t}' serve l'uguaglianza stretta: \`typeof ${name} === '${t}'\`.`,
      },
      [
        {
          text: '=',
          why: `\`=\` è assegnazione, non confronto: \`typeof ${name} = '${t}'\` tenterebbe di assegnare a un'espressione e darebbe un errore.`,
        },
        {
          text: 'equals',
          why: 'In JavaScript non esiste un operatore `equals`: i confronti si fanno con `===` (o con il metodo `.equals()` di altri linguaggi, che qui non esiste).',
        },
        {
          text: '->',
          why: 'La freccia `->` non è un operatore di confronto in JavaScript: esiste solo `=>` per le arrow function, e il confronto giusto è `===`.',
        },
      ],
    );
    return {
      templateId: 'pt-typeof-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'primitive-types-typeof',
      skills: ['typeof'],
      prompt: "Completa il controllo di tipo con l'operatore di uguaglianza stretta.",
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
    const T = t[0]!.toUpperCase() + t.slice(1);
    const built = makeOptions(
      rng,
      {
        text: `typeof ${v} === '${t}'`,
        why: `Per i tipi primitivi il controllo standard è \`typeof ${v} === '${t}'\`: funziona su qualunque valore senza errori.`,
      },
      [
        {
          text: `${v} instanceof ${T}`,
          why: `\`instanceof\` controlla la catena di prototipi e funziona solo con oggetti: su un primitivo come ${v} restituisce sempre false.`,
        },
        {
          text: `typeof ${v} === ${T}`,
          why: `Senza virgolette si confronta il risultato di typeof con il costruttore ${T}: la stringa '${t}' non è mai uguale a una funzione.`,
        },
        {
          text: `${v}.type === '${t}'`,
          why: `I valori primitivi non espongono una proprietà \`type\`: l'espressione leggerebbe undefined e il confronto darebbe false.`,
        },
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
