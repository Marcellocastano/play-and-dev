import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, PERSON_NAMES, retry, type Rng } from '../helpers.js';

const TOPIC = 'objects-basics';
const DD = 'dd-objects-basics';

const accessPo: QuestionTemplate = {
  id: 'obj-access-po',
  topicId: TOPIC,
  subtopicId: 'objects-access',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['dot notation'],
  tags: ['oggetti'],
  generate(rng: Rng) {
    return retry(() => {
      const nome = pickOf(rng, PERSON_NAMES);
      const eta = pickInt(rng, 18, 60);
      const key = pickOf(rng, ['nome', 'eta'] as const);
      const code = `const utente = { nome: '${nome}', eta: ${eta} };\nconsole.log(utente.${key});`;
      const correct = key === 'nome' ? nome : eta;
      const other = key === 'nome' ? eta : nome;
      const built = makeOptions(
        rng,
        {
          text: fmt(correct),
          why: `\`utente.${key}\` legge la proprietà ${key} dell'oggetto: il log stampa ${fmt(correct)}.`,
        },
        [
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
      );
      return {
        templateId: 'obj-access-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'objects-access',
        skills: ['dot notation'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `utente.${key} accede alla proprietà ${key}: ${fmt(correct)}.`,
          whyCorrect: 'La dot notation legge il valore della chiave indicata.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Accesso alle proprietà',
          commonMistake: 'Confondere chiave e valore.',
          example: 'obj.prop equivale a obj["prop"]',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const bracketMc: QuestionTemplate = {
  id: 'obj-bracket-mc',
  topicId: TOPIC,
  subtopicId: 'objects-access',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['bracket notation'],
  tags: ['oggetti'],
  generate(rng: Rng) {
    const key = pickOf(rng, ['chiave', 'prop', 'k', 'campo']);
    const target = pickOf(rng, ['nome', 'email', 'ruolo', 'sede']);
    const obj = pickOf(rng, ['utente', 'prodotto', 'record']);
    const built = makeOptions(
      rng,
      {
        text: `${obj}[${key}]`,
        why: `Con la chiave dentro una variabile serve la bracket notation: \`${obj}[${key}]\` valuta ${key} e legge la proprietà '${target}'.`,
      },
      [
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
    );
    return {
      templateId: 'obj-bracket-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'objects-access',
      skills: ['bracket notation'],
      prompt: `Hai \`const ${key} = '${target}'\` e un oggetto ${obj}. Come leggi la proprietà il cui nome è contenuto in ${key}?`,
      ...built,
      explanation: {
        short: 'Con chiavi dinamiche si usa obj[variabile].',
        whyCorrect: `utente[${key}] valuta ${key} e legge la proprietà 'email'.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Bracket notation con chiavi dinamiche',
        commonMistake: 'Scrivere obj.variabile: il punto cerca il nome letterale.',
        example: 'const k = "nome"; obj[k] // legge obj["nome"]',
      },
      deepDiveRef: DD,
    };
  },
};

const methodFb: QuestionTemplate = {
  id: 'obj-method-fb',
  topicId: TOPIC,
  subtopicId: 'objects-methods-in',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['metodi'],
  tags: ['oggetti', 'bug'],
  generate(rng: Rng) {
    const greet = pickOf(rng, ['ciao', 'salve', 'benvenuto']);
    const obj = pickOf(rng, ['assistente', 'robot', 'bot']);
    const m = pickOf(rng, ['saluta', 'rispondi', 'presentati']);
    const code = `const ${obj} = {\n  ${m}() {\n    return '${greet}';\n  }\n};\nconsole.log(${obj}.${m});`;
    const built = makeOptions(
      rng,
      {
        text: 'Mancano le `()` di chiamata',
        why: `\`${obj}.${m}\` restituisce il riferimento alla funzione: per eseguirla e stampare '${greet}' servono le parentesi, \`${obj}.${m}()\`.`,
      },
      [
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
    );
    return {
      templateId: 'obj-method-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'objects-methods-in',
      skills: ['metodi'],
      prompt: `Questo codice dovrebbe stampare '${greet}' ma stampa qualcosa come [Function: ${m}]. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'senza () si ottiene la funzione stessa, non la sua esecuzione.',
        whyCorrect: `${obj}.${m}() invoca il metodo e ritorna la stringa.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Invocazione di un metodo',
        commonMistake: 'Dimenticare le parentesi nel chiamare un metodo.',
        example: 'o.metodo → la funzione; o.metodo() → il risultato',
      },
      deepDiveRef: DD,
    };
  },
};

const inFg: QuestionTemplate = {
  id: 'obj-in-fg',
  topicId: TOPIC,
  subtopicId: 'objects-methods-in',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['in'],
  tags: ['oggetti'],
  generate(rng: Rng) {
    const key = pickOf(rng, ['nome', 'email', 'eta', 'ruolo', 'sede']);
    const obj = pickOf(rng, ['utente', 'profilo', 'record']);
    const code = `const ${obj} = { ${key}: 'x' };\nif ('${key}' ___ ${obj}) {\n  console.log('presente');\n}`;
    const built = makeOptions(
      rng,
      {
        text: 'in',
        why: `L'operatore \`in\` verifica se una chiave esiste nell'oggetto: \`'${key}' in ${obj}\` restituisce true.`,
      },
      [
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
    );
    return {
      templateId: 'obj-in-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'objects-methods-in',
      skills: ['in'],
      prompt: "Completa il controllo sull'esistenza della proprietà.",
      code,
      ...built,
      explanation: {
        short: "'chiave' in oggetto ritorna true se la proprietà esiste.",
        whyCorrect: `'${key}' in ${obj} → true.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Operatore in',
        commonMistake: 'Usare has() (che è di Map/Set) sugli oggetti.',
        example: '"a" in { a: 1 } // true',
      },
      deepDiveRef: DD,
    };
  },
};

const dotBracketCmp: QuestionTemplate = {
  id: 'obj-dot-bracket-cmp',
  topicId: TOPIC,
  subtopicId: 'objects-access',
  type: 'compare',
  difficulty: 'medium',
  skills: ['dot notation', 'bracket notation'],
  tags: ['oggetti'],
  generate(rng: Rng) {
    const key = pickOf(rng, ['k', 'chiave', 'campo']);
    const target = pickOf(rng, ['nome', 'email', 'ruolo']);
    const val = pickOf(rng, PERSON_NAMES);
    const other = pickOf(rng, ['x', 'ok', 'test']);
    const obj = pickOf(rng, ['utente', 'record', 'profilo']);
    const code = `const ${key} = '${target}';\nconst ${obj} = { ${target}: '${val}', ${key}: '${other}' };\nconsole.log(${obj}.${key});\nconsole.log(${obj}[${key}]);`;
    const built = makeOptions(
      rng,
      {
        text: `${other}\n${val}`,
        why: `\`${obj}.${key}\` legge la chiave letterale "${key}" e stampa '${other}'; \`${obj}[${key}]\` valuta la variabile e legge '${target}', stampando '${val}'.`,
      },
      [
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
    );
    return {
      templateId: 'obj-dot-bracket-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'objects-access',
      skills: ['dot notation', 'bracket notation'],
      prompt: 'Cosa stampano i due `console.log`, in ordine?',
      code,
      ...built,
      explanation: {
        short: `${obj}[${key}] valuta la variabile e legge ${target}: '${val}'.`,
        whyCorrect: 'obj[k] risolve il valore di k; obj.k cerca la chiave "k".',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Dot vs bracket notation',
        commonMistake: 'Scrivere obj.variabile pensando che legga la chiave contenuta.',
        example: 'const k = "nome"; obj[k] // legge obj["nome"]',
      },
      deepDiveRef: DD,
    };
  },
};

export const objectsBasicsTemplates: QuestionTemplate[] = [
  accessPo,
  bracketMc,
  methodFb,
  inFg,
  dotBracketCmp,
];
