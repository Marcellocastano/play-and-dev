import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, retry, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'closures-advanced';
const DD = 'dd-closures-advanced';

const counterPo: QuestionTemplate = {
  id: 'cl-counter-po',
  topicId: TOPIC,
  subtopicId: 'closures-state',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    return retry(() => {
    const start = pickInt(rng, 0, 30);
    const v = pickOf(rng, ['n', 'tot', 'count', 'val']);
    const cname = pickOf(rng, ['c', 'next', 'tick']);
    const calls = pickInt(rng, 1, 3);
    const code = `function counter() {\n  let ${v} = ${start};\n  return function () {\n    ${v}++;\n    return ${v};\n  };\n}\nconst ${cname} = counter();\n${`${cname}();\n`.repeat(calls - 1)}console.log(${cname}());`;
    const result = start + calls;
    const built = makeOptions(
      rng,
      { text: fmt(result), why: `${cname}() è stata chiamata ${calls} volt${calls === 1 ? 'a' : 'e'}: ${v} arriva a ${result}.` },
      [
        { text: fmt(result - 1), why: `${v} persiste nella closure: ogni chiamata la incrementa.` },
        { text: fmt(start), why: `${v} non si resetta: la closure la ricorda tra le chiamate.` },
        { text: fmt(result + 1), why: `Sono state fatte solo ${calls} chiamat${calls === 1 ? 'a' : 'e'}.` },
      ],
    );
    return {
      templateId: 'cl-counter-po',
      type: 'predict-output',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'closures-state',
      skills: ['closure'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `La closure ricorda ${v}: ${calls} chiamat${calls === 1 ? 'a' : 'e'} → ${result}.`,
        whyCorrect: `${v} è catturata dalla funzione interna e persiste tra le chiamate.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Stato privato via closure',
        commonMistake: 'Pensare che la variabile catturata si resetti a ogni chiamata.',
        example: 'Ogni counter() crea uno scope nuovo con la sua n.',
      },
      deepDiveRef: DD,
    };
    });
  },
};

const separatePo: QuestionTemplate = {
  id: 'cl-separate-po',
  topicId: TOPIC,
  subtopicId: 'closures-state',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    const start = pickInt(rng, 0, 30);
    const v = pickOf(rng, ['n', 'tot', 'count']);
    const aCalls = pickInt(rng, 1, 3);
    const code = `function counter() {\n  let ${v} = ${start};\n  return function () {\n    ${v}++;\n    return ${v};\n  };\n}\nconst a = counter();\nconst b = counter();\n${'a();\n'.repeat(aCalls)}console.log(b());`;
    const built = makeOptions(
      rng,
      { text: fmt(start + 1), why: `b ha il suo scope separato: alla prima chiamata ${v} è ${start + 1}.` },
      [
        { text: fmt(start + aCalls + 1), why: `a e b non condividono ${v}: ogni counter() crea uno scope diverso.` },
        { text: fmt(start), why: `b() incrementa la sua ${v}: non resta al valore iniziale.` },
        { text: 'undefined', why: 'La funzione interna ritorna sempre un numero.' },
      ],
    );
    return {
      templateId: 'cl-separate-po',
      type: 'predict-output',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'closures-state',
      skills: ['closure'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `Ogni counter() crea una ${v} indipendente: b() parte da ${start} → ${start + 1}.`,
        whyCorrect: 'Le due closure catturano scope diversi.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Scope separati per factory',
        commonMistake: 'Pensare che i contatori condividano lo stato.',
        example: 'const c1 = counter(), c2 = counter(); c1 e c2 hanno n diverse.',
      },
      deepDiveRef: DD,
    };
  },
};

const captureMc: QuestionTemplate = {
  id: 'cl-capture-mc',
  topicId: TOPIC,
  subtopicId: 'closures-capture',
  type: 'multiple-choice',
  difficulty: 'medium',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    const trueStatements = [
      { text: 'Le variabili dello scope in cui la funzione è stata definita, anche dopo che quello scope è terminato', why: 'La closure "chiude" sulle variabili lessicali: restano vive finché la funzione esiste.' },
      { text: 'I riferimenti alle variabili lessicali esterne, non copie dei valori', why: 'Se la variabile esterna cambia, la closure vede il nuovo valore.' },
      { text: 'Lo scope lessicale della definizione, non quello della chiamata', why: 'Conta dove la funzione è scritta, non dove è invocata.' },
    ];
    const falseStatements = [
      { text: 'Una copia dei valori delle variabili al momento della definizione', why: 'Cattura la variabile, non il valore: se cambia, la closure vede il nuovo valore.' },
      { text: 'Solo le variabili globali', why: 'Cattura qualunque variabile dello scope lessicale esterno, non solo le globali.' },
      { text: 'I parametri della chiamata che l\'ha creata', why: 'Cattura lo scope lessicale: chi la chiama dopo non c\'entra.' },
      { text: 'Solo variabili dichiarate const', why: 'Cattura anche let (e var): il tipo di binding non conta.' },
    ];
    const built = makeOptions(
      rng,
      pickOf(rng, trueStatements),
      shuffle(falseStatements, rng).slice(0, 3),
    );
    return {
      templateId: 'cl-capture-mc',
      type: 'multiple-choice',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'closures-capture',
      skills: ['closure'],
      prompt: 'Che cosa "cattura" una closure?',
      ...built,
      explanation: {
        short: 'La closure cattura le variabili dello scope lessicale di definizione.',
        whyCorrect: 'È così che una funzione interna ricorda i dati anche dopo il return della esterna.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Definizione di closure',
        commonMistake: 'Pensare a una copia dei valori: è un riferimento alla variabile.',
        example: 'function outer() { let s = 1; return () => s; } // la closure vede s',
      },
      deepDiveRef: DD,
    };
  },
};

export const closuresAdvancedTemplates: QuestionTemplate[] = [
  counterPo,
  separatePo,
  captureMc,
];
