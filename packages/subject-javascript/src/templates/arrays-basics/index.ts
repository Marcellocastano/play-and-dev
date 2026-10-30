import type { QuestionTemplate } from '@lg/core';
import { defineCategorize, defineTemplate, fmt, pickInt, pickInts, shuffle } from '../helpers.js';

const TOPIC = 'arrays-basics';

const pushLenPo = defineTemplate(
  {
    id: 'arr-push-po',
    topicId: TOPIC,
    subtopicId: 'arrays-mutators',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['push', 'length'],
    tags: ['array'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 30, true);
    const v = pickInt(rng, 31, 60);
    const code = `const lista = [${arr.join(', ')}];\nlista.push(${v});\nconsole.log(lista.length);`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(arr.length + 1),
        why: `\`push(${v})\` aggiunge un elemento in coda: la lunghezza passa da ${arr.length} a ${arr.length + 1}.`,
      },
      distractors: [
        {
          text: fmt(arr.length),
          why: `\`push\` modifica l'array sul posto: dopo la chiamata gli elementi sono ${arr.length + 1}, non più ${arr.length}.`,
        },
        {
          text: fmt(v),
          why: `\`length\` restituisce il numero di elementi dell'array, non il valore appena inserito: ${v} è l'elemento aggiunto.`,
        },
        {
          text: fmt(arr.length + 2),
          why: `\`push(${v})\` aggiunge un solo elemento: la lunghezza cresce di 1, da ${arr.length} a ${arr.length + 1}.`,
        },
      ],
      short: `Dopo push l'array ha ${arr.length + 1} elementi.`,
      whyCorrect: 'push accoda un elemento e length cresce di conseguenza.',
      concept: 'push e length',
      commonMistake: 'Pensare che push ritorni il nuovo array (ritorna la nuova length).',
      example: 'const a = [1,2]; a.push(3); // a = [1,2,3], push ritorna 3',
    };
  },
);

const indexPo = defineTemplate(
  {
    id: 'arr-index-po',
    topicId: TOPIC,
    subtopicId: 'arrays-access',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['indici'],
    tags: ['array'],
  },
  (rng) => {
    const arr = pickInts(rng, 4, 10, 99, true);
    const i = pickInt(rng, 0, arr.length - 1);
    const code = `const a = [${arr.join(', ')}];\nconsole.log(a[${i}]);`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(arr[i]),
        why: `Gli indici partono da 0: \`a[${i}]\` legge l'elemento in posizione ${i}, che in [${arr.join(', ')}] vale ${arr[i]}.`,
      },
      distractors: [
        {
          text: fmt(arr[i + 1] ?? arr[i]! + 1),
          why: `Questo sarebbe il valore di \`a[${i + 1}]\`: con indici in base 0, la posizione ${i} contiene ${arr[i]}.`,
        },
        {
          text: fmt(i),
          why: `\`a[${i}]\` restituisce il valore contenuto in posizione ${i}, non l'indice stesso: il log stampa ${arr[i]}.`,
        },
        {
          text: 'undefined',
          why: `${i} è un indice valido perché l'array ha ${arr.length} elementi (indici 0…${arr.length - 1}): il log stampa ${arr[i]}.`,
        },
      ],
      short: `a[${i}] vale ${arr[i]}: gli indici partono da 0.`,
      whyCorrect: `In [${arr.join(', ')}] la posizione ${i} contiene ${arr[i]}.`,
      concept: 'Accesso per indice (base 0)',
      commonMistake: 'Contare da 1 invece che da 0.',
      example: "a[0] è il primo elemento; a[a.length - 1] l'ultimo.",
    };
  },
);

const offByFb = defineTemplate(
  {
    id: 'arr-offby-fb',
    topicId: TOPIC,
    subtopicId: 'arrays-access',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['indici', 'length'],
    tags: ['array', 'bug'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 9, true);
    const last = arr[arr.length - 1]!;
    const code = `const a = [${arr.join(', ')}];\nconsole.log(a[a.length]);`;
    return {
      prompt: `Questo codice dovrebbe stampare l'ultimo elemento (${last}) ma stampa undefined. Qual è il bug?`,
      code: code,
      correct: {
        text: "L'ultimo indice è `length - 1`",
        why: `\`a[${arr.length}]\` non esiste perché gli indici validi sono 0…${arr.length - 1}: per stampare ${last} serviva \`a[a.length - 1]\`.`,
      },
      distractors: [
        {
          text: 'Manca un metodo `last()`',
          why: `Gli array JavaScript non hanno un metodo \`last()\`: l'ultimo elemento si legge con \`a[a.length - 1]\`.`,
        },
        {
          text: 'Gli indici partono da 1',
          why: `In JavaScript gli indici partono da 0: con partenza a 1 l'ultimo elemento sarebbe a indice ${arr.length}, ma in realtà è \`a[${arr.length - 1}]\`.`,
        },
        {
          text: `\`a.length\` vale ${arr.length - 1}, non ${arr.length}`,
          why: `\`length\` conta gli elementi e vale ${arr.length}; sono gli indici ad arrivare a ${arr.length - 1}, quindi \`a[a.length]\` è fuori range.`,
        },
      ],
      short: "Off-by-one: l'ultimo indice è length - 1.",
      whyCorrect: `a[a.length - 1] = a[${arr.length - 1}] = ${last}.`,
      concept: 'Indici validi di un array',
      commonMistake: "Confondere il conteggio (length) con l'ultimo indice.",
      example: 'a[arr.length] // sempre undefined',
    };
  },
);

const popMc = defineTemplate(
  {
    id: 'arr-pop-mc',
    topicId: TOPIC,
    subtopicId: 'arrays-mutators',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['pop'],
    tags: ['array'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 10, 60, true);
    const last = arr[arr.length - 1]!;
    const rest = arr.slice(0, -1);
    const code = `const a = [${arr.join(', ')}];\na.pop();\nconsole.log(a);`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(rest),
        why: `\`pop()\` rimuove l'ultimo elemento ${last} e modifica l'array: resta ${fmt(rest)}.`,
      },
      distractors: [
        {
          text: fmt(arr),
          why: `\`pop()\` modifica l'array sul posto: dopo la chiamata ${last} non c'è più e l'array è ${fmt(rest)}.`,
        },
        {
          text: fmt(arr.slice(1)),
          why: `Questo risultato corrisponderebbe a \`shift()\`, che rimuove il primo elemento: \`pop()\` toglie dalla coda, non dalla testa.`,
        },
        {
          text: fmt([last]),
          why: `${last} è il valore che \`pop()\` restituisce, non lo stato finale: il log stampa l'array modificato, ${fmt(rest)}.`,
        },
      ],
      short: `pop() rimuove ${last}: a diventa ${fmt(rest)}.`,
      whyCorrect: "pop toglie l'elemento in coda e lo ritorna; qui si stampa l'array modificato.",
      concept: 'pop vs push/shift',
      commonMistake: 'Confondere pop (coda) con shift (testa).',
      example: "[1,2,3].pop() // 3; l'array diventa [1,2]",
    };
  },
);

const includesBm = defineTemplate(
  {
    id: 'arr-includes-bm',
    topicId: TOPIC,
    subtopicId: 'arrays-search',
    type: 'best-method',
    difficulty: 'easy',
    skills: ['includes'],
    tags: ['array', 'best-practice'],
  },
  (rng) => {
    const v = pickInt(rng, 1, 9);
    return {
      prompt: `Ti serve un booleano pronto per un \`if\`: l'array contiene ${v}? Qual è il modo più diretto?`,
      correct: {
        text: `lista.includes(${v})`,
        why: `\`includes(${v})\` restituisce direttamente true o false: è il booleano pronto per l'\`if\` richiesto dallo scenario.`,
      },
      distractors: [
        {
          text: `lista.indexOf(${v})`,
          why: `\`indexOf(${v})\` restituisce la posizione dell'elemento o -1: è un numero, non un booleano, e andrebbe confrontato con \`!== -1\`.`,
        },
        {
          text: `lista.contains(${v})`,
          why: 'Gli array JavaScript non hanno un metodo `contains` (esiste in Java e C#): la chiamata lancerebbe un TypeError.',
        },
        {
          text: `lista.find(${v})`,
          why: `\`find\` si aspetta una funzione predicato, non il valore ${v}: passato un numero cercherebbe gli elementi "truthy" della funzione e darebbe un esito diverso.`,
        },
      ],
      short: 'includes() ritorna un booleano direttamente.',
      whyCorrect: 'indexOf va bene per la posizione; per la sola presenza includes è più chiaro.',
      concept: 'includes vs indexOf',
      commonMistake: 'Usare indexOf senza confrontare il risultato con -1.',
      example: '[1,2,3].includes(2) // true',
    };
  },
);

const pushFg = defineTemplate(
  {
    id: 'arr-push-fg',
    topicId: TOPIC,
    subtopicId: 'arrays-mutators',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['push'],
    tags: ['array'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 9, true);
    const v = pickInt(rng, 10, 99);
    const code = `const numeri = [${arr.join(', ')}];\nnumeri.___(${v});`;
    return {
      prompt: `Completa per aggiungere ${v} in fondo all'array.`,
      code: code,
      correct: {
        text: 'push',
        why: `\`numeri.push(${v})\` accoda ${v} in fondo all'array, ottenendo [${[...arr, v].join(', ')}].`,
      },
      distractors: [
        {
          text: 'pop',
          why: `\`pop\` fa l'operazione opposta: rimuove e restituisce l'ultimo elemento (${arr[arr.length - 1]}) invece di aggiungere ${v}.`,
        },
        {
          text: 'shift',
          why: `\`shift\` rimuove il primo elemento (${arr[0]}) invece di aggiungerne uno in coda.`,
        },
        {
          text: 'append',
          why: 'In JavaScript gli array non hanno `append` (è il metodo delle liste Python): la chiamata lancerebbe un TypeError.',
        },
      ],
      short: 'push aggiunge in coda (unshift in testa).',
      whyCorrect: `numeri.push(${v}) → [${[...arr, v].join(', ')}].`,
      concept: 'Metodi di coda/testa degli array',
      commonMistake: 'Importare append() da altri linguaggi.',
      example: 'a.push(x) in coda; a.unshift(x) in testa',
    };
  },
);

const MUTATING_METHODS = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill'];
const NON_MUTATING_METHODS = [
  'map',
  'filter',
  'slice',
  'concat',
  'flat',
  'includes',
  'indexOf',
  'join',
];

const METHOD_WHY: Record<string, string> = {
  push: "push aggiunge elementi in coda all'array esistente e restituisce solo la nuova lunghezza: l'originale risulta modificato.",
  pop: "pop rimuove e restituisce l'ultimo elemento dell'array stesso: dopo la chiamata l'originale ha un elemento in meno.",
  shift:
    "shift toglie il primo elemento dall'array originale e lo restituisce: gli indici di tutti gli altri elementi si spostano.",
  unshift:
    "unshift inserisce elementi in testa all'array esistente e restituisce la nuova lunghezza: l'originale cresce sul posto.",
  splice:
    "splice rimuove o inserisce elementi direttamente nell'array su cui è chiamato: è il metodo più invasivo tra quelli mutanti.",
  sort: "sort ordina gli elementi sul posto e restituisce lo stesso array: dopo la chiamata l'originale risulta già riordinato.",
  reverse:
    "reverse rovescia l'ordine degli elementi dell'array stesso: non crea una copia, l'originale risulta invertito.",
  fill: "fill sovrascrive gli elementi dell'array con un valore fisso: ogni cella dell'originale viene riscritta sul posto.",
  map: "map produce un array nuovo con i risultati della funzione su ogni elemento: l'array di partenza resta identico.",
  filter:
    "filter costruisce un array nuovo con i soli elementi che superano il test: l'originale non viene toccato.",
  slice:
    "slice copia una porzione in un array nuovo: l'originale conserva tutti i suoi elementi invariati.",
  concat:
    'concat unisce array e valori in un array nuovo di zecca: gli operandi restano esattamente come prima.',
  flat: 'flat appiattisce i livelli annidati in un array nuovo: la struttura originale con i sotto-array resta immutata.',
  includes:
    'includes restituisce un booleano, non un array: è un metodo di lettura e non modifica nulla.',
  indexOf:
    "indexOf restituisce un indice numerico o -1: interroga l'array senza mai scriverci sopra.",
  join: "join produce una stringa con gli elementi separati da un delimitatore: l'array originale non cambia.",
};

const mutatorsCg = defineCategorize(
  {
    id: 'arr-mutators-cg',
    topicId: TOPIC,
    subtopicId: 'arrays-mutators',
    type: 'categorize',
    difficulty: 'medium',
    skills: ['array', 'metodi', 'mutazione'],
    tags: ['array'],
  },
  (rng) => {
    const mutating = shuffle(MUTATING_METHODS, rng).slice(0, 3);
    const pure = shuffle(NON_MUTATING_METHODS, rng).slice(0, 3);
    return {
      prompt: "Per ogni metodo, decidi se modifica l'array su cui è chiamato.",
      categories: [
        { id: 'muta', text: "Modifica l'array originale" },
        { id: 'puro', text: 'Restituisce un nuovo valore senza modificarlo' },
      ],
      items: [
        ...mutating.map((m) => ({
          text: `\`${m}()\``,
          categoryId: 'muta',
          why: METHOD_WHY[m]!,
        })),
        ...pure.map((m) => ({
          text: `\`${m}()\``,
          categoryId: 'puro',
          why: METHOD_WHY[m]!,
        })),
      ],
      short: "Alcuni metodi degli array scrivono sull'originale, altri producono un valore nuovo.",
      whyCorrect:
        "I metodi mutanti operano sul posto e l'array cambia subito; gli altri restituiscono un nuovo array o un valore, lasciando l'originale intatto.",
      concept: 'Metodi mutanti e non mutanti degli array',
      commonMistake: "Credere che sort o reverse restituiscano una copia: riordinano l'originale.",
      example: 'const a = [3, 1]; a.sort(); // a ora è [1, 3]',
    };
  },
);

export const arraysBasicsTemplates: QuestionTemplate[] = [
  pushLenPo,
  indexPo,
  offByFb,
  popMc,
  includesBm,
  pushFg,
  mutatorsCg,
];
