import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, retry, type Rng } from '../helpers.js';

const TOPIC = 'array-methods';
const DD = 'dd-array-methods';

const mapPo: QuestionTemplate = {
  id: 'am-map-po',
  topicId: TOPIC,
  subtopicId: 'array-methods-map',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['map'],
  tags: ['array', 'metodi'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 1, 9, true);
      const m = pickInt(rng, 2, 4);
      const mapped = arr.map((n) => n * m);
      const code = `const a = [${arr.join(', ')}];\nconst b = a.map((n) => n * ${m});\nconsole.log(b);`;
      const built = makeOptions(
        rng,
        { text: fmt(mapped), why: `map applica n * ${m} a ogni elemento: ${fmt(mapped)}.` },
        [
          { text: fmt(arr.map((n) => n + m)), why: `La callback moltiplica per ${m}, non somma.` },
          { text: fmt(arr), why: 'map ritorna un NUOVO array trasformato: l\'originale non cambia ma non è ciò che viene stampato.' },
          { text: fmt(mapped.join(', ')), why: 'console.log di un array usa il formato [ ... ], non una stringa.' },
        ],
      );
      return {
        templateId: 'am-map-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'array-methods-map',
        skills: ['map'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `map trasforma ogni elemento: ${fmt(mapped)}.`,
          whyCorrect: `Ogni n diventa n * ${m}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Array.prototype.map',
          commonMistake: 'Dimenticare il return nella callback (qui implicito con arrow).',
          example: '[1,2].map(n => n + 1) // [2,3]',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const filterPo: QuestionTemplate = {
  id: 'am-filter-po',
  topicId: TOPIC,
  subtopicId: 'array-methods-filter-find',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['filter'],
  tags: ['array', 'metodi'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 5, 1, 10, true);
      const t = pickInt(rng, 4, 7);
      const filtered = arr.filter((n) => n > t);
      if (filtered.length === 0 || filtered.length === arr.length) throw new Error('rigenera');
      const code = `const a = [${arr.join(', ')}];\nconsole.log(a.filter((n) => n > ${t}));`;
      const built = makeOptions(
        rng,
        { text: fmt(filtered), why: `filter tiene solo gli elementi > ${t}: ${fmt(filtered)}.` },
        [
          { text: fmt(arr.filter((n) => n >= t)), why: `La condizione è stretta (>): ${t} stesso è escluso.` },
          { text: fmt(arr.filter((n) => n < t)), why: 'Questo è il complemento: tiene i minori, non i maggiori.' },
          { text: fmt(filtered.length), why: 'filter ritorna un array, non un conteggio.' },
        ],
      );
      return {
        templateId: 'am-filter-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'array-methods-filter-find',
        skills: ['filter'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `filter(n => n > ${t}) seleziona ${fmt(filtered)}.`,
          whyCorrect: 'filter ritorna un nuovo array con gli elementi che soddisfano la condizione.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Array.prototype.filter',
          commonMistake: 'Confondere > con >= o pensare che muti l\'array.',
          example: '[1,2,3].filter(n => n > 1) // [2,3]',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const forEachFb: QuestionTemplate = {
  id: 'am-foreach-fb',
  topicId: TOPIC,
  subtopicId: 'array-methods-map',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['forEach', 'map'],
  tags: ['array', 'bug'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const m = pickInt(rng, 2, 3);
    const code = `const a = [${arr.join(', ')}];\nconst doppi = a.forEach((n) => n * ${m});\nconsole.log(doppi);`;
    const built = makeOptions(
      rng,
      {
        text: `forEach non ritorna un array (ritorna undefined): per trasformare serve map`,
        why: 'forEach esegue effetti collaterali; il valore di ritorno va ignorato.',
      },
      [
        { text: 'La arrow function è scritta male', why: 'La sintassi è corretta; il problema è il metodo scelto.' },
        { text: 'a è const e non può essere letto', why: 'const permette di leggere e chiamare metodi: vieta solo la riassegnazione.' },
        { text: 'Bisogna dichiarare doppi con let', why: 'Il tipo di dichiarazione non cambia: forEach ritorna sempre undefined.' },
      ],
    );
    return {
      templateId: 'am-foreach-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'array-methods-map',
      skills: ['forEach', 'map'],
      prompt: `Questo codice vorrebbe ottenere i doppi degli elementi, ma stampa undefined. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'forEach ritorna undefined: per produrre un nuovo array serve map.',
        whyCorrect: 'const doppi = a.map((n) => n * 2) risolve.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'forEach vs map',
        commonMistake: 'Usare forEach per trasformazioni: non produce risultato.',
        example: 'a.forEach(f) per side-effect; a.map(f) per trasformare',
      },
      deepDiveRef: DD,
    };
  },
};

const reduceFg: QuestionTemplate = {
  id: 'am-reduce-fg',
  topicId: TOPIC,
  subtopicId: 'array-methods-reduce',
  type: 'fill-the-gap',
  difficulty: 'hard',
  skills: ['reduce'],
  tags: ['array'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const sum = arr.reduce((s, n) => s + n, 0);
    const code = `const a = [${arr.join(', ')}];\nconst totale = a.reduce((s, n) => s + n, ___);\nconsole.log(totale); // ${sum}`;
    const built = makeOptions(
      rng,
      { text: '0', why: `L'accumulatore parte da 0: la somma è ${sum}.` },
      [
        { text: '1', why: `Partendo da 1 la somma sarebbe ${sum + 1}: sbagliata.` },
        { text: '[]', why: 'Partendo da un array, s + n concatenerrebbe invece di sommare.' },
        { text: 'null', why: 'null + n darebbe risultati inattesi: l\'accumulatore deve essere un numero.' },
      ],
    );
    return {
      templateId: 'am-reduce-fg',
      type: 'fill-the-gap',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'array-methods-reduce',
      skills: ['reduce'],
      prompt: `Completa il reduce affinché totale sia la somma degli elementi (${sum}).`,
      code,
      ...built,
      explanation: {
        short: 'Il secondo argomento di reduce è il valore iniziale dell\'accumulatore.',
        whyCorrect: `Con 0 la somma è ${arr.join(' + ')} = ${sum}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Valore iniziale di reduce',
        commonMistake: 'Ometterlo: su array vuoto lancia TypeError.',
        example: '[1,2,3].reduce((s,n) => s+n, 0) // 6',
      },
      deepDiveRef: DD,
    };
  },
};

export const arrayMethodsTemplates: QuestionTemplate[] = [
  mapPo,
  filterPo,
  forEachFb,
  reduceFg,
];
