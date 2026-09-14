import type { QuestionTemplate } from '@lg/core';
import { makeOptions, pickOf, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'booleans-null-undefined';
const DD = 'dd-booleans-null-undefined';

const falsyMc: QuestionTemplate = {
  id: 'bnu-falsy-mc',
  topicId: TOPIC,
  subtopicId: 'bnu-truthy-falsy',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['truthy/falsy'],
  tags: ['booleani'],
  generate(rng: Rng) {
    const falsyPool = [
      { text: '0', why: 'Il numero 0 è falsy.' },
      { text: "''", why: 'La stringa vuota è falsy.' },
      { text: 'undefined', why: 'undefined è falsy.' },
      { text: 'NaN', why: 'NaN è falsy.' },
    ];
    const truthyPool = [
      { text: "'0'", why: "La stringa '0' non è vuota: è truthy." },
      { text: '[]', why: 'Un array vuoto è un oggetto: è truthy.' },
      { text: "'false'", why: "La stringa 'false' non è vuota: è truthy (è il booleano false a essere falsy)." },
      { text: '{}', why: 'Un oggetto vuoto è truthy.' },
      { text: '-1', why: 'Solo 0 è falsy tra i numeri: -1 è truthy.' },
    ];
    const correct = pickOf(rng, falsyPool);
    const distractors = shuffle(truthyPool, rng).slice(0, 3);
    const built = makeOptions(rng, correct, distractors);
    return {
      templateId: 'bnu-falsy-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'bnu-truthy-falsy',
      skills: ['truthy/falsy'],
      prompt: 'Quale di questi valori è falsy?',
      ...built,
      explanation: {
        short: 'I falsy sono: false, 0, "", null, undefined, NaN. Tutto il resto è truthy.',
        whyCorrect: '0 è uno dei sei valori falsy.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Valori truthy e falsy',
        commonMistake: "Pensare che '0', 'false' o [] siano falsy.",
        example: 'if ([]) { /* viene eseguito: [] è truthy */ }',
      },
      deepDiveRef: DD,
    };
  },
};

const typeofUndefinedPo: QuestionTemplate = {
  id: 'bnu-typeof-po',
  topicId: TOPIC,
  subtopicId: 'bnu-null-undefined',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['undefined', 'typeof'],
  tags: ['tipi'],
  generate(rng: Rng) {
    const name = pickOf(rng, ['x', 'valore', 'dato', 'input']);
    const useNull = rng() < 0.4;
    const code = useNull
      ? `let ${name} = null;\nconsole.log(${name});\nconsole.log(typeof ${name});`
      : `let ${name};\nconsole.log(${name});\nconsole.log(typeof ${name});`;
    const correct = useNull ? 'null\nobject' : 'undefined\nundefined';
    const correctWhy = useNull
      ? 'La variabile vale null e typeof null restituisce "object" (bug storico).'
      : 'Una variabile dichiarata e non inizializzata vale undefined, e il suo tipo è "undefined".';
    const built = makeOptions(
      rng,
      { text: correct, why: correctWhy },
      [
        { text: 'undefined\nundefined', why: useNull ? 'La variabile è inizializzata a null, non undefined.' : 'Ma questa è la risposta corretta — se compare come distrattore è un bug.' },
        { text: 'null\nobject', why: useNull ? 'Ma questa è la risposta corretta — se compare come distrattore è un bug.' : 'Una let non inizializzata vale undefined, non null.' },
        { text: 'undefined\nnull', why: 'typeof undefined è "undefined", non "null".' },
        { text: 'null\nnull', why: 'typeof null è "object", non "null".' },
      ].filter((d) => d.text !== correct),
    );
    return {
      templateId: 'bnu-typeof-po',
      type: 'predict-output',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'bnu-null-undefined',
      skills: ['undefined', 'typeof'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: useNull
          ? 'null è un valore assegnato; typeof null è "object".'
          : 'Una let senza valore vale undefined; typeof undefined è "undefined".',
        whyCorrect: correctWhy,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'undefined, null e typeof',
        commonMistake: 'Confondere undefined (non assegnato) con null (assegnato).',
        example: 'let a; console.log(a); // undefined',
      },
      deepDiveRef: DD,
    };
  },
};

const nullUndefCmp: QuestionTemplate = {
  id: 'bnu-null-undef-cmp',
  topicId: TOPIC,
  subtopicId: 'bnu-null-undefined',
  type: 'compare',
  difficulty: 'medium',
  skills: ['null', 'undefined', '==', '==='],
  tags: ['confronti'],
  generate(rng: Rng) {
    const trueFacts = [
      { text: 'null == undefined è true, ma null === undefined è false', why: 'Con == sono considerati uguali (regola speciale); con === hanno tipi diversi → false.' },
      { text: 'Una variabile let non inizializzata vale undefined', why: 'undefined è il valore di default; null va assegnato esplicitamente.' },
      { text: 'x == null è vero sia per null che per undefined', why: 'La regola speciale di == copre entrambi i casi di "nessun valore".' },
      { text: 'typeof null restituisce "object"', why: 'È un bug storico mai corretto per compatibilità.' },
      { text: 'null e undefined sono entrambi falsy', why: 'In una condizione si comportano entrambi come false.' },
    ];
    const falseFacts = [
      { text: 'null e undefined sono esattamente lo stesso valore', why: 'Sono valori di tipi diversi: === li distingue.' },
      { text: 'null === undefined è true', why: 'I tipi differiscono (object vs undefined): il confronto stretto è false.' },
      { text: 'undefined è un oggetto vuoto', why: 'undefined è un tipo primitivo a sé, non un oggetto.' },
      { text: 'Una variabile non inizializzata vale null', why: 'Vale undefined: null va assegnato esplicitamente.' },
      { text: 'typeof undefined restituisce "object"', why: 'typeof undefined restituisce "undefined"; è null a dare "object".' },
    ];
    const built = makeOptions(
      rng,
      pickOf(rng, trueFacts),
      shuffle(falseFacts, rng).slice(0, 3),
    );
    return {
      templateId: 'bnu-null-undef-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'bnu-null-undefined',
      skills: ['null', 'undefined'],
      prompt: 'Quale affermazione su null e undefined è corretta?',
      ...built,
      explanation: {
        short: '== li considera equivalenti, === no.',
        whyCorrect: 'È l\'unica coppia di valori diversi considerata uguale da ==.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'null vs undefined',
        commonMistake: 'Usare === dove si vuole coprire entrambi i casi (serve x == null).',
        example: 'x == null // vero sia per null che per undefined',
      },
      deepDiveRef: DD,
    };
  },
};

const undefFg: QuestionTemplate = {
  id: 'bnu-undef-fg',
  topicId: TOPIC,
  subtopicId: 'bnu-null-undefined',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['undefined', '==='],
  tags: ['tipi'],
  generate(rng: Rng) {
    const name = pickOf(rng, ['x', 'dato', 'input', 'valore']);
    const code = `let ${name};\nconsole.log(${name} === ___);`;
    const wrongPool = shuffle(
      [
        { text: 'null', why: 'undefined === null è false: sono tipi diversi.' },
        { text: '0', why: 'undefined === 0 è false.' },
        { text: "''", why: 'undefined === "" è false.' },
        { text: 'false', why: 'undefined === false è false.' },
        { text: 'NaN', why: 'undefined === NaN è false (e NaN !== NaN comunque).' },
      ],
      rng,
    ).slice(0, 3);
    const built = makeOptions(
      rng,
      { text: 'undefined', why: `Una let non inizializzata vale undefined: il confronto è true.` },
      wrongPool,
    );
    return {
      templateId: 'bnu-undef-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'bnu-null-undefined',
      skills: ['undefined'],
      prompt: 'Completa affinché il codice stampi true.',
      code,
      ...built,
      explanation: {
        short: `${name} non è inizializzata: vale undefined.`,
        whyCorrect: 'undefined === undefined → true.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Valore di default di una variabile non inizializzata',
        commonMistake: 'Pensare che valga null: null va assegnato esplicitamente.',
        example: 'let a; a === undefined // true',
      },
      deepDiveRef: DD,
    };
  },
};

const nullCheckBm: QuestionTemplate = {
  id: 'bnu-null-check-bm',
  topicId: TOPIC,
  subtopicId: 'bnu-null-undefined',
  type: 'best-method',
  difficulty: 'medium',
  skills: ['null', 'undefined', '=='],
  tags: ['best-practice'],
  generate(rng: Rng) {
    const name = pickOf(rng, ['dato', 'valore', 'risultato', 'input', 'config']);
    const built = makeOptions(
      rng,
      {
        text: `${name} != null`,
        why: 'Con il confronto debole != null si coprono sia null che undefined in un colpo solo.',
      },
      [
        { text: `${name} !== null`, why: 'Controlla solo null: undefined passerebbe comunque.' },
        { text: `${name} !== undefined`, why: 'Controlla solo undefined: null passerebbe comunque.' },
        { text: `typeof ${name} === 'null'`, why: "typeof null è 'object': questo controllo non funziona." },
        { text: `${name} != undefined`, why: 'È equivalente a != null (funziona), ma la forma idiomatica è != null.' },
      ].slice(0, 3),
    );
    return {
      templateId: 'bnu-null-check-bm',
      type: 'best-method',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'bnu-null-undefined',
      skills: ['null', 'undefined'],
      prompt: `Vuoi proseguire solo se \`${name}\` non è né null né undefined. Qual è il controllo più pratico?`,
      ...built,
      explanation: {
        short: 'x != null è l\'unico uso "accettato" del confronto debole: copre null e undefined.',
        whyCorrect: 'Poiché null == undefined, != null esclude entrambi.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Controllo null/undefined con ==',
        commonMistake: 'Scrivere due controlli separati quando basta != null.',
        example: 'if (dato != null) { /* dato ha un valore */ }',
      },
      deepDiveRef: DD,
    };
  },
};

export const booleansNullUndefinedTemplates: QuestionTemplate[] = [
  falsyMc,
  typeofUndefinedPo,
  nullUndefCmp,
  undefFg,
  nullCheckBm,
];
