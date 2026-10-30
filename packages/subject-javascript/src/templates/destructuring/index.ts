import type { QuestionTemplate } from '@lg/core';
import { defineTemplate, fmt, pickInt, pickInts, pickOf, PERSON_NAMES } from '../helpers.js';

const TOPIC = 'destructuring';

const objPo = defineTemplate(
  {
    id: 'de-obj-po',
    topicId: TOPIC,
    subtopicId: 'destructuring-objects',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['destructuring', 'oggetti'],
    tags: ['destructuring'],
  },
  (rng) => {
    const nome = pickOf(rng, PERSON_NAMES);
    const eta = pickInt(rng, 18, 60);
    const key = pickOf(rng, ['nome', 'eta'] as const);
    const correct = key === 'nome' ? nome : eta;
    const code = `const utente = { nome: '${nome}', eta: ${eta} };\nconst { ${key} } = utente;\nconsole.log(${key});`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(correct),
        why: `\`const { ${key} } = utente\` estrae la proprietà ${key} in una variabile omonima: il log stampa ${fmt(correct)}.`,
      },
      distractors: [
        {
          text: fmt(key === 'nome' ? eta : nome),
          why: `Il destructuring estrae solo la proprietà con il nome indicato (${key}), non l'altra: quel valore resta dentro l'oggetto.`,
        },
        {
          text: 'undefined',
          why: `La proprietà ${key} esiste in \`utente\` e vale ${fmt(correct)}: undefined comparirebbe solo se la chiave mancasse.`,
        },
        {
          text: `{ ${key}: ${fmt(correct, true)} }`,
          why: `Le graffe a sinistra estraggono il valore della proprietà, non creano un oggetto: ${key} contiene ${fmt(correct)}.`,
        },
      ],
      short: `const { ${key} } = utente crea la variabile ${key} = ${fmt(correct)}.`,
      whyCorrect: 'Le graffe a sinistra estraggono la proprietà omonima.',
      concept: 'Destructuring di oggetti',
      commonMistake: 'Pensare che serva obj.prop dopo il destructuring.',
      example: 'const { a } = { a: 1 } // a = 1',
    };
  },
);

const skipFg = defineTemplate(
  {
    id: 'de-arr-skip-fg',
    topicId: TOPIC,
    subtopicId: 'destructuring-arrays',
    type: 'fill-the-gap',
    difficulty: 'medium',
    skills: ['destructuring', 'array'],
    tags: ['destructuring'],
  },
  (rng) => {
    const arr = pickInts(rng, 3, 1, 30, true);
    const code = `const [___] = [${arr.join(', ')}];\nconsole.log(secondo); // ${arr[1]}`;
    return {
      prompt: `Completa il destructuring per ottenere il secondo elemento (${arr[1]}).`,
      code: code,
      correct: {
        text: ', secondo',
        why: `Nel destructuring di array le posizioni contano: la virgola iniziale salta il primo elemento e \`secondo\` riceve ${arr[1]}.`,
      },
      distractors: [
        {
          text: 'secondo',
          why: `Senza la virgola, \`secondo\` occuperebbe il primo slot e riceverebbe ${arr[0]} invece di ${arr[1]}.`,
        },
        {
          text: 'secondo,',
          why: `La virgola dopo il nome non salta nulla: \`secondo\` resta in prima posizione e riceverebbe ${arr[0]}.`,
        },
        {
          text: 'secondo, terzo',
          why: `Le posizioni contano, non i nomi: \`secondo\` occuperebbe il primo slot e riceverebbe ${arr[0]}, non ${arr[1]}.`,
        },
      ],
      short: 'Nel destructuring di array le posizioni contano: , salta un elemento.',
      whyCorrect: `const [, secondo] = [${arr.join(', ')}] → secondo = ${arr[1]}.`,
      concept: 'Saltare elementi nel destructuring',
      commonMistake: 'Dimenticare la virgola per saltare una posizione.',
      example: 'const [a, , c] = [1,2,3] // a=1, c=3',
    };
  },
);

const renameMc = defineTemplate(
  {
    id: 'de-rename-mc',
    topicId: TOPIC,
    subtopicId: 'destructuring-objects',
    type: 'multiple-choice',
    difficulty: 'hard',
    skills: ['destructuring', 'rinomina'],
    tags: ['destructuring'],
  },
  (rng) => {
    const v = pickInt(rng, 1, 99);
    const code = `const { a: b } = { a: ${v} };\nconsole.log(b);`;
    return {
      prompt: 'Cosa succede con questo codice?',
      code: code,
      correct: {
        text: `b vale ${v}, a non esiste`,
        why: `\`{ a: b }\` legge la proprietà \`a\` e la assegna a una nuova variabile \`b\`: solo b viene creata e vale ${v}.`,
      },
      distractors: [
        {
          text: `b e a valgono ${v}`,
          why: `La rinomina crea una sola variabile: \`a\` è solo il nome della proprietà letta e non diventa una variabile.`,
        },
        {
          text: 'b vale `undefined`',
          why: `La proprietà \`a\` esiste e vale ${v}: il destructuring la legge e la assegna a \`b\`, che non è undefined.`,
        },
        {
          text: 'Errore di sintassi',
          why: `\`{ a: b }\` è la sintassi corretta della rinomina nel destructuring: il codice è valido e stampa ${v}.`,
        },
      ],
      short: 'Nella rinomina { originale: nuovoNome }, solo nuovoNome diventa variabile.',
      whyCorrect: `b = ${v}; a non è definita.`,
      concept: 'Rinomina nel destructuring',
      commonMistake: 'Pensare che { a: b } crei entrambe le variabili.',
      example: 'const { x: y } = { x: 5 } // y = 5, x non esiste',
    };
  },
);

const defaultPo = defineTemplate(
  {
    id: 'de-default-po',
    topicId: TOPIC,
    subtopicId: 'destructuring-objects',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['destructuring', 'default'],
    tags: ['destructuring'],
  },
  (rng) => {
    const d = pickInt(rng, 10, 99);
    const key = pickOf(rng, ['x', 'punti', 'livello']);
    const code = `const { ${key} = ${d} } = {};\nconsole.log(${key});`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(d),
        why: `L'oggetto è vuoto, quindi la proprietà ${key} è undefined e scatta il valore di default: il log stampa ${d}.`,
      },
      distractors: [
        {
          text: 'undefined',
          why: `Il default \`= ${d}\` si applica proprio quando la proprietà è undefined o assente: la variabile riceve ${d}, non undefined.`,
        },
        {
          text: 'null',
          why: `Il valore assegnato è il default ${d}: null comparirebbe solo se la proprietà esistesse e valesse null.`,
        },
        {
          text: 'TypeError',
          why: 'Destrutturare un oggetto vuoto è lecito: l’errore ci sarebbe solo destrutturando `null` o `undefined`, non `{}`.',
        },
      ],
      short: `{ ${key} = ${d} } assegna ${d} perché la proprietà non c'è.`,
      whyCorrect: 'Il default scatta solo con undefined, non con altri falsy.',
      concept: 'Valori di default nel destructuring',
      commonMistake: 'Pensare che il default scatti anche con null (non scatta).',
      example: 'const { a = 1 } = { a: null } // a = null',
    };
  },
);

export const destructuringTemplates: QuestionTemplate[] = [objPo, skipFg, renameMc, defaultPo];
