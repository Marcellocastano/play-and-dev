import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, retry, type Rng } from '../helpers.js';

const TOPIC = 'arrays-basics';
const DD = 'dd-arrays-basics';

const pushLenPo: QuestionTemplate = {
  id: 'arr-push-po',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['push', 'length'],
  tags: ['array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 1, 30, true);
      const v = pickInt(rng, 31, 60);
      const code = `const lista = [${arr.join(', ')}];\nlista.push(${v});\nconsole.log(lista.length);`;
      const built = makeOptions(
        rng,
        {
          text: fmt(arr.length + 1),
          why: `\`push(${v})\` aggiunge un elemento in coda: la lunghezza passa da ${arr.length} a ${arr.length + 1}.`,
        },
        [
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
      );
      return {
        templateId: 'arr-push-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'arrays-mutators',
        skills: ['push'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Dopo push l'array ha ${arr.length + 1} elementi.`,
          whyCorrect: 'push accoda un elemento e length cresce di conseguenza.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'push e length',
          commonMistake: 'Pensare che push ritorni il nuovo array (ritorna la nuova length).',
          example: 'const a = [1,2]; a.push(3); // a = [1,2,3], push ritorna 3',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const indexPo: QuestionTemplate = {
  id: 'arr-index-po',
  topicId: TOPIC,
  subtopicId: 'arrays-access',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['indici'],
  tags: ['array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 4, 10, 99, true);
      const i = pickInt(rng, 0, arr.length - 1);
      const code = `const a = [${arr.join(', ')}];\nconsole.log(a[${i}]);`;
      const built = makeOptions(
        rng,
        {
          text: fmt(arr[i]),
          why: `Gli indici partono da 0: \`a[${i}]\` legge l'elemento in posizione ${i}, che in [${arr.join(', ')}] vale ${arr[i]}.`,
        },
        [
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
      );
      return {
        templateId: 'arr-index-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'arrays-access',
        skills: ['indici'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `a[${i}] vale ${arr[i]}: gli indici partono da 0.`,
          whyCorrect: `In [${arr.join(', ')}] la posizione ${i} contiene ${arr[i]}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Accesso per indice (base 0)',
          commonMistake: 'Contare da 1 invece che da 0.',
          example: "a[0] è il primo elemento; a[a.length - 1] l'ultimo.",
        },
        deepDiveRef: DD,
      };
    });
  },
};

const offByFb: QuestionTemplate = {
  id: 'arr-offby-fb',
  topicId: TOPIC,
  subtopicId: 'arrays-access',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['indici', 'length'],
  tags: ['array', 'bug'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const last = arr[arr.length - 1]!;
    const code = `const a = [${arr.join(', ')}];\nconsole.log(a[a.length]);`;
    const built = makeOptions(
      rng,
      {
        text: "L'ultimo indice è `length - 1`",
        why: `\`a[${arr.length}]\` non esiste perché gli indici validi sono 0…${arr.length - 1}: per stampare ${last} serviva \`a[a.length - 1]\`.`,
      },
      [
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
    );
    return {
      templateId: 'arr-offby-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-access',
      skills: ['indici'],
      prompt: `Questo codice dovrebbe stampare l'ultimo elemento (${last}) ma stampa undefined. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: "Off-by-one: l'ultimo indice è length - 1.",
        whyCorrect: `a[a.length - 1] = a[${arr.length - 1}] = ${last}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Indici validi di un array',
        commonMistake: "Confondere il conteggio (length) con l'ultimo indice.",
        example: 'a[arr.length] // sempre undefined',
      },
      deepDiveRef: DD,
    };
  },
};

const popMc: QuestionTemplate = {
  id: 'arr-pop-mc',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['pop'],
  tags: ['array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 10, 60, true);
      const last = arr[arr.length - 1]!;
      const rest = arr.slice(0, -1);
      const code = `const a = [${arr.join(', ')}];\na.pop();\nconsole.log(a);`;
      const built = makeOptions(
        rng,
        {
          text: fmt(rest),
          why: `\`pop()\` rimuove l'ultimo elemento ${last} e modifica l'array: resta ${fmt(rest)}.`,
        },
        [
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
      );
      return {
        templateId: 'arr-pop-mc',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'arrays-mutators',
        skills: ['pop'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `pop() rimuove ${last}: a diventa ${fmt(rest)}.`,
          whyCorrect:
            "pop toglie l'elemento in coda e lo ritorna; qui si stampa l'array modificato.",
          whyOthersWrong: built.whyOthersWrong,
          concept: 'pop vs push/shift',
          commonMistake: 'Confondere pop (coda) con shift (testa).',
          example: "[1,2,3].pop() // 3; l'array diventa [1,2]",
        },
        deepDiveRef: DD,
      };
    });
  },
};

const includesBm: QuestionTemplate = {
  id: 'arr-includes-bm',
  topicId: TOPIC,
  subtopicId: 'arrays-search',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['includes'],
  tags: ['array', 'best-practice'],
  generate(rng: Rng) {
    const v = pickInt(rng, 1, 9);
    const built = makeOptions(
      rng,
      {
        text: `lista.includes(${v})`,
        why: `\`includes(${v})\` restituisce direttamente true o false: è il booleano pronto per l'\`if\` richiesto dallo scenario.`,
      },
      [
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
    );
    return {
      templateId: 'arr-includes-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-search',
      skills: ['includes'],
      prompt: `Ti serve un booleano pronto per un \`if\`: l'array contiene ${v}? Qual è il modo più diretto?`,
      ...built,
      explanation: {
        short: 'includes() ritorna un booleano direttamente.',
        whyCorrect: 'indexOf va bene per la posizione; per la sola presenza includes è più chiaro.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'includes vs indexOf',
        commonMistake: 'Usare indexOf senza confrontare il risultato con -1.',
        example: '[1,2,3].includes(2) // true',
      },
      deepDiveRef: DD,
    };
  },
};

const pushFg: QuestionTemplate = {
  id: 'arr-push-fg',
  topicId: TOPIC,
  subtopicId: 'arrays-mutators',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['push'],
  tags: ['array'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const v = pickInt(rng, 10, 99);
    const code = `const numeri = [${arr.join(', ')}];\nnumeri.___(${v});`;
    const built = makeOptions(
      rng,
      {
        text: 'push',
        why: `\`numeri.push(${v})\` accoda ${v} in fondo all'array, ottenendo [${[...arr, v].join(', ')}].`,
      },
      [
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
    );
    return {
      templateId: 'arr-push-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'arrays-mutators',
      skills: ['push'],
      prompt: `Completa per aggiungere ${v} in fondo all'array.`,
      code,
      ...built,
      explanation: {
        short: 'push aggiunge in coda (unshift in testa).',
        whyCorrect: `numeri.push(${v}) → [${[...arr, v].join(', ')}].`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Metodi di coda/testa degli array',
        commonMistake: 'Importare append() da altri linguaggi.',
        example: 'a.push(x) in coda; a.unshift(x) in testa',
      },
      deepDiveRef: DD,
    };
  },
};

export const arraysBasicsTemplates: QuestionTemplate[] = [
  pushLenPo,
  indexPo,
  offByFb,
  popMc,
  includesBm,
  pushFg,
];
