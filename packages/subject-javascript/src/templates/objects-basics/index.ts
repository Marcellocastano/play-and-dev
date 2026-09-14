import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, PERSON_NAMES, retry, shuffle, type Rng } from '../helpers.js';

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
        { text: fmt(correct), why: `utente.${key} legge la proprietà ${key}: ${fmt(correct)}.` },
        [
          { text: fmt(other), why: `Quella è l'altra proprietà: qui si legge ${key}.` },
          { text: 'undefined', why: `La proprietà ${key} esiste nell'oggetto.` },
          { text: `{ nome: '${nome}', eta: ${eta} }`, why: 'Si stampa una proprietà, non l\'oggetto intero.' },
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
      { text: `${obj}[${key}]`, why: `Con la chiave in una variabile serve la bracket notation: ${obj}[${key}].` },
      [
        { text: `${obj}.${key}`, why: `${obj}.${key} cerca letteralmente la proprietà "${key}", non il suo contenuto.` },
        { text: `${obj}.'${key}'`, why: 'Non è sintassi valida: la stringa va tra parentesi quadre.' },
        { text: `${obj}(${key})`, why: 'Le parentesi tonde invocherebbero l\'oggetto come funzione.' },
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
        text: `Manca (): ${obj}.${m} è la funzione; per invocarla serve ${obj}.${m}()`,
        why: 'Senza () si stampa il riferimento alla funzione, non il suo risultato.',
      },
      [
        { text: 'return va fuori dal metodo', why: 'Il return dentro il metodo è corretto.' },
        { text: 'Gli oggetti non possono contenere funzioni', why: 'Le funzioni come proprietà si chiamano metodi ed è normalissimo.' },
        { text: 'console.log non stampa stringhe da oggetti', why: 'Il problema è solo la chiamata mancante.' },
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
      { text: 'in', why: `'${key}' in ${obj} verifica l'esistenza della chiave.` },
      [
        { text: 'of', why: 'of si usa in for...of, non per verificare le chiavi.' },
        { text: '==', why: '== confronterebbe la stringa con l\'oggetto: sempre false.' },
        { text: 'has', why: 'has non è un operatore: è un metodo di Map/Set, non degli oggetti.' },
      ],
    );
    return {
      templateId: 'obj-in-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'objects-methods-in',
      skills: ['in'],
      prompt: 'Completa il controllo sull\'esistenza della proprietà.',
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
    const trueStatements = [
      { text: 'Serve quando la chiave è contenuta in una variabile', why: 'obj[k] valuta k; obj.k cercherebbe la chiave letterale "k".' },
      { text: 'Serve quando la chiave contiene spazi o caratteri speciali', why: 'obj["nome completo"] funziona; obj.nome completo no.' },
      { text: 'Serve quando la chiave è calcolata a runtime', why: 'Le parentesi quadre valutano un\'espressione: obj["a" + n].' },
      { text: 'Serve quando la chiave inizia con una cifra', why: 'obj["1a"] è valido; obj.1a è un errore di sintassi.' },
    ];
    const falseStatements = [
      { text: 'Sono sempre intercambiabili', why: 'obj.prop cerca il nome letterale "prop": con una variabile serve obj[prop].' },
      { text: 'La bracket notation è deprecata', why: 'Nessuna delle due è deprecata: hanno scopi diversi.' },
      { text: 'La bracket notation serve solo per gli array', why: 'Funziona su qualunque oggetto: obj["chiave"].' },
      { text: 'La dot notation funziona con le variabili', why: 'obj.k cerca la chiave "k", non il valore della variabile k.' },
    ];
    const built = makeOptions(
      rng,
      pickOf(rng, trueStatements),
      shuffle(falseStatements, rng).slice(0, 3),
    );
    return {
      templateId: 'obj-dot-bracket-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'objects-access',
      skills: ['bracket notation'],
      prompt: 'Quale affermazione su dot notation e bracket notation è corretta?',
      ...built,
      explanation: {
        short: 'Bracket per chiavi dinamiche o non identificatori; dot per chiavi fisse.',
        whyCorrect: 'obj[k] risolve il valore di k; obj.k cerca la chiave "k".',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Dot vs bracket notation',
        commonMistake: 'Scrivere obj.variabile pensando che legga la chiave contenuta.',
        example: 'obj["nome completo"] funziona; obj.nome completo no',
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
