import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, retry, type Rng } from '../helpers.js';

const TOPIC = 'numbers';
const DD = 'dd-numbers';

const modPo: QuestionTemplate = {
  id: 'num-mod-po',
  topicId: TOPIC,
  subtopicId: 'numbers-arithmetic',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['%'],
  tags: ['numeri'],
  generate(rng: Rng) {
    return retry(() => {
      const b = pickInt(rng, 2, 6);
      const a = pickInt(rng, b + 1, b * 4);
      const code = `console.log(${a} % ${b});`;
      const built = makeOptions(
        rng,
        {
          text: fmt(a % b),
          why: `\`%\` è l'operatore resto: ${a} diviso ${b} fa ${Math.floor(a / b)} con resto ${a % b}, e il log stampa ${a % b}.`,
        },
        [
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
      );
      return {
        templateId: 'num-mod-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-arithmetic',
        skills: ['%'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `% è l'operatore resto: ${a} % ${b} vale ${a % b}.`,
          whyCorrect: `${a} diviso ${b} fa ${Math.floor(a / b)} con resto ${a % b}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatore modulo (resto)',
          commonMistake: 'Confondere il resto con il quoziente.',
          example: '10 % 3 // 1',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const powPo: QuestionTemplate = {
  id: 'num-pow-po',
  topicId: TOPIC,
  subtopicId: 'numbers-arithmetic',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['**'],
  tags: ['numeri'],
  generate(rng: Rng) {
    return retry(() => {
      const a = pickInt(rng, 2, 5);
      const e = pickInt(rng, 2, 4);
      const code = `console.log(${a} ** ${e});`;
      const built = makeOptions(
        rng,
        {
          text: fmt(a ** e),
          why: `\`**\` è l'operatore di potenza: ${a} moltiplicato per sé stesso ${e} volte dà ${a ** e}.`,
        },
        [
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
      );
      return {
        templateId: 'num-pow-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-arithmetic',
        skills: ['**'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `** è l'operatore di potenza: ${a} ** ${e} = ${a ** e}.`,
          whyCorrect: `${a} moltiplicato per sé stesso ${e} volte dà ${a ** e}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatore di potenza **',
          commonMistake: 'Confondere ** con * (moltiplicazione).',
          example: '2 ** 3 // 8',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const floorPo: QuestionTemplate = {
  id: 'num-floor-po',
  topicId: TOPIC,
  subtopicId: 'numbers-math',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['Math.floor', 'divisione'],
  tags: ['numeri', 'Math'],
  generate(rng: Rng) {
    return retry(() => {
      const b = pickInt(rng, 2, 5);
      const a = pickInt(rng, b + 1, b * 4 - 1); // non multiplo esatto
      const code = `console.log(Math.floor(${a} / ${b}));`;
      const built = makeOptions(
        rng,
        {
          text: fmt(Math.floor(a / b)),
          why: `\`Math.floor\` arrotonda sempre verso il basso: ${a} / ${b} vale ${a / b}, quindi il log stampa ${Math.floor(a / b)}.`,
        },
        [
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
      );
      return {
        templateId: 'num-floor-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'numbers-math',
        skills: ['Math.floor'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Math.floor(${a} / ${b}) arrotonda ${(a / b).toFixed(2)}… verso il basso: ${Math.floor(a / b)}.`,
          whyCorrect: "floor va sempre all'intero inferiore, anche con decimali alti.",
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Math.floor vs Math.round',
          commonMistake: 'Pensare che floor arrotondi al più vicino: tronca sempre.',
          example: 'Math.floor(4.9) // 4',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const nanMc: QuestionTemplate = {
  id: 'num-nan-mc',
  topicId: TOPIC,
  subtopicId: 'numbers-conversion',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['NaN'],
  tags: ['numeri', 'NaN'],
  generate(rng: Rng) {
    const word = pickOf(rng, ['ciao', 'abc', 'test']);
    const n = pickInt(rng, 2, 9);
    const built = makeOptions(
      rng,
      {
        text: 'NaN',
        why: `Moltiplicare una stringa non numerica per ${n} è un'operazione impossibile: il risultato è NaN.`,
      },
      [
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
    );
    return {
      templateId: 'num-nan-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-conversion',
      skills: ['NaN'],
      prompt: `Quanto vale \`'${word}' * ${n}\`?`,
      ...built,
      explanation: {
        short: `'${word}' * ${n} non si può calcolare: JavaScript restituisce NaN.`,
        whyCorrect: 'NaN (Not a Number) è il risultato delle operazioni numeriche impossibili.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'NaN',
        commonMistake: "Aspettarsi un errore: NaN è un valore, non un'eccezione.",
        example: "'x' * 2 // NaN; typeof NaN // 'number'",
      },
      deepDiveRef: DD,
    };
  },
};

const coerceFb: QuestionTemplate = {
  id: 'num-coerce-fb',
  topicId: TOPIC,
  subtopicId: 'numbers-conversion',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['coercion', 'conversione'],
  tags: ['numeri', 'bug'],
  generate(rng: Rng) {
    const s = String(pickInt(rng, 1, 9));
    const n = pickInt(rng, 1, 9);
    const code = `let totale = '${s}' + ${n};\nconsole.log(totale);`;
    const built = makeOptions(
      rng,
      {
        text: '`+` concatena invece di sommare',
        why: `Con un operando stringa, \`+\` concatena invece di sommare: \`'${s}' + ${n}\` produce '${s + n}'. Per ottenere ${Number(s) + n} serviva \`Number('${s}') + ${n}\`.`,
      },
      [
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
    );
    return {
      templateId: 'num-coerce-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-conversion',
      skills: ['coercion'],
      prompt: `Questo codice dovrebbe stampare ${Number(s) + n} ma stampa '${s + n}'. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: `+ con una stringa concatena: '${s}' + ${n} vale '${s + n}'.`,
        whyCorrect: `Per sommare serve convertire: Number('${s}') + ${n} = ${Number(s) + n}.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: "Coercion con l'operatore +",
        commonMistake: 'Sommare valori letti come stringhe senza convertirli.',
        example: "Number('5') + 3 // 8",
      },
      deepDiveRef: DD,
    };
  },
};

const roundBm: QuestionTemplate = {
  id: 'num-round-bm',
  topicId: TOPIC,
  subtopicId: 'numbers-math',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['Math.round'],
  tags: ['numeri', 'best-practice'],
  generate(rng: Rng) {
    const v = pickInt(rng, 15, 95) / 10; // es. 4.6
    const built = makeOptions(
      rng,
      {
        text: `Math.round(${v})`,
        why: `\`Math.round\` arrotonda all'intero più vicino e restituisce un numero: ${v} diventa ${Math.round(v)}.`,
      },
      [
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
    );
    return {
      templateId: 'num-round-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'numbers-math',
      skills: ['Math.round'],
      prompt: `Vuoi arrotondare ${v} all'intero più vicino e ti serve un numero, non una stringa. Quale metodo usi?`,
      ...built,
      explanation: {
        short: `Math.round(${v}) restituisce ${Math.round(v)}.`,
        whyCorrect: "round va all'intero più vicino; floor, ceil e trunc hanno regole diverse.",
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Metodi di arrotondamento di Math',
        commonMistake: 'Confondere round (più vicino), floor (giù), ceil (su) e trunc (taglia).',
        example: 'Math.round(4.5) // 5; Math.floor(4.9) // 4',
      },
      deepDiveRef: DD,
    };
  },
};

export const numbersTemplates: QuestionTemplate[] = [
  modPo,
  powPo,
  floorPo,
  nanMc,
  coerceFb,
  roundBm,
];
