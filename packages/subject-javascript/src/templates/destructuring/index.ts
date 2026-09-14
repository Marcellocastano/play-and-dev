import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, pickOf, PERSON_NAMES, retry, type Rng } from '../helpers.js';

const TOPIC = 'destructuring';
const DD = 'dd-destructuring';

const objPo: QuestionTemplate = {
  id: 'de-obj-po',
  topicId: TOPIC,
  subtopicId: 'destructuring-objects',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['destructuring', 'oggetti'],
  tags: ['destructuring'],
  generate(rng: Rng) {
    return retry(() => {
      const nome = pickOf(rng, PERSON_NAMES);
      const eta = pickInt(rng, 18, 60);
      const key = pickOf(rng, ['nome', 'eta'] as const);
      const correct = key === 'nome' ? nome : eta;
      const code = `const utente = { nome: '${nome}', eta: ${eta} };\nconst { ${key} } = utente;\nconsole.log(${key});`;
      const built = makeOptions(
        rng,
        { text: fmt(correct), why: `Il destructuring estrae utente.${key} in ${key}: ${fmt(correct)}.` },
        [
          { text: fmt(key === 'nome' ? eta : nome), why: 'Estrae la proprietà omonima, non l\'altra.' },
          { text: 'undefined', why: `La proprietà ${key} esiste: viene estratta.` },
          { text: `{ ${key}: ${fmt(correct, true)} }`, why: 'const { k } = o estrae il valore, non un oggetto.' },
        ],
      );
      return {
        templateId: 'de-obj-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'destructuring-objects',
        skills: ['destructuring'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `const { ${key} } = utente crea la variabile ${key} = ${fmt(correct)}.`,
          whyCorrect: 'Le graffe a sinistra estraggono la proprietà omonima.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Destructuring di oggetti',
          commonMistake: 'Pensare che serva obj.prop dopo il destructuring.',
          example: 'const { a } = { a: 1 } // a = 1',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const skipFg: QuestionTemplate = {
  id: 'de-arr-skip-fg',
  topicId: TOPIC,
  subtopicId: 'destructuring-arrays',
  type: 'fill-the-gap',
  difficulty: 'medium',
  skills: ['destructuring', 'array'],
  tags: ['destructuring'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 30, true);
    const code = `const [___] = [${arr.join(', ')}];\nconsole.log(secondo); // ${arr[1]}`;
    const built = makeOptions(
      rng,
      { text: ', secondo', why: 'La virgola salta il primo elemento: secondo riceve il secondo.' },
      [
        { text: 'secondo', why: `Senza virgola, secondo riceverebbe il primo elemento (${arr[0]}).` },
        { text: 'secondo,', why: 'La virgola dopo non salta nulla: secondo prenderebbe il primo elemento.' },
        { text: '_, secondo', why: 'Anche una variabile qualsiasi occupa il primo slot; la posizione conta, non il nome.' },
      ],
    );
    return {
      templateId: 'de-arr-skip-fg',
      type: 'fill-the-gap',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'destructuring-arrays',
      skills: ['destructuring'],
      prompt: `Completa il destructuring per ottenere il secondo elemento (${arr[1]}).`,
      code,
      ...built,
      explanation: {
        short: 'Nel destructuring di array le posizioni contano: , salta un elemento.',
        whyCorrect: `const [, secondo] = [${arr.join(', ')}] → secondo = ${arr[1]}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Saltare elementi nel destructuring',
        commonMistake: 'Dimenticare la virgola per saltare una posizione.',
        example: 'const [a, , c] = [1,2,3] // a=1, c=3',
      },
      deepDiveRef: DD,
    };
  },
};

const renameMc: QuestionTemplate = {
  id: 'de-rename-mc',
  topicId: TOPIC,
  subtopicId: 'destructuring-objects',
  type: 'multiple-choice',
  difficulty: 'hard',
  skills: ['destructuring', 'rinomina'],
  tags: ['destructuring'],
  generate(rng: Rng) {
    const v = pickInt(rng, 1, 99);
    const code = `const { a: b } = { a: ${v} };\nconsole.log(b);`;
    const built = makeOptions(
      rng,
      {
        text: `b vale ${v} e la variabile a non esiste`,
        why: `{ a: b } legge la proprietà a e la assegna alla variabile b.`,
      },
      [
        { text: `b vale ${v} e a vale ${v}`, why: 'a non viene creata: la rinomina produce solo b.' },
        { text: 'b è undefined', why: `La proprietà a esiste e vale ${v}: b la riceve.` },
        { text: 'È un errore di sintassi', why: '{ a: b } è sintassi valida di rinomina.' },
      ],
    );
    return {
      templateId: 'de-rename-mc',
      type: 'multiple-choice',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'destructuring-objects',
      skills: ['destructuring'],
      prompt: 'Cosa succede con questo codice?',
      code,
      ...built,
      explanation: {
        short: 'Nella rinomina { originale: nuovoNome }, solo nuovoNome diventa variabile.',
        whyCorrect: `b = ${v}; a non è definita.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Rinomina nel destructuring',
        commonMistake: 'Pensare che { a: b } crei entrambe le variabili.',
        example: 'const { x: y } = { x: 5 } // y = 5, x non esiste',
      },
      deepDiveRef: DD,
    };
  },
};

const defaultPo: QuestionTemplate = {
  id: 'de-default-po',
  topicId: TOPIC,
  subtopicId: 'destructuring-objects',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['destructuring', 'default'],
  tags: ['destructuring'],
  generate(rng: Rng) {
    const d = pickInt(rng, 10, 99);
    const key = pickOf(rng, ['x', 'punti', 'livello']);
    const code = `const { ${key} = ${d} } = {};\nconsole.log(${key});`;
    const built = makeOptions(
      rng,
      { text: fmt(d), why: `La proprietà ${key} manca: vale il default ${d}.` },
      [
        { text: 'undefined', why: 'Il default si applica proprio quando la proprietà manca (undefined).' },
        { text: 'null', why: 'Il default è ' + d + ', non null.' },
        { text: 'TypeError', why: 'Destrutturare {} è lecito: {} è un oggetto vuoto, non null/undefined.' },
      ],
    );
    return {
      templateId: 'de-default-po',
      type: 'predict-output',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'destructuring-objects',
      skills: ['destructuring'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `{ ${key} = ${d} } assegna ${d} perché la proprietà non c'è.`,
        whyCorrect: 'Il default scatta solo con undefined, non con altri falsy.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Valori di default nel destructuring',
        commonMistake: 'Pensare che il default scatti anche con null (non scatta).',
        example: 'const { a = 1 } = { a: null } // a = null',
      },
      deepDiveRef: DD,
    };
  },
};

export const destructuringTemplates: QuestionTemplate[] = [
  objPo,
  skipFg,
  renameMc,
  defaultPo,
];
