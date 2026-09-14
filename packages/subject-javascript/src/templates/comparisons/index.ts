import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickName, pickOf, retry, shuffle, type Rng } from '../helpers.js';

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
      { text: 'false', why: `Il numero ${v} e la stringa '${v}' hanno tipi diversi: === è false.` },
      [
        { text: 'true', why: 'Sarebbe true con == (con coercion), ma === confronta anche il tipo.' },
        { text: fmt(v), why: 'Il confronto restituisce un booleano, non il valore confrontato.' },
        { text: 'TypeError', why: 'Il confronto tra tipi diversi non è un errore: restituisce false.' },
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
        whyCorrect: 'L\'uguaglianza stretta richiede stesso tipo e stesso valore.',
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
  difficulty: 'easy',
  skills: ['==', '==='],
  tags: ['confronti'],
  generate(rng: Rng) {
    return retry(() => {
      const v = pickInt(rng, 1, 9);
      const s = pickOf(rng, ['a', 'x', 'js']);
      const trueExprs = [
        { text: `${v} == '${v}'`, why: '== converte la stringa in numero: true.' },
        { text: 'null == undefined', why: 'Regola speciale di ==: sono considerati uguali.' },
        { text: `'${s}' === '${s}'`, why: 'Stesso tipo e stesso valore: true.' },
        { text: `0 == ''`, why: "== converte '' in 0: true." },
        { text: `${v} === ${v}`, why: 'Identici in tipo e valore: true.' },
      ];
      const falseExprs = [
        { text: `${v} === '${v}'`, why: 'Tipi diversi (number vs string): === è false.' },
        { text: 'null === undefined', why: 'Tipi diversi: il confronto stretto è false.' },
        { text: `0 === ''`, why: "number ≠ string: === è false." },
        { text: `'${v}' === ${v}`, why: 'Tipi diversi: === non converte.' },
        { text: `NaN === NaN`, why: 'NaN non è mai uguale a sé stesso.' },
      ];
      const correct = pickOf(rng, trueExprs);
      const distractors = shuffle(falseExprs, rng).slice(0, 3);
      const built = makeOptions(
        rng,
        { text: correct.text, why: correct.why },
        distractors.map((d) => ({ text: `${d.text}  // false`, why: d.why })),
      );
      return {
        templateId: 'cmp-loose-vs-strict',
        type: 'compare',
        difficulty: 'easy' as const,
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
        { text: 'true', why: `'${b}' viene dopo '${a}' in ordine alfabetico: '${a}' < '${b}' è true.` },
        [
          { text: 'false', why: 'Le stringhe si confrontano lessicograficamente: qui il confronto è vero.' },
          { text: 'TypeError', why: 'Confrontare stringhe è lecito: nessun errore.' },
          { text: 'NaN', why: 'Il confronto restituisce un booleano, mai NaN.' },
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
        text: `Usa = (assegnazione) invece di ===: ${name} viene sovrascritta e la condizione è sempre vera`,
        why: `if (${name} = ${v}) assegna ${v} e valuta ${v} (truthy): il blocco si esegue sempre.`,
      },
      [
        { text: 'if non accetta numeri come condizione', why: 'if accetta qualunque valore: i numeri diversi da 0 sono truthy.' },
        { text: 'Manca else', why: 'else è opzionale: non è il problema qui.' },
        { text: 'console.log è sbagliato', why: 'Il console.log è corretto; è la condizione a essere buggata.' },
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
        why: `'${a}' < '${b}' si valuta carattere per carattere: '${a[0]}' vs '${b[0]}' → ${result}.`,
      },
      [
        { text: String(!result), why: 'Il confronto lessicografico guarda il primo carattere diverso, non il valore numerico.' },
        { text: 'TypeError', why: 'Confrontare due stringhe è perfettamente lecito.' },
        { text: 'undefined', why: 'Il confronto restituisce sempre un booleano.' },
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
      { text: `${name} === ${v}`, why: '=== evita conversioni implicite: il confronto è prevedibile.' },
      [
        { text: `${name} == ${v}`, why: '== converte i tipi (es. 5 == "5" è true): fonte di bug.' },
        { text: `${name} = ${v}`, why: '= è assegnazione: cambia il valore invece di confrontarlo.' },
        { text: `${name}.equals(${v})`, why: 'Il metodo .equals() non esiste in JavaScript (è di Java).' },
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
