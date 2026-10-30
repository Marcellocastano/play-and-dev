import type { QuestionTemplate } from '@lg/core';
import { defineCategorize, defineTemplate, pickOf, shuffle } from '../helpers.js';

const TOPIC = 'booleans-null-undefined';

const falsyMc = defineTemplate(
  {
    id: 'bnu-falsy-mc',
    topicId: TOPIC,
    subtopicId: 'bnu-truthy-falsy',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['truthy/falsy'],
    tags: ['booleani'],
  },
  (rng) => {
    const falsyPool = [
      {
        text: '0',
        why: 'Il numero 0 è uno dei sei valori falsy di JavaScript: in una condizione viene valutato come false.',
      },
      {
        text: "''",
        why: 'La stringa vuota non contiene caratteri: in una condizione viene valutata come false.',
      },
      {
        text: 'undefined',
        why: 'undefined è falsy per definizione: rappresenta proprio l’assenza di un valore.',
      },
      {
        text: 'NaN',
        why: 'NaN è falsy per definizione: in una condizione viene valutato come false.',
      },
    ];
    const truthyPool = [
      {
        text: "'0'",
        why: "La stringa '0' contiene un carattere, quindi non è vuota: in una condizione viene valutata come truthy.",
      },
      {
        text: '[]',
        why: 'Un array, anche vuoto, è un oggetto: tutti gli oggetti sono truthy, quindi in un `if` entrerebbe nel ramo vero.',
      },
      {
        text: "'false'",
        why: "'false' è una stringa con del contenuto, quindi è truthy: ad essere falsy è il booleano `false`, non il suo testo.",
      },
      {
        text: '{}',
        why: 'Un oggetto è sempre truthy, anche quando non contiene proprietà: essere vuoto non lo rende falsy.',
      },
      {
        text: '-1',
        why: 'Tra i numeri solo 0 e NaN sono falsy: -1 è un numero diverso da zero e quindi truthy.',
      },
    ];
    const correct = pickOf(rng, falsyPool);
    const distractors = shuffle(truthyPool, rng).slice(0, 3);
    return {
      prompt: 'Quale di questi valori è falsy?',
      correct: correct,
      distractors: distractors,
      short: 'I falsy sono: false, 0, "", null, undefined, NaN. Tutto il resto è truthy.',
      whyCorrect: '0 è uno dei sei valori falsy.',
      concept: 'Valori truthy e falsy',
      commonMistake: "Pensare che '0', 'false' o [] siano falsy.",
      example: 'if ([]) { /* viene eseguito: [] è truthy */ }',
    };
  },
);

const typeofUndefinedPo = defineTemplate(
  {
    id: 'bnu-typeof-po',
    topicId: TOPIC,
    subtopicId: 'bnu-null-undefined',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['undefined', 'typeof'],
    tags: ['tipi'],
  },
  (rng) => {
    const name = pickOf(rng, ['x', 'valore', 'dato', 'input']);
    const useNull = rng() < 0.4;
    const code = useNull
      ? `let ${name} = null;\nconsole.log(${name});\nconsole.log(typeof ${name});`
      : `let ${name};\nconsole.log(${name});\nconsole.log(typeof ${name});`;
    const correct = useNull ? 'null\nobject' : 'undefined\nundefined';
    const correctWhy = useNull
      ? 'La variabile vale null e typeof null restituisce "object" (bug storico).'
      : 'Una variabile dichiarata e non inizializzata vale undefined, e il suo tipo è "undefined".';
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: { text: correct, why: correctWhy },
      distractors: [
        {
          text: 'undefined\nundefined',
          why: `La variabile è inizializzata a null: la prima riga stampa null e \`typeof null\` restituisce 'object'.`,
        },
        {
          text: 'null\nobject',
          why: `La variabile non è mai inizializzata, quindi la prima riga stampa undefined: per avere null servirebbe un'assegnazione esplicita.`,
        },
        {
          text: 'undefined\nnull',
          why: `La seconda riga stampa il risultato di typeof, che non è mai la stringa 'null': per undefined dà 'undefined' e per null dà 'object'.`,
        },
        {
          text: 'null\nnull',
          why: `La seconda riga stampa il risultato di typeof, che non è mai la stringa 'null': \`typeof null\` restituisce 'object' per un bug storico.`,
        },
      ].filter((d) => d.text !== correct),
      short: useNull
        ? 'null è un valore assegnato; typeof null è "object".'
        : 'Una let senza valore vale undefined; typeof undefined è "undefined".',
      whyCorrect: correctWhy,
      concept: 'undefined, null e typeof',
      commonMistake: 'Confondere undefined (non assegnato) con null (assegnato).',
      example: 'let a; console.log(a); // undefined',
    };
  },
);

const nullUndefCmp = defineTemplate(
  {
    id: 'bnu-null-undef-cmp',
    topicId: TOPIC,
    subtopicId: 'bnu-null-undefined',
    type: 'compare',
    difficulty: 'medium',
    skills: ['null', 'undefined', '==', '==='],
    tags: ['confronti'],
  },
  (rng) => {
    const variants = [
      {
        prompt: 'Quale di queste espressioni restituisce `true`?',
        correct: {
          text: 'null == undefined',
          why: 'Per una regola speciale del linguaggio, `==` tratta null e undefined come equivalenti: questa espressione restituisce true.',
        },
        wrong: [
          {
            text: 'null === undefined',
            why: 'Il confronto stretto controlla anche il tipo: null e undefined sono tipi diversi, quindi `===` restituisce false.',
          },
          {
            text: "typeof null === 'null'",
            why: "Per un bug storico `typeof null` restituisce 'object': il confronto con la stringa 'null' dà quindi false.",
          },
          {
            text: 'undefined == 0',
            why: "La regola speciale di `==` equipara undefined solo a null: con 0 non c'è equivalenza e il risultato è false.",
          },
        ],
      },
      {
        prompt: 'Quale di queste espressioni restituisce `false`?',
        correct: {
          text: 'null === undefined',
          why: 'Il confronto stretto controlla anche il tipo: null e undefined sono tipi diversi, quindi `===` restituisce false.',
        },
        wrong: [
          {
            text: 'null == undefined',
            why: 'Con il confronto debole la regola speciale li considera equivalenti: `null == undefined` restituisce true, non false.',
          },
          {
            text: 'null == null',
            why: 'Un valore è sempre uguale a sé stesso: `null == null` restituisce true, non false.',
          },
          {
            text: 'undefined == null',
            why: 'È la stessa regola speciale di `==`: undefined e null sono considerati equivalenti e il confronto restituisce true.',
          },
        ],
      },
      {
        prompt: 'Quale di queste espressioni restituisce `false`?',
        correct: {
          text: 'undefined == 0',
          why: "La regola speciale di `==` equipara undefined solo a null: con 0 non c'è conversione e il risultato è false.",
        },
        wrong: [
          {
            text: 'null == undefined',
            why: 'Per la regola speciale di `==` null e undefined sono equivalenti: questa espressione restituisce true.',
          },
          {
            text: '0 == false',
            why: 'Con `==` il booleano false viene convertito nel numero 0: il confronto è tra 0 e 0 e restituisce true.',
          },
          {
            text: "'' == 0",
            why: 'Con `==` la stringa vuota viene convertita nel numero 0: il confronto è tra 0 e 0 e restituisce true.',
          },
        ],
      },
      {
        prompt: 'Quale di queste espressioni restituisce `true`?',
        correct: {
          text: "'' == false",
          why: 'Con `==` sia la stringa vuota sia false vengono convertiti nel numero 0: il confronto è tra 0 e 0 e restituisce true.',
        },
        wrong: [
          {
            text: "'' === false",
            why: 'Il confronto stretto non converte i tipi: una stringa e un booleano sono tipi diversi, quindi restituisce false.',
          },
          {
            text: 'null == 0',
            why: "La regola speciale equipara null solo a undefined: con 0 non c'è equivalenza e il risultato è false.",
          },
          {
            text: 'undefined === null',
            why: 'Il confronto stretto distingue i tipi: undefined e null sono diversi e `===` restituisce false.',
          },
        ],
      },
      {
        prompt: 'Quale di queste espressioni restituisce `false`?',
        correct: {
          text: 'null == 0',
          why: "La regola speciale di `==` equipara null solo a undefined: con 0 non c'è conversione e il risultato è false.",
        },
        wrong: [
          {
            text: 'null == undefined',
            why: 'Per la regola speciale di `==` null e undefined sono equivalenti: questa espressione restituisce true.',
          },
          {
            text: '0 == false',
            why: 'Con `==` il booleano false viene convertito nel numero 0: il confronto è tra 0 e 0 e restituisce true.',
          },
          {
            text: "'' == false",
            why: "Con `==` sia '' sia false vengono convertiti in 0: il confronto è tra 0 e 0 e restituisce true.",
          },
        ],
      },
    ];
    const v = pickOf(rng, variants);
    return {
      prompt: v.prompt,
      correct: v.correct,
      distractors: shuffle(v.wrong, rng),
      short: '== li considera equivalenti, === no.',
      whyCorrect: "È l'unica coppia di valori diversi considerata uguale da ==.",
      concept: 'null vs undefined',
      commonMistake: 'Usare === dove si vuole coprire entrambi i casi (serve x == null).',
      example: 'x == null // vero sia per null che per undefined',
    };
  },
);

const undefFg = defineTemplate(
  {
    id: 'bnu-undef-fg',
    topicId: TOPIC,
    subtopicId: 'bnu-null-undefined',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['undefined', '==='],
    tags: ['tipi'],
  },
  (rng) => {
    const name = pickOf(rng, ['x', 'dato', 'input', 'valore']);
    const code = `let ${name};\nconsole.log(${name} === ___);`;
    const wrongPool = shuffle(
      [
        {
          text: 'null',
          why: `Il confronto stretto distingue i tipi: ${name} vale undefined e \`undefined === null\` restituisce false.`,
        },
        {
          text: '0',
          why: `${name} vale undefined: il confronto stretto con il numero 0 dà false, perché \`===\` non converte i tipi.`,
        },
        {
          text: "''",
          why: `${name} vale undefined: confrontata strettamente con una stringa dà false, anche se la stringa è vuota.`,
        },
        {
          text: 'false',
          why: `${name} vale undefined, non un booleano: \`undefined === false\` restituisce false.`,
        },
        {
          text: 'NaN',
          why: `${name} vale undefined, non NaN: \`undefined === NaN\` è false (e NaN non è uguale nemmeno a sé stesso).`,
        },
      ],
      rng,
    ).slice(0, 3);
    return {
      prompt: 'Completa affinché il codice stampi true.',
      code: code,
      correct: {
        text: 'undefined',
        why: `Una variabile dichiarata senza valore vale undefined: \`${name} === undefined\` restituisce true.`,
      },
      distractors: wrongPool,
      short: `${name} non è inizializzata: vale undefined.`,
      whyCorrect: 'undefined === undefined → true.',
      concept: 'Valore di default di una variabile non inizializzata',
      commonMistake: 'Pensare che valga null: null va assegnato esplicitamente.',
      example: 'let a; a === undefined // true',
    };
  },
);

const nullCheckBm = defineTemplate(
  {
    id: 'bnu-null-check-bm',
    topicId: TOPIC,
    subtopicId: 'bnu-null-undefined',
    type: 'best-method',
    difficulty: 'medium',
    skills: ['null', 'undefined', '=='],
    tags: ['best-practice'],
  },
  (rng) => {
    const name = pickOf(rng, ['dato', 'valore', 'risultato', 'input', 'config']);
    return {
      prompt: `Vuoi proseguire solo se \`${name}\` non è né null né undefined. Qual è il controllo più pratico?`,
      correct: {
        text: `${name} != null`,
        why: `Per la regola speciale di \`==\`, \`${name} != null\` risulta falso sia per null sia per undefined: un solo controllo copre entrambi i casi.`,
      },
      distractors: [
        {
          text: `${name} !== null`,
          why: `Il confronto stretto esclude solo null: se ${name} fosse undefined la condizione sarebbe comunque vera e il codice proseguirebbe.`,
        },
        {
          text: `${name} !== undefined`,
          why: `Esclude solo undefined: un valore null supererebbe il controllo, quindi non copre entrambi i casi richiesti.`,
        },
        {
          text: `typeof ${name} === 'null'`,
          why: `Per un bug storico \`typeof null\` restituisce 'object': nessun valore produce la stringa 'null', quindi il controllo non funziona.`,
        },
        {
          text: `${name} != undefined`,
          why: `Funzionerebbe, perché \`undefined == null\` copre entrambi i casi; la forma idiomatica però è \`!= null\`, più breve e riconoscibile.`,
        },
      ].slice(0, 3),
      short: 'x != null è l\'unico uso "accettato" del confronto debole: copre null e undefined.',
      whyCorrect: 'Poiché null == undefined, != null esclude entrambi.',
      concept: 'Controllo null/undefined con ==',
      commonMistake: 'Scrivere due controlli separati quando basta != null.',
      example: 'if (dato != null) { /* dato ha un valore */ }',
    };
  },
);

const TRUTHY_FALSY: { text: string; value: unknown; why: string }[] = [
  {
    text: "''",
    value: '',
    why: 'La stringa vuota è uno dei valori considerati falsi dal linguaggio: in una condizione il ramo else viene eseguito.',
  },
  {
    text: "' '",
    value: ' ',
    why: 'Una stringa con un solo spazio non è vuota: ha lunghezza 1 e in una condizione viene valutata come vera.',
  },
  {
    text: '0',
    value: 0,
    why: 'Il numero zero è nella lista dei valori falsi: qualunque condizione su 0 prende il ramo negativo.',
  },
  {
    text: '-1',
    value: -1,
    why: 'Ogni numero diverso da zero, compresi quelli negativi, è considerato vero: -1 in un if entra nel ramo then.',
  },
  {
    text: "'0'",
    value: '0',
    why: 'La stringa che contiene il carattere 0 non è vuota: è considerata vera anche se il numero 0 sarebbe falso.',
  },
  {
    text: "'false'",
    value: 'false',
    why: 'È una stringa non vuota, quindi è considerata vera: il contenuto del testo non viene interpretato come booleano.',
  },
  {
    text: 'NaN',
    value: NaN,
    why: 'NaN è il risultato di operazioni numeriche impossibili ed è considerato falso in ogni contesto booleano.',
  },
  {
    text: 'null',
    value: null,
    why: "null rappresenta l'assenza intenzionale di un valore ed è considerato falso quando viene valutato in una condizione.",
  },
  {
    text: 'undefined',
    value: undefined,
    why: 'undefined indica un valore non ancora assegnato ed è considerato falso in qualunque condizione lo valuti.',
  },
  {
    text: '[]',
    value: [],
    why: 'Un array vuoto è comunque un oggetto esistente: tutti gli oggetti e gli array sono considerati veri, anche se vuoti.',
  },
  {
    text: '{}',
    value: {},
    why: 'Un oggetto letterale vuoto esiste come riferimento e quindi è considerato vero: non esistono oggetti falsi.',
  },
  {
    text: '0n',
    value: 0n,
    why: "Il BigInt zero segue la stessa regola del numero zero: è l'unico valore BigInt considerato falso.",
  },
];

const truthyFalsyCg = defineCategorize(
  {
    id: 'bnu-truthy-cg',
    topicId: TOPIC,
    subtopicId: 'bnu-truthy-falsy',
    type: 'categorize',
    difficulty: 'easy',
    skills: ['truthy', 'falsy', 'conversione'],
    tags: ['tipi', 'condizioni'],
  },
  (rng) => {
    const picked = shuffle(TRUTHY_FALSY, rng).slice(0, 6);
    const nTrue = picked.filter((p) => Boolean(p.value)).length;
    if (nTrue < 2 || nTrue > 4) throw new Error('servono almeno 2 valori per categoria');
    return {
      prompt: 'Per ogni valore, decidi come viene valutato in una condizione `if`.',
      categories: [
        { id: 'vero', text: 'Considerato vero' },
        { id: 'falso', text: 'Considerato falso' },
      ],
      items: picked.map((p) => ({
        text: p.text,
        categoryId: Boolean(p.value) ? 'vero' : 'falso',
        why: p.why,
      })),
      short: 'Solo pochi valori sono considerati falsi; tutto il resto conta come vero.',
      whyCorrect:
        'I valori falsi sono false, 0, 0n, NaN, stringa vuota, null e undefined: oggetti, array e stringhe non vuote contano sempre come veri.',
      concept: 'Valori truthy e falsy',
      commonMistake: "Pensare che [] o la stringa '0' siano falsi: sono entrambi veri.",
      example: "if ('0') { /* si esegue: '0' è una stringa non vuota */ }",
    };
  },
);

export const booleansNullUndefinedTemplates: QuestionTemplate[] = [
  falsyMc,
  typeofUndefinedPo,
  nullUndefCmp,
  undefFg,
  nullCheckBm,
  truthyFalsyCg,
];
