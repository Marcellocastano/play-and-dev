import type { QuestionTemplate } from '@lg/core';
import {
  defineTemplate,
  defineTrueFalse,
  fmt,
  pickInt,
  pickName,
  pickOf,
  shuffle,
} from '../helpers.js';

const TOPIC = 'comparisons';

const strictPo = defineTemplate(
  {
    id: 'cmp-strict-po',
    topicId: TOPIC,
    subtopicId: 'comparisons-strict',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['==='],
    tags: ['confronti'],
  },
  (rng) => {
    const v = pickInt(rng, 1, 99);
    const code = `console.log(${v} === '${v}');`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: 'false',
        why: `\`===\` non converte i tipi: il numero ${v} e la stringa '${v}' hanno tipi diversi, quindi il confronto restituisce false.`,
      },
      distractors: [
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
      short: `=== non converte i tipi: number ≠ string → false.`,
      whyCorrect: "L'uguaglianza stretta richiede stesso tipo e stesso valore.",
      concept: 'Uguaglianza stretta ===',
      commonMistake: 'Aspettarsi la conversione automatica come con ==.',
      example: '5 === "5" // false; 5 == "5" // true',
    };
  },
);

const looseVsStrictCmp = defineTemplate(
  {
    id: 'cmp-loose-vs-strict',
    topicId: TOPIC,
    subtopicId: 'comparisons-loose',
    type: 'compare',
    difficulty: 'medium',
    skills: ['==', '==='],
    tags: ['confronti'],
  },
  (rng) => {
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
    return {
      prompt: 'Quale di queste espressioni vale true?',
      correct: { text: correct.text, why: correct.why },
      distractors: distractors.map((d) => ({ text: d.text, why: d.why })),
      short: `${correct.text} vale true.`,
      whyCorrect: correct.why,
      concept: 'Uguaglianza debole vs stretta',
      commonMistake: 'Dimenticare che == converte i tipi.',
      example: '5 == "5" // true; 5 === "5" // false',
    };
  },
);

const strOrderMc = defineTemplate(
  {
    id: 'cmp-str-order-mc',
    topicId: TOPIC,
    subtopicId: 'comparisons-order',
    type: 'multiple-choice',
    difficulty: 'medium',
    skills: ['<', '>', 'stringhe'],
    tags: ['confronti', 'stringhe'],
  },
  (rng) => {
    const letters = 'abcdefgh';
    const i = pickInt(rng, 0, letters.length - 2);
    const a = letters[i]!;
    const b = letters[pickInt(rng, i + 1, letters.length - 1)]!;
    const correct = a < b; // sempre true per costruzione
    void correct;
    return {
      prompt: `Quanto vale \`'${a}' < '${b}'\`?`,
      correct: {
        text: 'true',
        why: `'${b}' viene dopo '${a}' in ordine alfabetico: '${a}' < '${b}' è true.`,
      },
      distractors: [
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
      short: `Le stringhe si confrontano carattere per carattere: '${a}' < '${b}' → true.`,
      whyCorrect: `'${a}' precede '${b}' in ordine lessicografico.`,
      concept: 'Confronto lessicografico tra stringhe',
      commonMistake: 'Pensare che < non funzioni sulle stringhe.',
      example: "'b' > 'a' // true; '10' < '9' // true (carattere per carattere!)",
    };
  },
);

const assignFb = defineTemplate(
  {
    id: 'cmp-assign-fb',
    topicId: TOPIC,
    subtopicId: 'comparisons-strict',
    type: 'find-the-bug',
    difficulty: 'easy',
    skills: ['=', '==='],
    tags: ['confronti', 'bug'],
  },
  (rng) => {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `let ${name} = ${pickInt(rng, 10, 99)};\nif (${name} = ${v}) {\n  console.log('uguale');\n}`;
    return {
      prompt: `L'intento era stampare 'uguale' solo se ${name} vale ${v}, ma il blocco si esegue sempre. Qual è il bug?`,
      code: code,
      correct: {
        text: '`=`, non `===`, nella condizione',
        why: `\`if (${name} = ${v})\` non confronta: assegna ${v} a ${name} e valuta il risultato, che è truthy. Il blocco si esegue sempre; serviva \`===\`.`,
      },
      distractors: [
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
      short: `= in una condizione assegna e valuta il valore assegnato (${v}, truthy).`,
      whyCorrect: `Il confronto corretto è if (${name} === ${v}).`,
      concept: 'Assegnazione vs confronto in una condizione',
      commonMistake: 'Il classico = invece di === dentro un if.',
      example: 'if (x === 5) confronta; if (x = 5) assegna',
    };
  },
);

const numStrPo = defineTemplate(
  {
    id: 'cmp-numstr-po',
    topicId: TOPIC,
    subtopicId: 'comparisons-order',
    type: 'predict-output',
    difficulty: 'hard',
    skills: ['<', 'stringhe', 'coercion'],
    tags: ['confronti', 'edge-case'],
  },
  (rng) => {
    const d2 = pickInt(rng, 2, 9);
    const d1 = pickInt(rng, 0, d2 - 1);
    const left = `${d1}${pickInt(rng, 0, 9)}`;
    const flip = rng() < 0.5;
    const [a, b] = flip ? [d2 + '', left] : [left, d2 + ''];
    const result = a < b;
    const code = `console.log('${a}' < '${b}');`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: String(result),
        why: `Il confronto tra stringhe è lessicografico: si guarda il primo carattere diverso, '${a[0]}' contro '${b[0]}', e il risultato è ${result}.`,
      },
      distractors: [
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
      short: `'10' < '9' è true: si confronta il primo carattere ('1' < '9').`,
      whyCorrect: 'Il confronto lessicografico ignora il valore numerico.',
      concept: 'Confronto lessicografico',
      commonMistake: 'Aspettarsi un confronto numerico tra stringhe di cifre.',
      example: "Per confrontare come numeri: Number('10') < Number('9') // false",
    };
  },
);

const safeEqBm = defineTemplate(
  {
    id: 'cmp-safeeq-bm',
    topicId: TOPIC,
    subtopicId: 'comparisons-strict',
    type: 'best-method',
    difficulty: 'easy',
    skills: ['==='],
    tags: ['confronti', 'best-practice'],
  },
  (rng) => {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    return {
      prompt: `Vuoi controllare se \`${name}\` vale esattamente ${v}. Quale scrittura è consigliata?`,
      correct: {
        text: `${name} === ${v}`,
        why: `\`${name} === ${v}\` confronta senza conversioni implicite: è vero solo se tipo e valore coincidono, quindi è la scrittura prevedibile.`,
      },
      distractors: [
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
      short: '=== è il confronto di default in JavaScript moderno.',
      whyCorrect: 'Nessuna coercion: stesso tipo e stesso valore.',
      concept: 'Uguaglianza stretta come default',
      commonMistake: 'Usare == per "comodità" e subirne la coercion.',
      example: '0 === "0" // false — comportamento esplicito e sicuro',
    };
  },
);

export const COMPARISON_FACTS: { expr: string; value: boolean; why: string }[] = [
  {
    expr: "'5' == 5",
    value: true,
    why: "Con l'uguaglianza debole la stringa '5' viene convertita nel numero 5 prima del confronto: i due valori risultano uguali.",
  },
  {
    expr: "'5' === 5",
    value: false,
    why: "L'uguaglianza stretta non converte i tipi: una stringa e un numero sono tipi diversi, quindi il confronto fallisce.",
  },
  {
    expr: 'null == undefined',
    value: true,
    why: 'Esiste una regola speciale: con == null e undefined sono considerati uguali tra loro, ma a nessun altro valore.',
  },
  {
    expr: 'null === undefined',
    value: false,
    why: 'Con === i tipi devono coincidere: null e undefined sono due tipi distinti, quindi il confronto stretto dà false.',
  },
  {
    expr: 'NaN === NaN',
    value: false,
    why: "NaN è l'unico valore diverso da sé stesso: per verificarlo serve Number.isNaN, mai un confronto.",
  },
  {
    expr: '[] == false',
    value: true,
    why: 'Con == entrambi i lati vengono convertiti: [] diventa la stringa vuota e poi 0, e anche false diventa 0.',
  },
  {
    expr: "'b' > 'a'",
    value: true,
    why: 'Le stringhe si confrontano carattere per carattere in ordine Unicode: b viene dopo a, quindi il risultato è true.',
  },
  {
    expr: "'10' < '9'",
    value: true,
    why: 'Il confronto è lessicografico, non numerico: il primo carattere 1 precede 9, quindi "10" è minore di "9".',
  },
  {
    expr: "0 == ''",
    value: true,
    why: 'La stringa vuota convertita in numero vale 0: con == i due lati convergono allo stesso valore numerico.',
  },
  {
    expr: 'null == 0',
    value: false,
    why: 'La regola speciale lega null solo a undefined: con qualunque numero, 0 incluso, il confronto debole dà false.',
  },
  {
    expr: 'Object.is(NaN, NaN)',
    value: true,
    why: 'Object.is usa la semantica SameValue che tratta NaN come uguale a sé stesso, a differenza di ===.',
  },
  {
    expr: '[1] === [1]',
    value: false,
    why: 'Due array letterali sono due oggetti distinti in memoria: === confronta i riferimenti, non il contenuto.',
  },
  {
    expr: 'undefined == null',
    value: true,
    why: 'La stessa regola speciale vale in entrambi i sensi: undefined e null sono uguali con ==.',
  },
  {
    expr: "[] === ''",
    value: false,
    why: 'Un array e una stringa hanno tipi diversi: === non converte mai, quindi il risultato è false.',
  },
];

const compareFactsTf = defineTrueFalse(
  {
    id: 'cmp-facts-tf',
    topicId: TOPIC,
    subtopicId: 'comparisons-loose',
    type: 'true-false',
    difficulty: 'medium',
    skills: ['==', '===', 'coercion'],
    tags: ['confronti', 'coercion'],
  },
  (rng) => {
    const picked = shuffle(COMPARISON_FACTS, rng).slice(0, 5);
    return {
      prompt: 'Per ogni affermazione, indica se è vera o falsa.',
      statements: picked.map((p) => {
        const claimed = rng() < 0.5;
        return {
          text: `\`${p.expr}\` restituisce \`${claimed}\``,
          value: claimed === p.value,
          why: p.why,
        };
      }),
      short: "Ogni affermazione va valutata contro il risultato reale dell'espressione.",
      whyCorrect:
        "Il valore dell'affermazione dipende dal confronto tra il risultato dichiarato e quello prodotto davvero dall'espressione.",
      concept: 'Uguaglianza debole, stretta e confronti lessicografici',
      commonMistake: 'Confondere == (con conversione) e === (senza conversione).',
      example: "0 == '' // true, ma 0 === '' // false",
    };
  },
);

export const comparisonsTemplates: QuestionTemplate[] = [
  strictPo,
  looseVsStrictCmp,
  strOrderMc,
  assignFb,
  numStrPo,
  safeEqBm,
  compareFactsTf,
];
