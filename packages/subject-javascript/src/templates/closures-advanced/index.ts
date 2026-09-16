import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, retry, type Rng } from '../helpers.js';

const TOPIC = 'closures-advanced';
const DD = 'dd-closures-advanced';

const counterPo: QuestionTemplate = {
  id: 'cl-counter-po',
  topicId: TOPIC,
  subtopicId: 'closures-state',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    return retry(() => {
      const start = pickInt(rng, 0, 30);
      const v = pickOf(rng, ['n', 'tot', 'count', 'val']);
      const cname = pickOf(rng, ['c', 'next', 'tick']);
      const calls = pickInt(rng, 1, 3);
      const code = `function counter() {\n  let ${v} = ${start};\n  return function () {\n    ${v}++;\n    return ${v};\n  };\n}\nconst ${cname} = counter();\n${`${cname}();\n`.repeat(calls - 1)}console.log(${cname}());`;
      const result = start + calls;
      const built = makeOptions(
        rng,
        {
          text: fmt(result),
          why: `La closure ricorda ${v} tra le chiamate: ${cname}() viene invocata ${calls} volt${calls === 1 ? 'a' : 'e'} e ${v} arriva a ${result}.`,
        },
        [
          {
            text: fmt(result - 1),
            why: `${v} persiste nella closure e ogni chiamata la incrementa di 1: contare una chiamata in meno ignora che anche la prima invocazione incrementa.`,
          },
          {
            text: fmt(start),
            why: `${v} non viene riazzerata a ogni chiamata: la closure la conserva e la incrementa, quindi dopo ${calls} chiamat${calls === 1 ? 'a' : 'e'} vale ${result}.`,
          },
          {
            text: fmt(result + 1),
            why: `Nel codice ci sono esattamente ${calls} invocazion${calls === 1 ? 'e' : 'i'} di ${cname}(): ${v} parte da ${start} e arriva a ${result}, non oltre.`,
          },
        ],
      );
      return {
        templateId: 'cl-counter-po',
        type: 'predict-output',
        difficulty: 'hard' as const,
        topicId: TOPIC,
        subtopicId: 'closures-state',
        skills: ['closure'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `La closure ricorda ${v}: ${calls} chiamat${calls === 1 ? 'a' : 'e'} → ${result}.`,
          whyCorrect: `${v} è catturata dalla funzione interna e persiste tra le chiamate.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Stato privato via closure',
          commonMistake: 'Pensare che la variabile catturata si resetti a ogni chiamata.',
          example: 'Ogni counter() crea uno scope nuovo con la sua n.',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const separatePo: QuestionTemplate = {
  id: 'cl-separate-po',
  topicId: TOPIC,
  subtopicId: 'closures-state',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    const start = pickInt(rng, 0, 30);
    const v = pickOf(rng, ['n', 'tot', 'count']);
    const aCalls = pickInt(rng, 1, 3);
    const code = `function counter() {\n  let ${v} = ${start};\n  return function () {\n    ${v}++;\n    return ${v};\n  };\n}\nconst a = counter();\nconst b = counter();\n${'a();\n'.repeat(aCalls)}console.log(b());`;
    const built = makeOptions(
      rng,
      {
        text: fmt(start + 1),
        why: `Ogni chiamata a \`counter()\` crea uno scope separato: \`b\` ha la propria ${v} che parte da ${start}, e la prima \`b()\` la porta a ${start + 1}.`,
      },
      [
        {
          text: fmt(start + aCalls + 1),
          why: `Le chiamate ad \`a()\` incrementano la ${v} dello scope di a, che è diverso da quello di b: ${v} di b parte da ${start} e vale ${start + 1}.`,
        },
        {
          text: fmt(start),
          why: `La chiamata \`b()\` esegue \`${v}++\` prima di restituire: il risultato è ${start + 1}, non il valore iniziale.`,
        },
        {
          text: 'undefined',
          why: `La funzione interna incrementa e restituisce sempre ${v}: \`b()\` produce il numero ${start + 1}, non undefined.`,
        },
      ],
    );
    return {
      templateId: 'cl-separate-po',
      type: 'predict-output',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'closures-state',
      skills: ['closure'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `Ogni counter() crea una ${v} indipendente: b() parte da ${start} → ${start + 1}.`,
        whyCorrect: 'Le due closure catturano scope diversi.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Scope separati per factory',
        commonMistake: 'Pensare che i contatori condividano lo stato.',
        example: 'const c1 = counter(), c2 = counter(); c1 e c2 hanno n diverse.',
      },
      deepDiveRef: DD,
    };
  },
};

const captureMc: QuestionTemplate = {
  id: 'cl-capture-mc',
  topicId: TOPIC,
  subtopicId: 'closures-capture',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['closure'],
  tags: ['closure'],
  generate(rng: Rng) {
    return retry(() => {
      const a = pickInt(rng, 1, 50);
      const b = a + pickInt(rng, 1, 20);
      const v = pickOf(rng, ['n', 'x', 'tot', 'val']);
      const fname = pickOf(rng, ['crea', 'build', 'init']);
      const code = `function ${fname}() {\n  let ${v} = ${a};\n  const f = () => ${v};\n  ${v} = ${b};\n  return f;\n}\nconst f = ${fname}();\nconsole.log(f());`;
      const built = makeOptions(
        rng,
        {
          text: fmt(b),
          why: `La closure cattura la variabile ${v}, non una copia del suo valore: quando \`f()\` viene invocata, legge il valore aggiornato ${b}.`,
        },
        [
          {
            text: fmt(a),
            why: `La closure non fotografa il valore al momento della definizione: cattura il riferimento a ${v}, che nel frattempo è diventata ${b}.`,
          },
          {
            text: 'undefined',
            why: `La variabile ${v} non muore con il \`return\` di ${fname}: la closure la tiene viva e ne legge il valore ${b}.`,
          },
          {
            text: 'ReferenceError',
            why: `Lo scope di ${fname} resta accessibile alla funzione interna restituita: ${v} esiste ancora e vale ${b}.`,
          },
        ],
      );
      return {
        templateId: 'cl-capture-mc',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'closures-capture',
        skills: ['closure'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `f vede ${v} = ${b}: la closure cattura la variabile, non il valore al momento della definizione.`,
          whyCorrect: `${v} = ${b} aggiorna la variabile catturata prima che f sia invocata.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Cattura per riferimento',
          commonMistake: 'Pensare a una copia dei valori: è un riferimento alla variabile.',
          example: 'function outer() { let s = 1; const g = () => s; s = 9; return g; } // g() → 9',
        },
        deepDiveRef: DD,
      };
    });
  },
};

export const closuresAdvancedTemplates: QuestionTemplate[] = [counterPo, separatePo, captureMc];
