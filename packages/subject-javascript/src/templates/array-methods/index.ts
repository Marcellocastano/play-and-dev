import type { QuestionTemplate } from '@lg/core';
import { defineTemplate, fmt, pickInt, pickInts } from '../helpers.js';

const TOPIC = 'array-methods';

const mapPo = defineTemplate(
  {
    id: 'am-map-po',
    topicId: TOPIC,
    subtopicId: 'array-methods-map',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['map'],
    tags: ['array', 'metodi'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 9, true);
    const m = pickInt(rng, 2, 4);
    const mapped = arr.map((n) => n * m);
    const code = `const a = [${arr.join(', ')}];\nconst b = a.map((n) => n * ${m});\nconsole.log(b);`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(mapped),
        why: `\`map\` applica la callback \`n => n * ${m}\` a ogni elemento: il risultato è ${fmt(mapped)}.`,
      },
      distractors: [
        {
          text: fmt(arr.map((n) => n + m)),
          why: `La callback moltiplica per ${m}, non somma: questo sarebbe il risultato di \`n => n + ${m}\`.`,
        },
        {
          text: fmt(arr),
          why: `Questo è l'array di partenza: \`map\` produce un nuovo array trasformato (${fmt(mapped)}) e il log stampa quello, non l'originale.`,
        },
        {
          text: fmt(mapped.join(', ')),
          why: 'Il log riceve un array e lo stampa nel formato `[ ... ]`, non come stringa di valori separati da virgola.',
        },
      ],
      short: `map trasforma ogni elemento: ${fmt(mapped)}.`,
      whyCorrect: `Ogni n diventa n * ${m}.`,
      concept: 'Array.prototype.map',
      commonMistake: 'Dimenticare il return nella callback (qui implicito con arrow).',
      example: '[1,2].map(n => n + 1) // [2,3]',
    };
  },
);

const filterPo = defineTemplate(
  {
    id: 'am-filter-po',
    topicId: TOPIC,
    subtopicId: 'array-methods-filter-find',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['filter'],
    tags: ['array', 'metodi'],
  },
  (rng) => {
    const arr = pickInts(rng, 5, 1, 10, true);
    const t = pickInt(rng, 4, 7);
    const filtered = arr.filter((n) => n > t);
    if (filtered.length === 0 || filtered.length === arr.length) throw new Error('rigenera');
    const code = `const a = [${arr.join(', ')}];\nconsole.log(a.filter((n) => n > ${t}));`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(filtered),
        why: `\`filter\` mantiene solo gli elementi per cui \`n > ${t}\` è vera: il risultato è ${fmt(filtered)}.`,
      },
      distractors: [
        {
          text: fmt(arr.filter((n) => n >= t)),
          why: `Con \`>\` il valore ${t} stesso è escluso: questo risultato corrisponderebbe a \`n >= ${t}\`, che lo includerebbe.`,
        },
        {
          text: fmt(arr),
          why: `Questo è l'array completo senza filtro: \`filter\` scarta gli elementi che non superano ${t} e restituisce ${fmt(filtered)}.`,
        },
        {
          text: fmt(arr.filter((n) => n < t)),
          why: `La condizione è invertita: questo terrebbe gli elementi minori di ${t}, mentre il codice chiede i maggiori.`,
        },
        {
          text: fmt([...filtered].reverse()),
          why: `\`filter\` preserva l'ordine originale degli elementi selezionati: non li riordina né li inverte.`,
        },
      ],
      short: `filter(n => n > ${t}) seleziona ${fmt(filtered)}.`,
      whyCorrect: 'filter ritorna un nuovo array con gli elementi che soddisfano la condizione.',
      concept: 'Array.prototype.filter',
      commonMistake: "Confondere > con >= o pensare che muti l'array.",
      example: '[1,2,3].filter(n => n > 1) // [2,3]',
    };
  },
);

const forEachFb = defineTemplate(
  {
    id: 'am-foreach-fb',
    topicId: TOPIC,
    subtopicId: 'array-methods-map',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['forEach', 'map'],
    tags: ['array', 'bug'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 9, true);
    const m = pickInt(rng, 2, 3);
    const code = `const a = [${arr.join(', ')}];\nconst doppi = a.forEach((n) => n * ${m});\nconsole.log(doppi);`;
    return {
      prompt: `Questo codice vorrebbe ottenere i doppi degli elementi, ma stampa undefined. Qual è il bug?`,
      code: code,
      correct: {
        text: '`forEach` ritorna `undefined`',
        why: `\`forEach\` esegue la callback per effetti collaterali e restituisce sempre undefined: per produrre i doppi serviva \`a.map((n) => n * ${m})\`.`,
      },
      distractors: [
        {
          text: 'Manca `return` nella arrow',
          why: 'Anche con un `return` esplicito, `forEach` ignorerebbe il valore restituito dalla callback: il bug è il metodo scelto, non la callback.',
        },
        {
          text: 'Serve `let` per `doppi`',
          why: 'Il tipo di dichiarazione non cambia il risultato: `doppi` riceve il valore di ritorno di `forEach`, che è sempre undefined.',
        },
        {
          text: '`forEach` vuole due parametri',
          why: 'Il secondo parametro della callback (l’indice) è opzionale: la firma è corretta, il problema è il valore di ritorno di `forEach`.',
        },
      ],
      short: 'forEach ritorna undefined: per produrre un nuovo array serve map.',
      whyCorrect: 'const doppi = a.map((n) => n * 2) risolve.',
      concept: 'forEach vs map',
      commonMistake: 'Usare forEach per trasformazioni: non produce risultato.',
      example: 'a.forEach(f) per side-effect; a.map(f) per trasformare',
    };
  },
);

const reduceFg = defineTemplate(
  {
    id: 'am-reduce-fg',
    topicId: TOPIC,
    subtopicId: 'array-methods-reduce',
    type: 'fill-the-gap',
    difficulty: 'hard',
    skills: ['reduce'],
    tags: ['array'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 9, true);
    const sum = arr.reduce((s, n) => s + n, 0);
    const code = `const a = [${arr.join(', ')}];\nconst totale = a.reduce((s, n) => s + n, ___);\nconsole.log(totale); // ${sum}`;
    return {
      prompt: `Completa il reduce affinché totale sia la somma degli elementi (${sum}).`,
      code: code,
      correct: {
        text: '0',
        why: `Il secondo argomento di \`reduce\` è il valore iniziale dell'accumulatore: partendo da 0 la somma è ${sum}.`,
      },
      distractors: [
        {
          text: '1',
          why: `Partendo da 1 il totale includerebbe un +1 iniziale e darebbe ${sum + 1} invece di ${sum}.`,
        },
        {
          text: '[]',
          why: 'Con un array come valore iniziale, `s + n` concatenerebbe invece di sommare: per una somma l’accumulatore deve essere un numero.',
        },
        {
          text: 'null',
          why: `Con \`null\` come inizio la prima somma sarebbe \`null + ${arr[0]}\`, che produce un risultato numerico inatteso: l'accumulatore deve essere 0.`,
        },
      ],
      short: "Il secondo argomento di reduce è il valore iniziale dell'accumulatore.",
      whyCorrect: `Con 0 la somma è ${arr.join(' + ')} = ${sum}.`,
      concept: 'Valore iniziale di reduce',
      commonMistake: 'Ometterlo: su array vuoto lancia TypeError.',
      example: '[1,2,3].reduce((s,n) => s+n, 0) // 6',
    };
  },
);

export const arrayMethodsTemplates: QuestionTemplate[] = [mapPo, filterPo, forEachFb, reduceFg];
