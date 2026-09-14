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
      { text: 'undefined', why: 'Senza return la funzione restituisce undefined.' },
      [
        { text: fmt(a * m), why: 'Il calcolo avviene ma il risultato non viene restituito: serve return r.' },
        { text: 'null', why: 'Il valore di default di una funzione è undefined, non null.' },
        { text: 'r', why: 'r è una variabile interna: non viene stampata né restituita.' },
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
      { text: 'undefined', why: `b non riceve argomenti: vale undefined.` },
      [
        { text: fmt(a), why: `${a} va al primo parametro a, non a b.` },
        { text: '0', why: 'I parametri mancanti valgono undefined, non 0.' },
        { text: 'ReferenceError', why: 'Chiamare con meno argomenti non è un errore: b vale undefined.' },
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
        text: "Il console.log dopo return non viene mai eseguito: return termina la funzione",
        why: 'Tutto il codice dopo return è irraggiungibile.',
      },
      [
        { text: 'return deve stare alla fine del file', why: 'return può stare ovunque nella funzione; è il codice dopo a non eseguirsi.' },
        { text: 'console.log dentro le funzioni è vietato', why: 'È lecito: semplicemente qui non viene raggiunto.' },
        { text: 'Manca un else', why: 'Non c\'è alcuna condizione da completare.' },
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
        concept: 'return interrompe l\'esecuzione',
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
      { text: 'function', why: 'function è la parola chiave per dichiarare una funzione in JavaScript.' },
      [
        { text: 'def', why: 'def è la sintassi di Python, non di JavaScript.' },
        { text: 'fun', why: 'fun è la sintassi di Kotlin, non di JavaScript.' },
        { text: 'method', why: '"method" non è una parola chiave di JavaScript.' },
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
        why: 'I parametri di default si dichiarano nella firma: pulito e visibile.',
      },
      [
        { text: `function ${fname}(${pname} || '${def}') { ... }`, why: 'Non è sintassi valida nella firma dei parametri.' },
        { text: `function ${fname}(${pname}: '${def}') { ... }`, why: 'I due punti nella firma indicano un tipo (TypeScript), non un default.' },
        { text: `function ${fname}(default ${pname} = '${def}') { ... }`, why: '"default" non è una parola chiave valida per i parametri.' },
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
        whyCorrect: 'Il default si applica quando l\'argomento è undefined.',
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
