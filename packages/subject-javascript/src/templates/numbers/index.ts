import type { QuestionTemplate } from '@lg/core';
import { defineTemplate, fmt, pickInt, pickOf } from '../helpers.js';

const TOPIC = 'numbers';

const modPo = defineTemplate(
  {
    id: 'num-mod-po',
    topicId: TOPIC,
    subtopicId: 'numbers-arithmetic',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['%'],
    tags: ['numeri'],
  },
  (rng) => {
    const b = pickInt(rng, 2, 6);
    const a = pickInt(rng, b + 1, b * 4);
    const code = `console.log(${a} % ${b});`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(a % b),
        why: `\`%\` è l'operatore resto: ${a} diviso ${b} fa ${Math.floor(a / b)} con resto ${a % b}, e il log stampa ${a % b}.`,
      },
      distractors: [
        {
          text: fmt(Math.floor(a / b)),
          why: `${Math.floor(a / b)} è il quoziente intero di ${a} / ${b}: \`%\` invece restituisce quanto avanza dalla divisione, cioè ${a % b}.`,
        },
        {
          text: fmt(b % a),
          why: `Questo sarebbe il risultato di \`${b} % ${a}\`, cioè il resto con gli operandi scambiati: il codice calcola ${a} % ${b}.`,
        },
        {
          text: fmt(a - b),
          why: `La sottrazione non è il resto: ${a} - ${b} vale ${a - b}, mentre il resto di ${a} / ${b} è ${a % b}.`,
        },
      ],
      short: `% è l'operatore resto: ${a} % ${b} vale ${a % b}.`,
      whyCorrect: `${a} diviso ${b} fa ${Math.floor(a / b)} con resto ${a % b}.`,
      concept: 'Operatore modulo (resto)',
      commonMistake: 'Confondere il resto con il quoziente.',
      example: '10 % 3 // 1',
    };
  },
);

const powPo = defineTemplate(
  {
    id: 'num-pow-po',
    topicId: TOPIC,
    subtopicId: 'numbers-arithmetic',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['**'],
    tags: ['numeri'],
  },
  (rng) => {
    const a = pickInt(rng, 2, 5);
    const e = pickInt(rng, 2, 4);
    const code = `console.log(${a} ** ${e});`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(a ** e),
        why: `\`**\` è l'operatore di potenza: ${a} moltiplicato per sé stesso ${e} volte dà ${a ** e}.`,
      },
      distractors: [
        {
          text: fmt(a * e),
          why: `${a * e} è il risultato di ${a} * ${e}, una moltiplicazione: la potenza ripete la moltiplicazione di ${a} per ${e} volte e dà ${a ** e}.`,
        },
        {
          text: fmt(e ** a),
          why: `Questo risultato inverte base ed esponente: il codice calcola ${a} ** ${e} (base ${a}), non ${e} ** ${a}.`,
        },
        {
          text: fmt(a * a),
          why:
            e === 2
              ? `Coinciderebbe col quadrato di ${a}, ma l'esponente del codice non è 2: ${a} ** ${e} vale ${a ** e}.`
              : `${a} * ${a} è solo il quadrato di ${a}: l'esponente ${e} richiede ${e} moltiplicazioni, e ${a} ** ${e} vale ${a ** e}.`,
        },
      ],
      short: `** è l'operatore di potenza: ${a} ** ${e} = ${a ** e}.`,
      whyCorrect: `${a} moltiplicato per sé stesso ${e} volte dà ${a ** e}.`,
      concept: 'Operatore di potenza **',
      commonMistake: 'Confondere ** con * (moltiplicazione).',
      example: '2 ** 3 // 8',
    };
  },
);

const floorPo = defineTemplate(
  {
    id: 'num-floor-po',
    topicId: TOPIC,
    subtopicId: 'numbers-math',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['Math.floor', 'divisione'],
    tags: ['numeri', 'Math'],
  },
  (rng) => {
    const b = pickInt(rng, 2, 5);
    const a = pickInt(rng, b + 1, b * 4 - 1);
    const code = `console.log(Math.floor(${a} / ${b}));`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(Math.floor(a / b)),
        why: `\`Math.floor\` arrotonda sempre verso il basso: ${a} / ${b} vale ${a / b}, quindi il log stampa ${Math.floor(a / b)}.`,
      },
      distractors: [
        {
          text: fmt(Math.round(a / b)),
          why: `${Math.round(a / b)} sarebbe il risultato di \`Math.round\`, che va all'intero più vicino: \`Math.floor\` scarta sempre la parte decimale e dà ${Math.floor(a / b)}.`,
        },
        {
          text: fmt(a / b),
          why: `\`Math.floor\` elimina la parte decimale di ${a / b}: il risultato stampato è un intero (${Math.floor(a / b)}), non il quoziente esatto.`,
        },
        {
          text: fmt(a % b),
          why: `${a % b} è il resto di ${a} % ${b}: qui invece si calcola il quoziente della divisione, arrotondato per difetto.`,
        },
      ],
      short: `Math.floor(${a} / ${b}) arrotonda ${(a / b).toFixed(2)}… verso il basso: ${Math.floor(a / b)}.`,
      whyCorrect: "floor va sempre all'intero inferiore, anche con decimali alti.",
      concept: 'Math.floor vs Math.round',
      commonMistake: 'Pensare che floor arrotondi al più vicino: tronca sempre.',
      example: 'Math.floor(4.9) // 4',
    };
  },
);

const nanMc = defineTemplate(
  {
    id: 'num-nan-mc',
    topicId: TOPIC,
    subtopicId: 'numbers-conversion',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['NaN'],
    tags: ['numeri', 'NaN'],
  },
  (rng) => {
    const word = pickOf(rng, ['ciao', 'abc', 'test']);
    const n = pickInt(rng, 2, 9);
    return {
      prompt: `Quanto vale \`'${word}' * ${n}\`?`,
      correct: {
        text: 'NaN',
        why: `Moltiplicare una stringa non numerica per ${n} è un'operazione impossibile: il risultato è NaN.`,
      },
      distractors: [
        {
          text: `'${word}${n}'`,
          why: `La concatenazione di stringhe avviene solo con \`+\`: \`*\` tenta sempre una moltiplicazione, e '${word}' non è convertibile in numero.`,
        },
        {
          text: '0',
          why: "Un'operazione numerica impossibile non restituisce 0: JavaScript segnala il fallimento con il valore speciale NaN.",
        },
        {
          text: 'undefined',
          why: "L'espressione produce comunque un valore: quando una moltiplicazione non ha senso numerico il risultato è NaN, non undefined.",
        },
      ],
      short: `'${word}' * ${n} non si può calcolare: JavaScript restituisce NaN.`,
      whyCorrect: 'NaN (Not a Number) è il risultato delle operazioni numeriche impossibili.',
      concept: 'NaN',
      commonMistake: "Aspettarsi un errore: NaN è un valore, non un'eccezione.",
      example: "'x' * 2 // NaN; typeof NaN // 'number'",
    };
  },
);

const coerceFb = defineTemplate(
  {
    id: 'num-coerce-fb',
    topicId: TOPIC,
    subtopicId: 'numbers-conversion',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['coercion', 'conversione'],
    tags: ['numeri', 'bug'],
  },
  (rng) => {
    const s = String(pickInt(rng, 1, 9));
    const n = pickInt(rng, 1, 9);
    const code = `let totale = '${s}' + ${n};\nconsole.log(totale);`;
    return {
      prompt: `Questo codice dovrebbe stampare ${Number(s) + n} ma stampa '${s + n}'. Qual è il bug?`,
      code: code,
      correct: {
        text: '`+` concatena invece di sommare',
        why: `Con un operando stringa, \`+\` concatena invece di sommare: \`'${s}' + ${n}\` produce '${s + n}'. Per ottenere ${Number(s) + n} serviva \`Number('${s}') + ${n}\`.`,
      },
      distractors: [
        {
          text: '`let` converte tutto in stringa',
          why: `\`let\` non converte i valori: la colpa è di \`+\`, che con un operando stringa concatena. Con \`const\` il risultato sarebbe identico.`,
        },
        {
          text: `Serve \`${n} + '${s}'\`: l'ordine conta`,
          why: `L'ordine degli operandi non cambia nulla: appena \`+\` trova una stringa concatena, quindi anche \`${n} + '${s}'\` darebbe '${n + s}'.`,
        },
        {
          text: 'Manca `Number()` attorno a `totale`',
          why: `La concatenazione avviene già dentro l'espressione \`'${s}' + ${n}\`: convertire dopo non aiuterebbe, serviva convertire '${s}' prima della somma.`,
        },
      ],
      short: `+ con una stringa concatena: '${s}' + ${n} vale '${s + n}'.`,
      whyCorrect: `Per sommare serve convertire: Number('${s}') + ${n} = ${Number(s) + n}.`,
      concept: "Coercion con l'operatore +",
      commonMistake: 'Sommare valori letti come stringhe senza convertirli.',
      example: "Number('5') + 3 // 8",
    };
  },
);

const roundBm = defineTemplate(
  {
    id: 'num-round-bm',
    topicId: TOPIC,
    subtopicId: 'numbers-math',
    type: 'best-method',
    difficulty: 'easy',
    skills: ['Math.round'],
    tags: ['numeri', 'best-practice'],
  },
  (rng) => {
    const v = pickInt(rng, 15, 95) / 10;
    return {
      prompt: `Vuoi arrotondare ${v} all'intero più vicino e ti serve un numero, non una stringa. Quale metodo usi?`,
      correct: {
        text: `Math.round(${v})`,
        why: `\`Math.round\` arrotonda all'intero più vicino e restituisce un numero: ${v} diventa ${Math.round(v)}.`,
      },
      distractors: [
        {
          text: `Math.floor(${v})`,
          why: `\`Math.floor\` arrotonda sempre per difetto, anche quando il decimale è alto: darebbe ${Math.floor(v)} invece di ${Math.round(v)}.`,
        },
        {
          text: `Math.ceil(${v})`,
          why: `\`Math.ceil\` arrotonda sempre per eccesso: darebbe ${Math.ceil(v)}, mentre l'intero più vicino a ${v} è ${Math.round(v)}.`,
        },
        {
          text: `(${v}).toFixed(0)`,
          why: `\`toFixed(0)\` restituisce la stringa '${v.toFixed(0)}', non un numero: lo scenario richiede esplicitamente un valore numerico.`,
        },
      ],
      short: `Math.round(${v}) restituisce ${Math.round(v)}.`,
      whyCorrect: "round va all'intero più vicino; floor, ceil e trunc hanno regole diverse.",
      concept: 'Metodi di arrotondamento di Math',
      commonMistake: 'Confondere round (più vicino), floor (giù), ceil (su) e trunc (taglia).',
      example: 'Math.round(4.5) // 5; Math.floor(4.9) // 4',
    };
  },
);

export const numbersTemplates: QuestionTemplate[] = [
  modPo,
  powPo,
  floorPo,
  nanMc,
  coerceFb,
  roundBm,
];
