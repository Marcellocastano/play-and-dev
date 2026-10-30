import type { QuestionTemplate } from '@lg/core';
import { defineMatch, defineTemplate, pickInt, pickOf, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'primitive-types';

function shuffle3<T>(rng: Rng, items: readonly T[]): T[] {
  return shuffle(items, rng).slice(0, 3);
}

const typeofPo = defineTemplate(
  {
    id: 'pt-typeof-po',
    topicId: TOPIC,
    subtopicId: 'primitive-types-typeof',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['typeof'],
    tags: ['tipi'],
  },
  (rng) => {
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
    return {
      prompt: 'Cosa stampa questo codice?',
      code: c.code,
      correct: {
        text: c.out,
        why: `typeof valuta il tipo del valore e restituisce la stringa "${c.out}".`,
      },
      distractors: [
        ...c.fakes.map((f) => ({
          text: f,
          why: `"${f}" è il nome usato in altri linguaggi, ma non è tra le stringhe che typeof può restituire: qui il risultato è "${c.out}".`,
        })),
        {
          text: 'undefined',
          why: `Il valore esiste ed è tipizzato, quindi typeof restituisce una stringa ("${c.out}"), non undefined.`,
        },
      ],
      short: `typeof valuta il tipo del valore e restituisce la stringa "${c.out}".`,
      whyCorrect: 'typeof restituisce sempre una stringa con il nome del tipo primitivo.',
      concept: "L'operatore typeof",
      commonMistake: 'Aspettarsi nomi non inglesi o nomi di altri linguaggi (int, char, bool).',
      example: 'typeof 42 // "number"',
    };
  },
);

const notPrimitiveMc = defineTemplate(
  {
    id: 'pt-not-primitive-mc',
    topicId: TOPIC,
    subtopicId: 'primitive-types-list',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['tipi primitivi'],
    tags: ['tipi'],
  },
  (rng) => {
    const nonPrimitives = pickOf(rng, ['array', 'oggetto', 'funzione'] as const);
    const primitives = shuffle3(rng, [
      'string',
      'number',
      'boolean',
      'undefined',
      'symbol',
      'bigint',
    ]);
    return {
      prompt: 'Quale di questi NON è un tipo primitivo di JavaScript?',
      correct: {
        text: nonPrimitives,
        why: `\`${nonPrimitives}\` non è nella lista dei primitivi: gli array, gli oggetti e le funzioni appartengono al tipo object/function.`,
      },
      distractors: primitives.map((p) => ({
        text: p,
        why: `\`${p}\` è uno dei sette tipi primitivi di JavaScript (string, number, bigint, boolean, undefined, symbol, null), quindi non può essere la risposta.`,
      })),
      short:
        'array è un oggetto; i primitivi sono string, number, bigint, boolean, undefined, symbol, null.',
      whyCorrect: 'typeof [] restituisce "object": gli array non sono primitivi.',
      concept: 'Primitivi vs oggetti',
      commonMistake: 'Pensare che array e oggetti siano tipi primitivi.',
      example: 'typeof [] // "object"',
    };
  },
);

const quirksCmp = defineTemplate(
  {
    id: 'pt-quirks-cmp',
    topicId: TOPIC,
    subtopicId: 'primitive-types-quirks',
    type: 'compare',
    difficulty: 'medium',
    skills: ['typeof', 'NaN', 'null'],
    tags: ['tipi', 'edge-case'],
  },
  (rng) => {
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
    return {
      prompt: v.prompt,
      correct: v.correct,
      distractors: shuffle3(rng, v.wrong),
      short: v.concept,
      whyCorrect: v.correct.why,
      concept: 'Casi particolari di typeof',
      commonMistake: 'Aspettarsi "null" da typeof null o che NaN non sia "number".',
      example: 'typeof NaN // "number"; typeof null // "object"',
    };
  },
);

const typeofFg = defineTemplate(
  {
    id: 'pt-typeof-fg',
    topicId: TOPIC,
    subtopicId: 'primitive-types-typeof',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['typeof', '==='],
    tags: ['tipi'],
  },
  (rng) => {
    const name = pickOf(rng, ['x', 'valore', 'dato', 'input']);
    const t = pickOf(rng, ['number', 'string', 'boolean']);
    const label =
      t === 'number' ? 'è un numero' : t === 'string' ? 'è una stringa' : 'è un booleano';
    const code = `if (typeof ${name} ___ '${t}') {\n  console.log('${label}');\n}`;
    return {
      prompt: "Completa il controllo di tipo con l'operatore di uguaglianza stretta.",
      code: code,
      correct: {
        text: '===',
        why: `Per confrontare il risultato di \`typeof ${name}\` con la stringa '${t}' serve l'uguaglianza stretta: \`typeof ${name} === '${t}'\`.`,
      },
      distractors: [
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
      short: 'typeof restituisce una stringa che si confronta con ===.',
      whyCorrect: 'typeof x === "number" è l\'idioma standard per controllare il tipo.',
      concept: 'Controllo del tipo con typeof e ===',
      commonMistake: 'Usare = (assegnazione) dentro una condizione.',
      example: 'if (typeof v === "string") { ... }',
    };
  },
);

const checkStringBm = defineTemplate(
  {
    id: 'pt-check-string-bm',
    topicId: TOPIC,
    subtopicId: 'primitive-types-typeof',
    type: 'best-method',
    difficulty: 'easy',
    skills: ['typeof'],
    tags: ['tipi', 'best-practice'],
  },
  (rng) => {
    const v = pickOf(rng, ['testo', 'messaggio', 'nome', 'dato', 'input']);
    const t = pickOf(rng, ['string', 'number', 'boolean'] as const);
    const T = t[0]!.toUpperCase() + t.slice(1);
    return {
      prompt: `Vuoi verificare che \`${v}\` sia di tipo ${t}. Qual è il modo corretto?`,
      correct: {
        text: `typeof ${v} === '${t}'`,
        why: `Per i tipi primitivi il controllo standard è \`typeof ${v} === '${t}'\`: funziona su qualunque valore senza errori.`,
      },
      distractors: [
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
      short: 'typeof v === "string" è il controllo idiomatico per i tipi primitivi.',
      whyCorrect: 'typeof funziona su qualunque valore e non lancia errori.',
      concept: 'Verifica del tipo primitivo',
      commonMistake: 'Cercare proprietà o funzioni helper che non esistono.',
      example: 'typeof "ciao" === "string" // true',
    };
  },
);

export const TYPEOF_ROWS: { expr: string; result: string; why: string }[] = [
  {
    expr: 'typeof null',
    result: typeof null,
    why: 'typeof null restituisce "object" per un errore storico del linguaggio mantenuto per compatibilità: null non è un oggetto.',
  },
  {
    expr: 'typeof []',
    result: typeof [],
    why: 'Gli array sono oggetti: typeof non distingue [] da un oggetto qualunque e restituisce "object".',
  },
  {
    expr: 'typeof 42n',
    result: typeof 42n,
    why: 'I valori BigInt, scritti con la n finale, hanno un tipo proprio: typeof 42n restituisce "bigint".',
  },
  {
    expr: 'typeof NaN',
    result: typeof NaN,
    why: 'NaN significa "not a number" ma appartiene al tipo number: è il risultato di operazioni numeriche fallite.',
  },
  {
    expr: "typeof 'x'",
    result: typeof 'x',
    why: 'Ogni letterale tra apici è una stringa: anche un solo carattere ha tipo "string" per typeof.',
  },
  {
    expr: 'typeof (() => 0)',
    result: typeof (() => 0),
    why: 'Le funzioni hanno un tipo speciale dedicato: typeof restituisce "function" e non "object".',
  },
  {
    expr: 'typeof nonAssegnata',
    result: 'undefined',
    why: 'Una variabile senza valore vale undefined, e typeof restituisce "undefined" perfino per un nome mai dichiarato, senza lanciare errori.',
  },
  {
    expr: 'typeof 3.14',
    result: typeof 3.14,
    why: 'JavaScript ha un solo tipo numerico: interi e decimali condividono il tipo "number".',
  },
  {
    expr: 'typeof true',
    result: typeof true,
    why: 'I letterali true e false appartengono al tipo boolean: typeof true restituisce "boolean".',
  },
  {
    expr: 'typeof {}',
    result: typeof {},
    why: 'Un oggetto letterale ha tipo "object": typeof non distingue oggetti, array e null.',
  },
];

const TYPEOF_DISTRACTORS = ['array', 'integer', 'char', 'null'];

const typeofMatch = defineMatch(
  {
    id: 'prim-typeof-match',
    topicId: TOPIC,
    subtopicId: 'primitive-types-typeof',
    type: 'match',
    difficulty: 'medium',
    skills: ['typeof', 'tipi'],
    tags: ['tipi'],
  },
  (rng) => {
    const picked = shuffle(TYPEOF_ROWS, rng).slice(0, 5);
    const results = [...new Set(picked.map((p) => p.result))];
    if (results.length > 3) throw new Error('troppi risultati distinti');
    const distractor = pickOf(
      rng,
      TYPEOF_DISTRACTORS.filter((d) => !results.includes(d)),
    );
    return {
      prompt: 'Abbina ogni espressione al valore che `typeof` restituisce.',
      choices: shuffle([...results, distractor], rng),
      rows: picked.map((p) => ({
        text: `\`${p.expr}\``,
        choice: p.result,
        why: p.why,
      })),
      short: 'typeof restituisce sempre una stringa con il nome del tipo del valore.',
      whyCorrect:
        'Ogni espressione produce il nome del tipo calcolato da typeof sul valore reale: la riga va abbinata a quel nome.',
      concept: "L'operatore typeof",
      commonMistake: 'Aspettarsi "array" o "null": typeof non ha questi nomi tra i suoi risultati.',
      example: "typeof [] // 'object', typeof null // 'object'",
    };
  },
);

export const primitiveTypesTemplates: QuestionTemplate[] = [
  typeofPo,
  notPrimitiveMc,
  quirksCmp,
  typeofFg,
  checkStringBm,
  typeofMatch,
];
