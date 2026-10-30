import type { QuestionTemplate } from '@lg/core';
import { defineTemplate, fmt, pickInt, pickOf, PERSON_NAMES } from '../helpers.js';

const TOPIC = 'objects-basics';

const accessPo = defineTemplate(
  {
    id: 'obj-access-po',
    topicId: TOPIC,
    subtopicId: 'objects-access',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['dot notation'],
    tags: ['oggetti'],
  },
  (rng) => {
    const nome = pickOf(rng, PERSON_NAMES);
    const eta = pickInt(rng, 18, 60);
    const key = pickOf(rng, ['nome', 'eta'] as const);
    const code = `const utente = { nome: '${nome}', eta: ${eta} };\nconsole.log(utente.${key});`;
    const correct = key === 'nome' ? nome : eta;
    const other = key === 'nome' ? eta : nome;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(correct),
        why: `\`utente.${key}\` legge la proprietà ${key} dell'oggetto: il log stampa ${fmt(correct)}.`,
      },
      distractors: [
        {
          text: fmt(other),
          why: `${fmt(other)} è il valore dell'altra proprietà: il codice accede a \`utente.${key}\`, non a quella.`,
        },
        {
          text: 'undefined',
          why: `La proprietà ${key} esiste nell'oggetto e vale ${fmt(correct)}: undefined comparirebbe solo per una chiave assente.`,
        },
        {
          text: `{ nome: '${nome}', eta: ${eta} }`,
          why: 'Il log stampa una singola proprietà, non l’oggetto intero: `utente.nome`-style seleziona solo un valore.',
        },
      ],
      short: `utente.${key} accede alla proprietà ${key}: ${fmt(correct)}.`,
      whyCorrect: 'La dot notation legge il valore della chiave indicata.',
      concept: 'Accesso alle proprietà',
      commonMistake: 'Confondere chiave e valore.',
      example: 'obj.prop equivale a obj["prop"]',
    };
  },
);

const bracketMc = defineTemplate(
  {
    id: 'obj-bracket-mc',
    topicId: TOPIC,
    subtopicId: 'objects-access',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['bracket notation'],
    tags: ['oggetti'],
  },
  (rng) => {
    const key = pickOf(rng, ['chiave', 'prop', 'k', 'campo']);
    const target = pickOf(rng, ['nome', 'email', 'ruolo', 'sede']);
    const obj = pickOf(rng, ['utente', 'prodotto', 'record']);
    return {
      prompt: `Hai \`const ${key} = '${target}'\` e un oggetto ${obj}. Come leggi la proprietà il cui nome è contenuto in ${key}?`,
      correct: {
        text: `${obj}[${key}]`,
        why: `Con la chiave dentro una variabile serve la bracket notation: \`${obj}[${key}]\` valuta ${key} e legge la proprietà '${target}'.`,
      },
      distractors: [
        {
          text: `${obj}.${key}`,
          why: `Con il punto il nome non viene valutato: \`${obj}.${key}\` cerca la chiave letterale "${key}", che non è '${target}'.`,
        },
        {
          text: `${obj}['${key}']`,
          why: `Tra virgolette '${key}' è una stringa letterale: cercherebbe la chiave "${key}" invece del contenuto della variabile, cioè '${target}'.`,
        },
        {
          text: `${obj}(${key})`,
          why: `Le parentesi tonde invocano una funzione: \`${obj}(${key})\` tenterebbe di chiamare l'oggetto e darebbe un TypeError.`,
        },
      ],
      short: 'Con chiavi dinamiche si usa obj[variabile].',
      whyCorrect: `utente[${key}] valuta ${key} e legge la proprietà 'email'.`,
      concept: 'Bracket notation con chiavi dinamiche',
      commonMistake: 'Scrivere obj.variabile: il punto cerca il nome letterale.',
      example: 'const k = "nome"; obj[k] // legge obj["nome"]',
    };
  },
);

const methodFb = defineTemplate(
  {
    id: 'obj-method-fb',
    topicId: TOPIC,
    subtopicId: 'objects-methods-in',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['metodi'],
    tags: ['oggetti', 'bug'],
  },
  (rng) => {
    const greet = pickOf(rng, ['ciao', 'salve', 'benvenuto']);
    const obj = pickOf(rng, ['assistente', 'robot', 'bot']);
    const m = pickOf(rng, ['saluta', 'rispondi', 'presentati']);
    const code = `const ${obj} = {\n  ${m}() {\n    return '${greet}';\n  }\n};\nconsole.log(${obj}.${m});`;
    return {
      prompt: `Questo codice dovrebbe stampare '${greet}' ma stampa qualcosa come [Function: ${m}]. Qual è il bug?`,
      code: code,
      correct: {
        text: 'Mancano le `()` di chiamata',
        why: `\`${obj}.${m}\` restituisce il riferimento alla funzione: per eseguirla e stampare '${greet}' servono le parentesi, \`${obj}.${m}()\`.`,
      },
      distractors: [
        {
          text: 'Il metodo va definito con `function`',
          why: `La shorthand \`${m}() { ... }\` è una sintassi valida per i metodi degli oggetti: la definizione è corretta, manca solo la chiamata.`,
        },
        {
          text: `Serve \`this.${m}()\``,
          why: `\`this\` serve dentro i metodi per riferirsi all'oggetto: dall'esterno si chiama con \`${obj}.${m}()\`, senza this.`,
        },
        {
          text: '`return` va fuori dal metodo',
          why: 'Il `return` è nella posizione giusta dentro il metodo: il bug è che il metodo non viene invocato, non dove sta il return.',
        },
      ],
      short: 'senza () si ottiene la funzione stessa, non la sua esecuzione.',
      whyCorrect: `${obj}.${m}() invoca il metodo e ritorna la stringa.`,
      concept: 'Invocazione di un metodo',
      commonMistake: 'Dimenticare le parentesi nel chiamare un metodo.',
      example: 'o.metodo → la funzione; o.metodo() → il risultato',
    };
  },
);

const inFg = defineTemplate(
  {
    id: 'obj-in-fg',
    topicId: TOPIC,
    subtopicId: 'objects-methods-in',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['in'],
    tags: ['oggetti'],
  },
  (rng) => {
    const key = pickOf(rng, ['nome', 'email', 'eta', 'ruolo', 'sede']);
    const obj = pickOf(rng, ['utente', 'profilo', 'record']);
    const code = `const ${obj} = { ${key}: 'x' };\nif ('${key}' ___ ${obj}) {\n  console.log('presente');\n}`;
    return {
      prompt: "Completa il controllo sull'esistenza della proprietà.",
      code: code,
      correct: {
        text: 'in',
        why: `L'operatore \`in\` verifica se una chiave esiste nell'oggetto: \`'${key}' in ${obj}\` restituisce true.`,
      },
      distractors: [
        {
          text: 'of',
          why: '`of` appartiene al ciclo `for...of` e non verifica le proprietà: in quella posizione darebbe un errore di sintassi.',
        },
        {
          text: '==',
          why: `\`'${key}' == ${obj}\` confronterebbe una stringa con un oggetto: restituirebbe false, non l'esistenza della chiave.`,
        },
        {
          text: 'has',
          why: '`has` non è un operatore: è un metodo di Map e Set, e sugli oggetti semplici non esiste.',
        },
      ],
      short: "'chiave' in oggetto ritorna true se la proprietà esiste.",
      whyCorrect: `'${key}' in ${obj} → true.`,
      concept: 'Operatore in',
      commonMistake: 'Usare has() (che è di Map/Set) sugli oggetti.',
      example: '"a" in { a: 1 } // true',
    };
  },
);

const dotBracketCmp = defineTemplate(
  {
    id: 'obj-dot-bracket-cmp',
    topicId: TOPIC,
    subtopicId: 'objects-access',
    type: 'compare',
    difficulty: 'medium',
    skills: ['dot notation', 'bracket notation'],
    tags: ['oggetti'],
  },
  (rng) => {
    const key = pickOf(rng, ['k', 'chiave', 'campo']);
    const target = pickOf(rng, ['nome', 'email', 'ruolo']);
    const val = pickOf(rng, PERSON_NAMES);
    const other = pickOf(rng, ['x', 'ok', 'test']);
    const obj = pickOf(rng, ['utente', 'record', 'profilo']);
    const code = `const ${key} = '${target}';\nconst ${obj} = { ${target}: '${val}', ${key}: '${other}' };\nconsole.log(${obj}.${key});\nconsole.log(${obj}[${key}]);`;
    return {
      prompt: 'Cosa stampano i due `console.log`, in ordine?',
      code: code,
      correct: {
        text: `${other}\n${val}`,
        why: `\`${obj}.${key}\` legge la chiave letterale "${key}" e stampa '${other}'; \`${obj}[${key}]\` valuta la variabile e legge '${target}', stampando '${val}'.`,
      },
      distractors: [
        {
          text: `${val}\n${other}`,
          why: `Le notazioni sono invertite: è il punto a leggere la chiave letterale "${key}" ('${other}'), mentre le quadre valutano la variabile e danno '${val}'.`,
        },
        {
          text: `${val}\n${val}`,
          why: `Le due forme coincidono solo se non esiste una chiave letterale "${key}": qui invece esiste, quindi \`${obj}.${key}\` stampa '${other}'.`,
        },
        {
          text: `${other}\n${other}`,
          why: `Le quadre non cercano la chiave "${key}": valutano la variabile, che contiene '${target}', quindi il secondo log stampa '${val}'.`,
        },
      ],
      short: `${obj}[${key}] valuta la variabile e legge ${target}: '${val}'.`,
      whyCorrect: 'obj[k] risolve il valore di k; obj.k cerca la chiave "k".',
      concept: 'Dot vs bracket notation',
      commonMistake: 'Scrivere obj.variabile pensando che legga la chiave contenuta.',
      example: 'const k = "nome"; obj[k] // legge obj["nome"]',
    };
  },
);

export const objectsBasicsTemplates: QuestionTemplate[] = [
  accessPo,
  bracketMc,
  methodFb,
  inFg,
  dotBracketCmp,
];
