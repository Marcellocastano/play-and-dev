import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, pickOf, retry, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'loops';
const DD = 'dd-loops';

const forCountPo: QuestionTemplate = {
  id: 'loop-for-po',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['for'],
  tags: ['cicli'],
  generate(rng: Rng) {
    return retry(() => {
      const start = pickInt(rng, 0, 2);
      const n = pickInt(rng, 3, 6);
      const lines = Array.from({ length: n - start }, (_, i) => i + start).join('\n');
      const code = `for (let i = ${start}; i < ${n}; i++) {\n  console.log(i);\n}`;
      const built = makeOptions(
        rng,
        { text: lines, why: `i va da ${start} a ${n - 1}.` },
        [
          { text: Array.from({ length: n - start }, (_, i) => i + start + 1).join('\n'), why: `Il contatore parte da ${start}: questa sequenza è spostata di 1.` },
          { text: Array.from({ length: n - start + 1 }, (_, i) => i + start).join('\n'), why: `La condizione i < ${n} esclude ${n}.` },
          { text: fmt(n - start), why: 'Il corpo stampa i ad ogni iterazione, non solo il conteggio.' },
        ],
      );
      return {
        templateId: 'loop-for-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for',
        skills: ['for'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Il ciclo stampa i per i = ${start}…${n - 1}.`,
          whyCorrect: `i < ${n} ferma il ciclo prima di ${n}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Ciclo for con contatore',
          commonMistake: 'Includere il limite superiore o partire dal valore sbagliato (off-by-one).',
          example: 'for (let i = 0; i < 3; i++) stampa 0, 1, 2',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const sumPo: QuestionTemplate = {
  id: 'loop-sum-po',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['for', 'accumulo'],
  tags: ['cicli', 'array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 1, 9, true);
      const sum = arr.reduce((s, x) => s + x, 0);
      const code = `const valori = [${arr.join(', ')}];\nlet somma = 0;\nfor (let i = 0; i < valori.length; i++) {\n  somma += valori[i];\n}\nconsole.log(somma);`;
      const built = makeOptions(
        rng,
        { text: fmt(sum), why: `La somma ${arr.join(' + ')} vale ${sum}.` },
        [
          { text: fmt(sum - arr[arr.length - 1]!), why: 'Manca l\'ultimo elemento: il ciclo arriva a length - 1 incluso.' },
          { text: fmt(arr.length), why: 'somma accumula i valori, non il conteggio.' },
          { text: fmt(arr[0]!), why: 'somma parte da 0 e accumula tutto, non solo il primo elemento.' },
        ],
      );
      return {
        templateId: 'loop-sum-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for',
        skills: ['for'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Il ciclo accumula gli elementi: ${sum}.`,
          whyCorrect: 'somma += valori[i] per ogni indice valido.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Pattern accumulatore con for',
          commonMistake: 'Fermarsi un\'iterazione prima (i < length - 1).',
          example: 'Idioma equivalente: valori.reduce((s, x) => s + x, 0)',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const forOfPo: QuestionTemplate = {
  id: 'loop-forof-po',
  topicId: TOPIC,
  subtopicId: 'loops-for-of',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['for...of'],
  tags: ['cicli', 'array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 10, 60, true);
      const lines = arr.join('\n');
      const code = `const lista = [${arr.join(', ')}];\nfor (const v of lista) {\n  console.log(v);\n}`;
      const built = makeOptions(
        rng,
        { text: lines, why: 'for...of scorre i valori uno a uno, nell\'ordine.' },
        [
          { text: '0\n1\n2', why: 'for...of itera sui valori, non sugli indici.' },
          { text: fmt(arr), why: 'Ogni console.log stampa un valore per riga, non l\'array intero.' },
          { text: arr.slice().reverse().join('\n'), why: 'for...of va in avanti, dal primo all\'ultimo.' },
        ],
      );
      return {
        templateId: 'loop-forof-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for-of',
        skills: ['for...of'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: 'for...of stampa ogni valore dell\'array su una riga.',
          whyCorrect: `v assume ${arr.join(', ')} in sequenza.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'for...of sugli array',
          commonMistake: 'Confondere for...of (valori) con for...in (chiavi/indici).',
          example: 'for (const c of "abc") stampa a, b, c',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const offByFb: QuestionTemplate = {
  id: 'loop-offby-fb',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['for', 'indici'],
  tags: ['cicli', 'bug'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const code = `const a = [${arr.join(', ')}];\nfor (let i = 0; i <= a.length; i++) {\n  console.log(a[i]);\n}`;
    const built = makeOptions(
      rng,
      {
        text: 'i <= a.length scorre un indice di troppo: a[3] è undefined. Serve i < a.length',
        why: `L'ultimo indice valido è ${arr.length - 1}; con <= si accede a a[${arr.length}].`,
      },
      [
        { text: 'console.log non funziona dentro un for', why: 'Funziona benissimo: il problema è la condizione del ciclo.' },
        { text: 'Il ciclo non parte perché i = 0', why: 'Partire da 0 è corretto: gli indici vanno da 0.' },
        { text: 'a.length non esiste', why: 'length esiste: è il confronto con <= a essere sbagliato.' },
      ],
    );
    return {
      templateId: 'loop-offby-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'loops-for',
      skills: ['for'],
      prompt: 'Questo codice stampa gli elementi ma produce una riga "undefined" in più. Qual è il bug?',
      code,
      ...built,
      explanation: {
        short: `Con <= si arriva a i = ${arr.length}, fuori dagli indici validi 0…${arr.length - 1}.`,
        whyCorrect: 'La condizione corretta è i < a.length.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Off-by-one nei cicli su array',
        commonMistake: 'Usare <= length invece di < length.',
        example: 'Ultimo indice = arr.length - 1',
      },
      deepDiveRef: DD,
    };
  },
};

const whileFg: QuestionTemplate = {
  id: 'loop-while-fg',
  topicId: TOPIC,
  subtopicId: 'loops-while',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['while'],
  tags: ['cicli'],
  generate(rng: Rng) {
    const start = pickInt(rng, 0, 2);
    const n = pickInt(rng, 3, 7);
    const expected = Array.from({ length: n - start }, (_, i) => i + start).join(', ');
    const code = `let i = ${start};\nwhile (i ___ ${n}) {\n  console.log(i);\n  i++;\n}`;
    const built = makeOptions(
      rng,
      { text: '<', why: `i < ${n} esegue il corpo per i = ${start}…${n - 1}.` },
      [
        { text: '<=', why: `i <= ${n} includerebbe anche i = ${n}: una riga in più.` },
        { text: '>', why: `i > ${n} è falso subito: il ciclo non partirebbe.` },
        { text: '==', why: `i == ${n} è falso all'inizio (i = ${start}): il ciclo non partirebbe.` },
      ],
    );
    return {
      templateId: 'loop-while-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'loops-while',
      skills: ['while'],
      prompt: `Completa affinché il codice stampi ${expected}.`,
      code,
      ...built,
      explanation: {
        short: `while (i < ${n}) ripete finché i è minore di ${n}.`,
        whyCorrect: 'Con < si stampano 0…n-1.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Condizione del while',
        commonMistake: 'Usare <= e stampare un valore in più.',
        example: 'while (i < 3) con i++ stampa 0, 1, 2',
      },
      deepDiveRef: DD,
    };
  },
};

const forOfCmp: QuestionTemplate = {
  id: 'loop-forof-cmp',
  topicId: TOPIC,
  subtopicId: 'loops-for-of',
  type: 'compare',
  difficulty: 'medium',
  skills: ['for...of', 'for'],
  tags: ['cicli'],
  generate(rng: Rng) {
    const trueStatements = [
      { text: 'for...of è più leggibile quando servono solo i valori', why: 'Elimina il boilerplate del contatore.' },
      { text: 'Il for classico serve quando ti serve l\'indice', why: 'for...of non espone la posizione.' },
      { text: 'for...of itera sui valori dell\'array', why: 'È la sua definizione: valori, non chiavi.' },
      { text: 'Con for...of non rischi l\'off-by-one sugli indici', why: 'Non ci sono indici da sbagliare.' },
    ];
    const falseStatements = [
      { text: 'for...of è sempre più veloce e va usato sempre', why: 'Senza indice non puoi conoscere la posizione: non sempre basta.' },
      { text: 'for...of scorre le chiavi, il for i valori', why: 'È il contrario: for...of scorre i valori; for...in le chiavi.' },
      { text: 'for...of e for classico sono identici', why: 'for...of non espone l\'indice: non sono intercambiabili.' },
      { text: 'for...of non funziona sugli array', why: 'Gli array sono iterabili: for...of è fatto apposta.' },
    ];
    const built = makeOptions(
      rng,
      pickOf(rng, trueStatements),
      shuffle(falseStatements, rng).slice(0, 3),
    );
    return {
      templateId: 'loop-forof-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'loops-for-of',
      skills: ['for...of'],
      prompt: 'Quale affermazione su for...of è corretta?',
      ...built,
      explanation: {
        short: 'for...of per i valori; for classico quando serve l\'indice o il controllo del passo.',
        whyCorrect: 'Il for classico permette i, i += 2, cicli all\'indietro ecc.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'for vs for...of',
        commonMistake: 'Usare for...of e poi cercare l\'indice con indexOf.',
        example: 'for (const v of arr) vs for (let i = 0; i < arr.length; i++)',
      },
      deepDiveRef: DD,
    };
  },
};

export const loopsTemplates: QuestionTemplate[] = [
  forCountPo,
  sumPo,
  forOfPo,
  offByFb,
  whileFg,
  forOfCmp,
];
