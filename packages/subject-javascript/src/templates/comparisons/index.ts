import type { QuestionTemplate } from '@lg/core';
import {
  fmt,
  makeOptions,
  pickInt,
  pickName,
  pickOf,
  retry,
  shuffle,
  type Rng,
} from '../helpers.js';

const TOPIC = 'comparisons';
const DD = 'dd-comparisons';

const strictPo: QuestionTemplate = {
  id: 'cmp-strict-po',
  topicId: TOPIC,
  subtopicId: 'comparisons-strict',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['==='],
  tags: ['confronti'],
  generate(rng: Rng) {
    const v = pickInt(rng, 1, 99);
    const code = `console.log(${v} === '${v}');`;
    const built = makeOptions(
      rng,
      {
        text: 'false',
        why: `\`===\` non converte i tipi: il numero ${v} e la stringa '${v}' hanno tipi diversi, quindi il confronto restituisce false.`,
      },
      [
        {
          text: 'true',
          why: `Sarebbe true solo con \`==\`, che converte '${v}' in numero: \`===\` confronta anche il tipo e number e string sono diversi.`,
        },
        {
          text: fmt(v),
          why: `Un confronto con \`===\` restituisce un booleano (true o false), non il valore confrontato: ${v} non è un esito possibile.`,
        },
        {
          text: 'TypeError',
          why: 'Confrontare due tipi diversi non è un errore in JavaScript: `===` restituisce semplicemente false.',
        },
      ],
    );
    return {
      templateId: 'cmp-strict-po',
      type: 'predict-output',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'comparisons-strict',
      skills: ['==='],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `=== non converte i tipi: number ≠ string → false.`,
        whyCorrect: "L'uguaglianza stretta richiede stesso tipo e stesso valore.",
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Uguaglianza stretta ===',
        commonMistake: 'Aspettarsi la conversione automatica come con ==.',
        example: '5 === "5" // false; 5 == "5" // true',
      },
      deepDiveRef: DD,
    };
  },
};

const looseVsStrictCmp: QuestionTemplate = {
  id: 'cmp-loose-vs-strict',
  topicId: TOPIC,
  subtopicId: 'comparisons-loose',
  type: 'compare',
  difficulty: 'medium',
  skills: ['==', '==='],
  tags: ['confronti'],
  generate(rng: Rng) {
    return retry(() => {
      const v = pickInt(rng, 1, 9);
      const s = pickOf(rng, ['a', 'x', 'js']);
      const trueExprs = [
        {
          text: `${v} == '${v}'`,
          why: `Con \`==\` la stringa '${v}' viene convertita nel numero ${v}: il confronto è tra ${v} e ${v}, quindi true.`,
        },
        {
          text: 'null == undefined',
          why: 'Per la regola speciale di `==`, null e undefined sono considerati equivalenti: il confronto restituisce true.',
        },
        {
          text: `'${s}' === '${s}'`,
          why: `Le due stringhe hanno lo stesso tipo e lo stesso contenuto: \`===\` restituisce true.`,
        },
        {
          text: `0 == ''`,
          why: 'Con `==` la stringa vuota viene convertita nel numero 0: il confronto è tra 0 e 0, quindi true.',
        },
        {
          text: `${v} === ${v}`,
          why: `I due operandi sono identici in tipo e in valore: \`===\` restituisce true.`,
        },
      ];
      const falseExprs = [
        {
          text: `${v} === '${v}'`,
          why: `\`===\` non converte i tipi: number e string sono diversi, quindi il confronto restituisce false.`,
        },
        {
          text: 'null === undefined',
          why: 'Il confronto stretto distingue i tipi: null e undefined sono diversi, quindi `===` restituisce false.',
        },
        {
          text: `0 === ''`,
          why: `Il confronto stretto non converte la stringa vuota in numero: number e string sono tipi diversi e \`===\` dà false.`,
        },
        {
          text: `'${v}' === ${v}`,
          why: `\`===\` non converte i tipi: la stringa '${v}' e il numero ${v} restano diversi, quindi false.`,
        },
        {
          text: `NaN === NaN`,
          why: 'NaN è l’unico valore non uguale a sé stesso in JavaScript: il confronto restituisce sempre false.',
        },
      ];
      const correct = pickOf(rng, trueExprs);
      const distractors = shuffle(falseExprs, rng).slice(0, 3);
      const built = makeOptions(
        rng,
        { text: correct.text, why: correct.why },
        distractors.map((d) => ({ text: d.text, why: d.why })),
      );
      return {
        templateId: 'cmp-loose-vs-strict',
        type: 'compare',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'comparisons-loose',
        skills: ['==', '==='],
        prompt: 'Quale di queste espressioni vale true?',
        ...built,
        explanation: {
          short: `${correct.text} vale true.`,
          whyCorrect: correct.why,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Uguaglianza debole vs stretta',
          commonMistake: 'Dimenticare che == converte i tipi.',
          example: '5 == "5" // true; 5 === "5" // false',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const strOrderMc: QuestionTemplate = {
  id: 'cmp-str-order-mc',
  topicId: TOPIC,
  subtopicId: 'comparisons-order',
  type: 'multiple-choice',
  difficulty: 'medium',
  skills: ['<', '>', 'stringhe'],
  tags: ['confronti', 'stringhe'],
  generate(rng: Rng) {
    return retry(() => {
      const letters = 'abcdefgh';
      const i = pickInt(rng, 0, letters.length - 2);
      const a = letters[i]!;
      const b = letters[pickInt(rng, i + 1, letters.length - 1)]!;
      const correct = a < b; // sempre true per costruzione
      const built = makeOptions(
        rng,
        {
          text: 'true',
          why: `'${b}' viene dopo '${a}' in ordine alfabetico: '${a}' < '${b}' è true.`,
        },
        [
          {
            text: 'false',
            why: `Il confronto lessicografico parte dal primo carattere: '${a}' viene prima di '${b}' nell'ordine dei caratteri, quindi il risultato è true.`,
          },
          {
            text: 'TypeError',
            why: 'Confrontare due stringhe con `<` è perfettamente lecito in JavaScript: non viene lanciato alcun errore.',
          },
          {
            text: 'NaN',
            why: 'Un confronto con `<` restituisce sempre un booleano (true o false): NaN non è un esito possibile.',
          },
        ],
      );
      void correct;
      return {
        templateId: 'cmp-str-order-mc',
        type: 'multiple-choice',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'comparisons-order',
        skills: ['<', 'stringhe'],
        prompt: `Quanto vale \`'${a}' < '${b}'\`?`,
        ...built,
        explanation: {
          short: `Le stringhe si confrontano carattere per carattere: '${a}' < '${b}' → true.`,
          whyCorrect: `'${a}' precede '${b}' in ordine lessicografico.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Confronto lessicografico tra stringhe',
          commonMistake: 'Pensare che < non funzioni sulle stringhe.',
          example: "'b' > 'a' // true; '10' < '9' // true (carattere per carattere!)",
        },
        deepDiveRef: DD,
      };
    });
  },
};

const assignFb: QuestionTemplate = {
  id: 'cmp-assign-fb',
  topicId: TOPIC,
  subtopicId: 'comparisons-strict',
  type: 'find-the-bug',
  difficulty: 'easy',
  skills: ['=', '==='],
  tags: ['confronti', 'bug'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `let ${name} = ${pickInt(rng, 10, 99)};\nif (${name} = ${v}) {\n  console.log('uguale');\n}`;
    const built = makeOptions(
      rng,
      {
        text: '`=`, non `===`, nella condizione',
        why: `\`if (${name} = ${v})\` non confronta: assegna ${v} a ${name} e valuta il risultato, che è truthy. Il blocco si esegue sempre; serviva \`===\`.`,
      },
      [
        {
          text: `\`${name}\` va confrontato con \`'${v}'\``,
          why: `Il problema non è il tipo del valore ma l'operatore: anche \`if (${name} === '${v}')\` confronta, mentre \`=\` assegna ${v} a prescindere.`,
        },
        {
          text: '`if` non accetta numeri',
          why: `\`if\` accetta qualunque valore e ne valuta la veridicità: il bug è che \`=\` assegna ${v} (truthy) invece di confrontare.`,
        },
        {
          text: 'Manca il ramo `else`',
          why: 'Il ramo `else` è opzionale: il bug è la `=` dentro la condizione, che assegna invece di confrontare e rende il blocco sempre eseguito.',
        },
      ],
    );
    return {
      templateId: 'cmp-assign-fb',
      type: 'find-the-bug',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'comparisons-strict',
      skills: ['==='],
      prompt: `L'intento era stampare 'uguale' solo se ${name} vale ${v}, ma il blocco si esegue sempre. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: `= in una condizione assegna e valuta il valore assegnato (${v}, truthy).`,
        whyCorrect: `Il confronto corretto è if (${name} === ${v}).`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Assegnazione vs confronto in una condizione',
        commonMistake: 'Il classico = invece di === dentro un if.',
        example: 'if (x === 5) confronta; if (x = 5) assegna',
      },
      deepDiveRef: DD,
    };
  },
};

const numStrPo: QuestionTemplate = {
  id: 'cmp-numstr-po',
  topicId: TOPIC,
  subtopicId: 'comparisons-order',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['<', 'stringhe', 'coercion'],
  tags: ['confronti', 'edge-case'],
  generate(rng: Rng) {
    // confronto lessicografico: il risultato numerico "atteso" è diverso da quello stringa
    const d2 = pickInt(rng, 2, 9); // seconda stringa a una cifra
    const d1 = pickInt(rng, 0, d2 - 1); // prima cifra della prima stringa, < d2
    const left = `${d1}${pickInt(rng, 0, 9)}`; // es. '1x' con x qualsiasi
    const flip = rng() < 0.5;
    const [a, b] = flip ? [d2 + '', left] : [left, d2 + ''];
    const result = a < b; // sempre vero nella costruzione: 'd1x' < 'd2' lessicografico? attenzione: '10'<'9'→true; se flip, '9'<'1x'→false
    const code = `console.log('${a}' < '${b}');`;
    const built = makeOptions(
      rng,
      {
        text: String(result),
        why: `Il confronto tra stringhe è lessicografico: si guarda il primo carattere diverso, '${a[0]}' contro '${b[0]}', e il risultato è ${result}.`,
      },
      [
        {
          text: String(!result),
          why: `Il confronto non guarda il valore numerico delle stringhe: decide il primo carattere, '${a[0]}' contro '${b[0]}', e dà ${result}.`,
        },
        {
          text: 'TypeError',
          why: 'Confrontare due stringhe con `<` è perfettamente lecito: non viene lanciato alcun errore.',
        },
        {
          text: 'undefined',
          why: 'Un confronto con `<` produce sempre un booleano: l’espressione non può restituire undefined.',
        },
      ],
    );
    return {
      templateId: 'cmp-numstr-po',
      type: 'predict-output',
      difficulty: 'hard' as const,
      topicId: TOPIC,
      subtopicId: 'comparisons-order',
      skills: ['<', 'stringhe'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: `'10' < '9' è true: si confronta il primo carattere ('1' < '9').`,
        whyCorrect: 'Il confronto lessicografico ignora il valore numerico.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Confronto lessicografico',
        commonMistake: 'Aspettarsi un confronto numerico tra stringhe di cifre.',
        example: "Per confrontare come numeri: Number('10') < Number('9') // false",
      },
      deepDiveRef: DD,
    };
  },
};

const safeEqBm: QuestionTemplate = {
  id: 'cmp-safeeq-bm',
  topicId: TOPIC,
  subtopicId: 'comparisons-strict',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['==='],
  tags: ['confronti', 'best-practice'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const built = makeOptions(
      rng,
      {
        text: `${name} === ${v}`,
        why: `\`${name} === ${v}\` confronta senza conversioni implicite: è vero solo se tipo e valore coincidono, quindi è la scrittura prevedibile.`,
      },
      [
        {
          text: `${name} == ${v}`,
          why: `\`==\` converte i tipi prima di confrontare: \`5 == '5'\` darebbe true anche con tipi diversi, una fonte classica di bug.`,
        },
        {
          text: `${name} = ${v}`,
          why: `\`=\` è assegnazione: cambierebbe il valore di ${name} invece di confrontarlo, e in una condizione valuterebbe ${v}.`,
        },
        {
          text: `${name}.equals(${v})`,
          why: 'In JavaScript non esiste un metodo `.equals()` (è tipico di Java): la chiamata lancerebbe un TypeError.',
        },
      ],
    );
    return {
      templateId: 'cmp-safeeq-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'comparisons-strict',
      skills: ['==='],
      prompt: `Vuoi controllare se \`${name}\` vale esattamente ${v}. Quale scrittura è consigliata?`,
      ...built,
      explanation: {
        short: '=== è il confronto di default in JavaScript moderno.',
        whyCorrect: 'Nessuna coercion: stesso tipo e stesso valore.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Uguaglianza stretta come default',
        commonMistake: 'Usare == per "comodità" e subirne la coercion.',
        example: '0 === "0" // false — comportamento esplicito e sicuro',
      },
      deepDiveRef: DD,
    };
  },
};

export const comparisonsTemplates: QuestionTemplate[] = [
  strictPo,
  looseVsStrictCmp,
  strOrderMc,
  assignFb,
  numStrPo,
  safeEqBm,
];
