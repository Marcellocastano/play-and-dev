import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, type Rng } from '../helpers.js';

const TOPIC = 'functions';
const DD = 'dd-functions';

const noReturnPo: QuestionTemplate = {
  id: 'fn-noreturn-po',
  topicId: TOPIC,
  subtopicId: 'functions-return',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['return', 'undefined'],
  tags: ['funzioni'],
  generate(rng: Rng) {
    const a = pickInt(rng, 2, 9);
    const m = pickInt(rng, 2, 5);
    const code = `function doppia(x) {\n  const r = x * ${m};\n}\nconsole.log(doppia(${a}));`;
    const built = makeOptions(
      rng,
      {
        text: 'undefined',
        why: 'La funzione calcola `r` ma non lo restituisce: senza `return` il valore di ritorno è undefined.',
      },
      [
        {
          text: fmt(a * m),
          why: `Il prodotto ${a * m} viene calcolato e assegnato a \`r\`, ma non esce mai dalla funzione: servirebbe \`return r\`.`,
        },
        {
          text: 'null',
          why: 'Il valore di ritorno implicito di una funzione è undefined, non null: `null` andrebbe restituito esplicitamente.',
        },
        {
          text: 'r',
          why: '`r` è una variabile locale interna alla funzione: il log stampa il valore di ritorno della chiamata, che senza `return` è undefined.',
        },
      ],
    );
    return {
      templateId: 'fn-noreturn-po',
      type: 'predict-output',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'functions-return',
      skills: ['return'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: 'Una funzione senza return restituisce undefined.',
        whyCorrect: 'Il risultato del calcolo resta dentro la funzione.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Valore di ritorno implicito',
        commonMistake: 'Calcolare il risultato e dimenticare il return.',
        example: 'function f() { } → f() === undefined',
      },
      deepDiveRef: DD,
    };
  },
};

const missingArgPo: QuestionTemplate = {
  id: 'fn-missing-po',
  topicId: TOPIC,
  subtopicId: 'functions-params',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['parametri', 'undefined'],
  tags: ['funzioni'],
  generate(rng: Rng) {
    const a = pickInt(rng, 1, 9);
    const fname = pickOf(rng, ['stampa', 'mostra', 'leggi']);
    const code = `function ${fname}(a, b) {\n  console.log(b);\n}\n${fname}(${a});`;
    const built = makeOptions(
      rng,
      {
        text: 'undefined',
        why: `La chiamata \`${fname}(${a})\` passa un solo argomento, che va ad \`a\`: \`b\` resta senza valore e vale undefined.`,
      },
      [
        {
          text: fmt(a),
          why: `${a} viene assegnato al primo parametro \`a\` in ordine posizionale: \`b\` non riceve nulla e vale undefined.`,
        },
        {
          text: '0',
          why: 'I parametri senza argomento non hanno un default implicito a 0: senza un valore di default dichiarato, `b` vale undefined.',
        },
        {
          text: 'ReferenceError',
          why: 'Chiamare una funzione con meno argomenti del previsto è lecito in JavaScript: il parametro mancante vale semplicemente undefined.',
        },
      ],
    );
    return {
      templateId: 'fn-missing-po',
      type: 'predict-output',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'functions-params',
      skills: ['parametri'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: 'Gli argomenti mancanti rendono il parametro undefined.',
        whyCorrect: `${fname}(${a}) passa un solo valore: a = ${a}, b = undefined.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Argomenti mancanti',
        commonMistake: 'Aspettarsi un errore o un valore di default automatico.',
        example: 'function f(a, b = 10) — i default risolvono il problema',
      },
      deepDiveRef: DD,
    };
  },
};

const afterReturnFb: QuestionTemplate = {
  id: 'fn-after-return-fb',
  topicId: TOPIC,
  subtopicId: 'functions-return',
  type: 'find-the-bug',
  difficulty: 'easy',
  skills: ['return'],
  tags: ['funzioni', 'bug'],
  generate(rng: Rng) {
    const v = pickInt(rng, 10, 99);
    const code = `function calcola() {\n  return ${v};\n  console.log('finito');\n}\nconsole.log(calcola());`;
    const built = makeOptions(
      rng,
      {
        text: 'Il codice dopo `return` non gira',
        why: `\`return ${v}\` fa uscire subito dalla funzione: la riga con \`console.log('finito')\` è codice irraggiungibile e non viene mai eseguita.`,
      },
      [
        {
          text: 'Manca un ramo `else`',
          why: 'Non c’è alcun `if` in questo codice e non serve un `else`: il problema è che la riga del log sta dopo `return` e non viene mai raggiunta.',
        },
        {
          text: "`'finito'` va restituito con `return`",
          why: 'Anche restituendo la stringa, la riga resta dopo il primo `return` e non verrebbe eseguita: per vederla andrebbe spostata prima.',
        },
        {
          text: '`return` va dentro `console.log`',
          why: '`return` non può stare dentro un `console.log` come parametro in questo modo: il problema è l’ordine delle righe, non l’annidamento.',
        },
      ],
    );
    return {
      templateId: 'fn-after-return-fb',
      type: 'find-the-bug',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'functions-return',
      skills: ['return'],
      prompt: `Chi scrive il codice si aspetta di vedere anche 'finito' in console, ma non compare. Perché?`,
      code,
      ...built,
      explanation: {
        short: 'return esce subito dalla funzione: il codice successivo è dead code.',
        whyCorrect: `La funzione restituisce ${v} e termina.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: "return interrompe l'esecuzione",
        commonMistake: 'Pensare che la funzione continui dopo return.',
        example: 'Metti il console.log prima del return.',
      },
      deepDiveRef: DD,
    };
  },
};

const declareFg: QuestionTemplate = {
  id: 'fn-declare-fg',
  topicId: TOPIC,
  subtopicId: 'functions-declaration',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['function'],
  tags: ['funzioni'],
  generate(rng: Rng) {
    const fname = pickOf(rng, ['somma', 'moltiplica', 'calcola', 'combina', 'misura']);
    const expr = pickOf(rng, ['a + b', 'a * b', 'a - b']);
    const code = `___ ${fname}(a, b) {\n  return ${expr};\n}`;
    const built = makeOptions(
      rng,
      {
        text: 'function',
        why: `In JavaScript una funzione si dichiara con \`function ${fname}(a, b) { ... }\`: è la parola chiave richiesta.`,
      },
      [
        {
          text: 'def',
          why: '`def` è la sintassi di Python per le funzioni: in JavaScript darebbe un errore di sintassi, la parola chiave è `function`.',
        },
        {
          text: 'fun',
          why: '`fun` appartiene a Kotlin (e linguaggi simili): in JavaScript non esiste e il codice non verrebbe riconosciuto.',
        },
        {
          text: 'method',
          why: '`method` non è una parola chiave di JavaScript: la dichiarazione corretta usa `function`.',
        },
      ],
    );
    return {
      templateId: 'fn-declare-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'functions-declaration',
      skills: ['function'],
      prompt: 'Completa la dichiarazione della funzione.',
      code,
      ...built,
      explanation: {
        short: 'Le funzioni si dichiarano con function nome(parametri) { corpo }.',
        whyCorrect: 'function somma(a, b) { ... } è la dichiarazione corretta.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Dichiarazione di funzione',
        commonMistake: 'Importare sintassi da altri linguaggi (def, fun).',
        example: 'function saluta() { return "ciao"; }',
      },
      deepDiveRef: DD,
    };
  },
};

const defaultBm: QuestionTemplate = {
  id: 'fn-default-bm',
  topicId: TOPIC,
  subtopicId: 'functions-params',
  type: 'best-method',
  difficulty: 'medium',
  skills: ['parametri di default'],
  tags: ['funzioni', 'best-practice'],
  generate(rng: Rng) {
    const def = pickOf(rng, ['ospite', 'utente', 'anonimo']);
    const fname = pickOf(rng, ['saluta', 'accogli', 'presenta']);
    const pname = pickOf(rng, ['nome', 'utente', 'persona']);
    const built = makeOptions(
      rng,
      {
        text: `function ${fname}(${pname} = '${def}') { ... }`,
        why: `I parametri di default si dichiarano nella firma con \`=\`: se ${pname} non viene passato (o è undefined) vale '${def}'.`,
      },
      [
        {
          text: `function ${fname}(${pname} || '${def}') { ... }`,
          why: `Nella firma dei parametri non si può scrivere un'espressione con \`||\`: darebbe un errore di sintassi; \`||\` andrebbe nel corpo, oppure si usa \`=\` in firma.`,
        },
        {
          text: `function ${fname}(${pname}: '${def}') { ... }`,
          why: "I due punti dopo un parametro indicano un'annotazione di tipo in stile TypeScript, non un valore di default: non è JavaScript valido.",
        },
        {
          text: `function ${fname}(default ${pname} = '${def}') { ... }`,
          why: 'Non esiste una parola chiave `default` per i parametri: il default si esprime direttamente con `=` dopo il nome del parametro.',
        },
      ],
    );
    return {
      templateId: 'fn-default-bm',
      type: 'best-method',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'functions-params',
      skills: ['parametri di default'],
      prompt: `Vuoi che il parametro ${pname} valga '${def}' quando non viene passato. Qual è la scrittura corretta?`,
      ...built,
      explanation: {
        short: 'I parametri di default si scrivono nella firma: (nome = "ospite").',
        whyCorrect: "Il default si applica quando l'argomento è undefined.",
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Parametri di default',
        commonMistake: 'Gestire il default a mano nel corpo quando la firma lo supporta.',
        example: 'function f(x = 0) { } → f() usa x = 0',
      },
      deepDiveRef: DD,
    };
  },
};

export const functionsTemplates: QuestionTemplate[] = [
  noReturnPo,
  missingArgPo,
  afterReturnFb,
  declareFg,
  defaultBm,
];
