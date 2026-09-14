import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, retry, type Rng } from '../helpers.js';

const TOPIC = 'arrays-basics';
const DD = 'dd-arrays-basics';

const pushLenPo: QuestionTemplate = {
  id: 'arr-push-po',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['push', 'length'],
  tags: ['array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 1, 30, true);
      const v = pickInt(rng, 31, 60);
      const code = `const lista = [${arr.join(', ')}];\nlista.push(${v});\nconsole.log(lista.length);`;
      const built = makeOptions(
        rng,
        { text: fmt(arr.length + 1), why: `push aggiunge un elemento: ${arr.length} + 1 = ${arr.length + 1}.` },
        [
          { text: fmt(arr.length), why: 'push modifica l\'array: la lunghezza aumenta di 1.' },
          { text: fmt(v), why: 'length restituisce il numero di elementi, non l\'ultimo valore.' },
          { text: fmt(arr.length + 2), why: 'push aggiunge un solo elemento.' },
        ],
      );
      return {
        templateId: 'arr-push-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'arrays-mutators',
        skills: ['push'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Dopo push l'array ha ${arr.length + 1} elementi.`,
          whyCorrect: 'push accoda un elemento e length cresce di conseguenza.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'push e length',
          commonMistake: 'Pensare che push ritorni il nuovo array (ritorna la nuova length).',
          example: 'const a = [1,2]; a.push(3); // a = [1,2,3], push ritorna 3',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const indexPo: QuestionTemplate = {
  id: 'arr-index-po',
  topicId: TOPIC,
  subtopicId: 'arrays-access',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['indici'],
  tags: ['array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 4, 10, 99, true);
      const i = pickInt(rng, 0, arr.length - 1);
      const code = `const a = [${arr.join(', ')}];\nconsole.log(a[${i}]);`;
      const built = makeOptions(
        rng,
        { text: fmt(arr[i]), why: `a[${i}] è l'elemento in posizione ${i} (partendo da 0): ${arr[i]}.` },
        [
          { text: fmt(arr[i + 1] ?? arr[i]! + 1), why: `Questo sarebbe a[${i + 1}]: gli indici partono da 0.` },
          { text: fmt(i), why: 'a[i] è il valore in posizione i, non l\'indice stesso.' },
          { text: 'undefined', why: `${i} è un indice valido: l'array ha ${arr.length} elementi.` },
        ],
      );
      return {
        templateId: 'arr-index-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'arrays-access',
        skills: ['indici'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `a[${i}] vale ${arr[i]}: gli indici partono da 0.`,
          whyCorrect: `In [${arr.join(', ')}] la posizione ${i} contiene ${arr[i]}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Accesso per indice (base 0)',
          commonMistake: 'Contare da 1 invece che da 0.',
          example: 'a[0] è il primo elemento; a[a.length - 1] l\'ultimo.',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const offByFb: QuestionTemplate = {
  id: 'arr-offby-fb',
  topicId: TOPIC,
  subtopicId: 'arrays-access',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['indici', 'length'],
  tags: ['array', 'bug'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const last = arr[arr.length - 1]!;
    const code = `const a = [${arr.join(', ')}];\nconsole.log(a[a.length]);`;
    const built = makeOptions(
      rng,
      {
        text: `a.length vale ${arr.length} ma l'ultimo indice valido è ${arr.length - 1}: serve a[a.length - 1]`,
        why: `a[${arr.length}] non esiste → undefined; l'ultimo elemento è ${last} a indice ${arr.length - 1}.`,
      },
      [
        { text: 'Gli array partono da 1', why: 'In JavaScript gli indici partono da 0.' },
        { text: 'console.log non può leggere gli array', why: 'Può: il problema è l\'indice fuori range.' },
        { text: 'Manca un metodo last()', why: 'Basta l\'indice corretto: a[a.length - 1].' },
      ],
    );
    return {
      templateId: 'arr-offby-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-access',
      skills: ['indici'],
      prompt: `Questo codice dovrebbe stampare l'ultimo elemento (${last}) ma stampa undefined. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'Off-by-one: l\'ultimo indice è length - 1.',
        whyCorrect: `a[a.length - 1] = a[${arr.length - 1}] = ${last}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Indici validi di un array',
        commonMistake: 'Confondere il conteggio (length) con l\'ultimo indice.',
        example: 'a[arr.length] // sempre undefined',
      },
      deepDiveRef: DD,
    };
  },
};

const popMc: QuestionTemplate = {
  id: 'arr-pop-mc',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['pop'],
  tags: ['array'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 10, 60, true);
    const last = arr[arr.length - 1]!;
    const built = makeOptions(
      rng,
      {
        text: `Restituisce l'ultimo elemento (${last}) e lo rimuove dall'array`,
        why: 'pop toglie l\'elemento in coda e lo ritorna.',
      },
      [
        { text: `Restituisce il primo elemento (${arr[0]})`, why: 'Quello è shift(), non pop().' },
        { text: `Restituisce la nuova lunghezza (${arr.length - 1})`, why: 'È push() a restituire la nuova lunghezza.' },
        { text: 'Restituisce l\'intero array senza l\'ultimo elemento', why: 'pop ritorna l\'elemento rimosso, non l\'array.' },
      ],
    );
    return {
      templateId: 'arr-pop-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-mutators',
      skills: ['pop'],
      prompt: `Dato \`const a = [${arr.join(', ')}]\`, cosa fa \`a.pop()\`?`,
      ...built,
      explanation: {
        short: `pop() rimuove ${last} dalla coda e lo restituisce.`,
        whyCorrect: `Dopo pop, a vale [${arr.slice(0, -1).join(', ')}] e il valore ritornato è ${last}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'pop vs push/shift',
        commonMistake: 'Confondere pop (coda) con shift (testa).',
        example: '[1,2,3].pop() // 3; l\'array diventa [1,2]',
      },
      deepDiveRef: DD,
    };
  },
};

const includesBm: QuestionTemplate = {
  id: 'arr-includes-bm',
  topicId: TOPIC,
  subtopicId: 'arrays-search',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['includes'],
  tags: ['array', 'best-practice'],
  generate(rng: Rng) {
    const v = pickInt(rng, 1, 9);
    const built = makeOptions(
      rng,
      { text: `lista.includes(${v})`, why: 'includes() ritorna true/false: il modo più diretto.' },
      [
        { text: `lista.indexOf(${v})`, why: 'indexOf ritorna la posizione o -1: funziona ma va confrontato con >= 0 o !== -1.' },
        { text: `lista.contains(${v})`, why: 'contains() non esiste negli array JavaScript.' },
        { text: `lista.find(${v})`, why: 'find riceve una funzione, non un valore: lista.find(v) darebbe errore.' },
      ],
    );
    return {
      templateId: 'arr-includes-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-search',
      skills: ['includes'],
      prompt: `Vuoi sapere se un array contiene il valore ${v}. Qual è il modo migliore?`,
      ...built,
      explanation: {
        short: 'includes() ritorna un booleano direttamente.',
        whyCorrect: 'indexOf va bene per la posizione; per la sola presenza includes è più chiaro.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'includes vs indexOf',
        commonMistake: 'Usare indexOf senza confrontare il risultato con -1.',
        example: '[1,2,3].includes(2) // true',
      },
      deepDiveRef: DD,
    };
  },
};

const pushFg: QuestionTemplate = {
  id: 'arr-push-fg',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['push'],
  tags: ['array'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const v = pickInt(rng, 10, 99);
    const code = `const numeri = [${arr.join(', ')}];\nnumeri.___(${v});`;
    const built = makeOptions(
      rng,
      { text: 'push', why: `push(${v}) aggiunge ${v} in coda a numeri.` },
      [
        { text: 'pop', why: 'pop rimuove l\'ultimo elemento, non aggiunge.' },
        { text: 'shift', why: 'shift rimuove il primo elemento, non aggiunge.' },
        { text: 'append', why: 'append() non esiste sugli array JavaScript (è di Python).' },
      ],
    );
    return {
      templateId: 'arr-push-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-mutators',
      skills: ['push'],
      prompt: `Completa per aggiungere ${v} in fondo all'array.`,
      code,
      ...built,
      explanation: {
        short: 'push aggiunge in coda (unshift in testa).',
        whyCorrect: `numeri.push(${v}) → [${[...arr, v].join(', ')}].`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Metodi di coda/testa degli array',
        commonMistake: 'Importare append() da altri linguaggi.',
        example: 'a.push(x) in coda; a.unshift(x) in testa',
      },
      deepDiveRef: DD,
    };
  },
};

export const arraysBasicsTemplates: QuestionTemplate[] = [
  pushLenPo,
  indexPo,
  offByFb,
  popMc,
  includesBm,
  pushFg,
];
