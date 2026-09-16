import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickInts, retry, type Rng } from '../helpers.js';

const TOPIC = 'loops';
const DD = 'dd-loops';

const forCountPo: QuestionTemplate = {
  id: 'loop-for-po',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['for'],
  tags: ['cicli'],
  generate(rng: Rng) {
    return retry(() => {
      const start = pickInt(rng, 0, 2);
      const n = pickInt(rng, 3, 6);
      const lines = Array.from({ length: n - start }, (_, i) => i + start).join('\n');
      const code = `for (let i = ${start}; i < ${n}; i++) {\n  console.log(i);\n}`;
      const built = makeOptions(
        rng,
        {
          text: lines,
          why: `Il ciclo parte da i = ${start} e si ferma quando i raggiunge ${n}: stampa i valori da ${start} a ${n - 1}, uno per riga.`,
        },
        [
          {
            text: Array.from({ length: n - start }, (_, i) => i + start + 1).join('\n'),
            why: `Il contatore parte da ${start}, non da ${start + 1}: questa sequenza è spostata di 1 in avanti.`,
          },
          {
            text: Array.from({ length: n - start + 1 }, (_, i) => i + start).join('\n'),
            why: `La condizione \`i < ${n}\` esclude ${n}: questa sequenza include una riga di troppo, come se fosse \`i <= ${n}\`.`,
          },
          {
            text: fmt(n - start),
            why: 'Il corpo stampa `i` a ogni iterazione su righe separate, non il numero totale di giri: il conteggio non viene mai stampato.',
          },
        ],
      );
      return {
        templateId: 'loop-for-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for',
        skills: ['for'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Il ciclo stampa i per i = ${start}…${n - 1}.`,
          whyCorrect: `i < ${n} ferma il ciclo prima di ${n}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Ciclo for con contatore',
          commonMistake:
            'Includere il limite superiore o partire dal valore sbagliato (off-by-one).',
          example: 'for (let i = 0; i < 3; i++) stampa 0, 1, 2',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const sumPo: QuestionTemplate = {
  id: 'loop-sum-po',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['for', 'accumulo'],
  tags: ['cicli', 'array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 1, 9, true);
      const sum = arr.reduce((s, x) => s + x, 0);
      const code = `const valori = [${arr.join(', ')}];\nlet somma = 0;\nfor (let i = 0; i < valori.length; i++) {\n  somma += valori[i];\n}\nconsole.log(somma);`;
      const built = makeOptions(
        rng,
        {
          text: fmt(sum),
          why: `Il ciclo scorre tutti gli indici validi e accumula ogni elemento: ${arr.join(' + ')} vale ${sum}.`,
        },
        [
          {
            text: fmt(sum - arr[arr.length - 1]!),
            why: `Questo risultato corrisponderebbe a fermarsi un'iterazione prima: la condizione \`i < valori.length\` include anche l'ultimo elemento ${arr[arr.length - 1]}.`,
          },
          {
            text: fmt(arr.length),
            why: `\`somma\` accumula i valori degli elementi, non il numero di iterazioni: ${arr.length} è solo quanti elementi ha l'array.`,
          },
          {
            text: fmt(arr[0]!),
            why: `\`somma\` parte da 0 e ad ogni giro aggiunge un elemento: il totale ${sum} include tutto l'array, non solo il primo valore ${arr[0]}.`,
          },
        ],
      );
      return {
        templateId: 'loop-sum-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for',
        skills: ['for'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Il ciclo accumula gli elementi: ${sum}.`,
          whyCorrect: 'somma += valori[i] per ogni indice valido.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Pattern accumulatore con for',
          commonMistake: "Fermarsi un'iterazione prima (i < length - 1).",
          example: 'Idioma equivalente: valori.reduce((s, x) => s + x, 0)',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const forOfPo: QuestionTemplate = {
  id: 'loop-forof-po',
  topicId: TOPIC,
  subtopicId: 'loops-for-of',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['for...of'],
  tags: ['cicli', 'array'],
  generate(rng: Rng) {
    return retry(() => {
      const arr = pickInts(rng, 3, 10, 60, true);
      const lines = arr.join('\n');
      const code = `const lista = [${arr.join(', ')}];\nfor (const v of lista) {\n  console.log(v);\n}`;
      const built = makeOptions(
        rng,
        {
          text: lines,
          why: `\`for...of\` scorre i valori dell'array uno a uno, nell'ordine: stampa ${arr.join(', ')} su righe separate.`,
        },
        [
          {
            text: '0\n1\n2',
            why: `\`for...of\` itera sui valori, non sugli indici: gli indici 0, 1, 2 non compaiono mai nell'output.`,
          },
          {
            text: fmt(arr),
            why: "Ogni `console.log` riceve un singolo valore e stampa una riga: l'array intero non viene mai stampato in una volta.",
          },
          {
            text: arr.slice().reverse().join('\n'),
            why: `\`for...of\` percorre l'array in avanti, dal primo elemento all'ultimo: l'ordine resta ${arr.join(', ')}.`,
          },
        ],
      );
      return {
        templateId: 'loop-forof-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'loops-for-of',
        skills: ['for...of'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: "for...of stampa ogni valore dell'array su una riga.",
          whyCorrect: `v assume ${arr.join(', ')} in sequenza.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'for...of sugli array',
          commonMistake: 'Confondere for...of (valori) con for...in (chiavi/indici).',
          example: 'for (const c of "abc") stampa a, b, c',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const offByFb: QuestionTemplate = {
  id: 'loop-offby-fb',
  topicId: TOPIC,
  subtopicId: 'loops-for',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['for', 'indici'],
  tags: ['cicli', 'bug'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const code = `const a = [${arr.join(', ')}];\nfor (let i = 0; i <= a.length; i++) {\n  console.log(a[i]);\n}`;
    const built = makeOptions(
      rng,
      {
        text: '`<=` scorre un indice di troppo',
        why: `Con \`i <= a.length\` l'ultimo giro accede a \`a[${arr.length}]\`, che non esiste perché gli indici validi sono 0…${arr.length - 1}: da qui la riga undefined.`,
      },
      [
        {
          text: '`i++` salta un elemento',
          why: `\`i++\` avanza di un indice alla volta, che è il comportamento corretto: il problema è \`<=\`, che ammette i = ${arr.length}.`,
        },
        {
          text: '`a[i]` va scritto `a.i`',
          why: `\`a.i\` cercherebbe la proprietà letterale "i", non l'elemento in posizione i: \`a[i]\` è la scrittura corretta.`,
        },
        {
          text: 'Il ciclo deve partire da `i = 1`',
          why: `Gli indici degli array partono da 0: partendo da 1 si salterebbe il primo elemento ${arr[0]}, e il problema resterebbe.`,
        },
      ],
    );
    return {
      templateId: 'loop-offby-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'loops-for',
      skills: ['for'],
      prompt:
        'Questo codice stampa gli elementi ma produce una riga "undefined" in più. Qual è il bug?',
      code,
      ...built,
      explanation: {
        short: `Con <= si arriva a i = ${arr.length}, fuori dagli indici validi 0…${arr.length - 1}.`,
        whyCorrect: 'La condizione corretta è i < a.length.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Off-by-one nei cicli su array',
        commonMistake: 'Usare <= length invece di < length.',
        example: 'Ultimo indice = arr.length - 1',
      },
      deepDiveRef: DD,
    };
  },
};

const whileFg: QuestionTemplate = {
  id: 'loop-while-fg',
  topicId: TOPIC,
  subtopicId: 'loops-while',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['while'],
  tags: ['cicli'],
  generate(rng: Rng) {
    const start = pickInt(rng, 0, 2);
    const n = pickInt(rng, 3, 7);
    const expected = Array.from({ length: n - start }, (_, i) => i + start).join(', ');
    const code = `let i = ${start};\nwhile (i ___ ${n}) {\n  console.log(i);\n  i++;\n}`;
    const built = makeOptions(
      rng,
      {
        text: '<',
        why: `Con \`i < ${n}\` il corpo gira per i = ${start}…${n - 1} e stampa esattamente ${expected}.`,
      },
      [
        {
          text: '<=',
          why: `Con \`i <= ${n}\` il ciclo eseguirebbe un giro in più e stamperebbe anche ${n}, che non è richiesto.`,
        },
        {
          text: '>',
          why: `Con i = ${start}, la condizione \`i > ${n}\` è falsa fin dal primo controllo: il corpo non verrebbe mai eseguito.`,
        },
        {
          text: '==',
          why: `Con i = ${start}, \`i == ${n}\` è falso all'ingresso: il ciclo non partirebbe e non verrebbe stampato nulla.`,
        },
      ],
    );
    return {
      templateId: 'loop-while-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'loops-while',
      skills: ['while'],
      prompt: `Completa affinché il codice stampi ${expected}.`,
      code,
      ...built,
      explanation: {
        short: `while (i < ${n}) ripete finché i è minore di ${n}.`,
        whyCorrect: 'Con < si stampano 0…n-1.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Condizione del while',
        commonMistake: 'Usare <= e stampare un valore in più.',
        example: 'while (i < 3) con i++ stampa 0, 1, 2',
      },
      deepDiveRef: DD,
    };
  },
};

const forOfCmp: QuestionTemplate = {
  id: 'loop-forof-cmp',
  topicId: TOPIC,
  subtopicId: 'loops-for-of',
  type: 'compare',
  difficulty: 'medium',
  skills: ['for...of', 'for'],
  tags: ['cicli'],
  generate(rng: Rng) {
    const arr = pickInts(rng, 3, 1, 9, true);
    const built = makeOptions(
      rng,
      {
        text: '`of` → valori, `in` → indici',
        why: `\`for...of\` scorre i valori ${arr.join(', ')}; \`for...in\` scorre le chiavi, cioè gli indici '0', '1', '2' come stringhe.`,
      },
      [
        {
          text: '`of` → indici, `in` → valori',
          why: `Il comportamento è l'esatto contrario: \`of\` dà i valori ${arr.join(', ')}, \`in\` dà le chiavi '0', '1', '2'.`,
        },
        {
          text: '`of` e `in` danno i valori',
          why: `\`for...in\` non dà i valori: su un array produce gli indici come stringhe ('0', '1', '2'), non ${arr.join(', ')}.`,
        },
        {
          text: '`of` e `in` danno gli indici',
          why: `\`for...of\` non dà gli indici: produce direttamente i valori ${arr.join(', ')}, senza modo di risalire alla posizione.`,
        },
      ],
    );
    return {
      templateId: 'loop-forof-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'loops-for-of',
      skills: ['for...of'],
      prompt: `Con \`const lista = [${arr.join(', ')}]\`, cosa scorrono \`for (const v of lista)\` e \`for (const k in lista)\`?`,
      ...built,
      explanation: {
        short:
          "for...of per i valori; for classico quando serve l'indice o il controllo del passo.",
        whyCorrect: "Il for classico permette i, i += 2, cicli all'indietro ecc.",
        whyOthersWrong: built.whyOthersWrong,
        concept: 'for vs for...of',
        commonMistake: "Usare for...of e poi cercare l'indice con indexOf.",
        example: 'for (const v of arr) vs for (let i = 0; i < arr.length; i++)',
      },
      deepDiveRef: DD,
    };
  },
};

export const loopsTemplates: QuestionTemplate[] = [
  forCountPo,
  sumPo,
  forOfPo,
  offByFb,
  whileFg,
  forOfCmp,
];
