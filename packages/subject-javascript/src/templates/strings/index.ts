import type { QuestionTemplate } from '@lg/core';
import {
  defineMatch,
  defineTemplate,
  fmt,
  pickInt,
  pickOf,
  shuffle,
  PERSON_NAMES,
} from '../helpers.js';

const TOPIC = 'strings';

const WORDS = ['javascript', 'programma', 'computer', 'tastiera', 'sviluppo', 'funzione'] as const;

const lengthPo = defineTemplate(
  {
    id: 'str-length-po',
    topicId: TOPIC,
    subtopicId: 'strings-length-concat',
    type: 'predict-output',
    difficulty: 'easy',
    skills: ['length'],
    tags: ['stringhe'],
  },
  (rng) => {
    const s = pickOf(rng, WORDS);
    const code = `const parola = '${s}';\nconsole.log(parola.length);`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: fmt(s.length),
        why: `\`length\` conta i caratteri della stringa: '${s}' ne ha esattamente ${s.length}.`,
      },
      distractors: [
        {
          text: fmt(s.length - 1),
          why: `Il numero ${s.length - 1} è l'indice dell'ultimo carattere, non la lunghezza: gli indici partono da 0, ma \`length\` conta gli elementi partendo da 1.`,
        },
        {
          text: fmt(s.length + 1),
          why: `In '${s}' ci sono solo ${s.length} caratteri: \`length\` non aggiunge nulla, quindi ${s.length + 1} conterebbe un carattere che non esiste.`,
        },
        {
          text: 'undefined',
          why: `\`length\` è una proprietà sempre presente sulle stringhe: su '${s}' restituisce un numero, non undefined.`,
        },
      ],
      short: `length restituisce il numero di caratteri: ${s.length}.`,
      whyCorrect: `'${s}'.length === ${s.length}.`,
      concept: 'Proprietà length delle stringhe',
      commonMistake: "Confondere length con l'ultimo indice (che è length - 1).",
      example: "'ciao'.length // 4",
    };
  },
);

const slicePo = defineTemplate(
  {
    id: 'str-slice-po',
    topicId: TOPIC,
    subtopicId: 'strings-slice',
    type: 'predict-output',
    difficulty: 'medium',
    skills: ['slice'],
    tags: ['stringhe'],
  },
  (rng) => {
    const s = pickOf(rng, WORDS);
    const a = pickInt(rng, 0, Math.min(3, s.length - 3));
    const b = pickInt(rng, a + 2, s.length - 1);
    const correct = s.slice(a, b);
    const code = `const s = '${s}';\nconsole.log(s.slice(${a}, ${b}));`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: correct,
        why: `\`slice(${a}, ${b})\` estrae i caratteri dall'indice ${a} incluso fino a ${b} escluso: in '${s}' formano '${correct}'.`,
      },
      distractors: [
        {
          text: s.slice(a, b - 1),
          why: `Il secondo indice di slice è escluso, quindi la porzione arriva fino al carattere in posizione ${b - 1} incluso: fermarsi a ${b - 2} perde un carattere.`,
        },
        {
          text: s.slice(a, b + 1),
          why: `L'indice finale ${b} non viene incluso nella porzione: questo risultato corrisponderebbe a \`slice(${a}, ${b + 1})\`, che prende un carattere di troppo.`,
        },
        {
          text: s.slice(a + 1, b),
          why: `Il primo indice è incluso nell'estrazione: \`slice(${a}, ${b})\` parte dal carattere in posizione ${a}, quindi questo risultato ne salta uno.`,
        },
        {
          text: s.slice(b, a),
          why: `Con gli indici invertiti \`slice(${b}, ${a})\` restituirebbe una stringa vuota: questa opzione non corrisponde a nessuna chiamata presente nel codice.`,
        },
      ],
      short: `slice(${a}, ${b}) estrae da indice ${a} (incluso) a ${b} (escluso): '${correct}'.`,
      whyCorrect: `In '${s}' i caratteri ${a}–${b - 1} formano '${correct}'.`,
      concept: 'slice con indice finale escluso',
      commonMistake: 'Includere il carattere al secondo indice: slice(a, b) si ferma a b - 1.',
      example: "'javascript'.slice(0, 4) // 'java'",
    };
  },
);

const tplFg = defineTemplate(
  {
    id: 'str-tpl-fg',
    topicId: TOPIC,
    subtopicId: 'strings-length-concat',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['template literal'],
    tags: ['stringhe'],
  },
  (rng) => {
    const name = pickOf(rng, PERSON_NAMES);
    const code = `const nome = '${name}';\nconsole.log(\`Ciao ___!\`);`;
    return {
      prompt: `Completa il template literal per stampare "Ciao ${name}!".`,
      code: code,
      correct: {
        text: '${nome}',
        why: `Nei template literal i valori si inseriscono con \`\${...}\`: \`Ciao \${nome}!\` stampa "Ciao ${name}!".`,
      },
      distractors: [
        {
          text: '+ nome',
          why: 'Dentro i backtick non si concatena con `+`: il testo `+ nome` verrebbe stampato letteralmente, non interpretato come codice.',
        },
        {
          text: '#{nome}',
          why: "`#{...}` è la sintassi di interpolazione di Ruby: in JavaScript verrebbe stampata com'è, perché i template literal usano `${...}`.",
        },
        {
          text: '%nome%',
          why: 'In JavaScript `%...%` non ha alcun significato di interpolazione: comparirebbe nel testo invece del valore della variabile.',
        },
      ],
      short: 'Nei template literal (backtick) i valori si inseriscono con ${...}.',
      whyCorrect: `\`Ciao \${nome}!\` produce "Ciao ${name}!".`,
      concept: 'Interpolazione nei template literal',
      commonMistake: 'Usare le virgolette invece dei backtick: ${...} funziona solo nei backtick.',
      example: "`Tot: ${n}` è più leggibile di 'Tot: ' + n",
    };
  },
);

const upperMc = defineTemplate(
  {
    id: 'str-upper-mc',
    topicId: TOPIC,
    subtopicId: 'strings-methods',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['toUpperCase'],
    tags: ['stringhe', 'metodi'],
  },
  (rng) => {
    const s = pickOf(rng, WORDS);
    return {
      prompt: `Quale metodo trasforma '${s}' in '${s.toUpperCase()}'?`,
      correct: {
        text: 'toUpperCase()',
        why: `\`'${s}'.toUpperCase()\` restituisce una nuova stringa tutta maiuscola: '${s.toUpperCase()}'.`,
      },
      distractors: [
        {
          text: 'toUpper()',
          why: 'Le stringhe JavaScript non hanno un metodo `toUpper()`: chiamarlo lancerebbe un TypeError, il nome corretto è `toUpperCase()`.',
        },
        {
          text: 'upperCase()',
          why: '`upperCase()` non è un metodo delle stringhe JavaScript: la chiamata fallirebbe con un TypeError.',
        },
        {
          text: 'capitalize()',
          why: "Anche se esistesse, `capitalize` indicherebbe solo la prima lettera maiuscola, non l'intera stringa; in ogni caso le stringhe JavaScript non lo hanno.",
        },
      ],
      short: `'${s}'.toUpperCase() restituisce '${s.toUpperCase()}'.`,
      whyCorrect:
        'toUpperCase() è il metodo standard; le stringhe restano immutabili (ritorna una nuova stringa).',
      concept: 'Metodi di trasformazione delle stringhe',
      commonMistake: 'Inventare nomi di metodi: in JS sono toUpperCase / toLowerCase.',
      example: "'ciao'.toUpperCase() // 'CIAO'",
    };
  },
);

const includesBm = defineTemplate(
  {
    id: 'str-includes-bm',
    topicId: TOPIC,
    subtopicId: 'strings-methods',
    type: 'best-method',
    difficulty: 'easy',
    skills: ['includes'],
    tags: ['stringhe', 'best-practice'],
  },
  (rng) => {
    const s = pickOf(rng, WORDS);
    const sub = s.slice(0, pickInt(rng, 2, 4));
    return {
      prompt: `Hai \`const s = '${s}'\` e ti serve un booleano pronto per un \`if\`: sapere se contiene '${sub}'. Qual è il modo più diretto?`,
      correct: {
        text: `s.includes('${sub}')`,
        why: `\`includes('${sub}')\` restituisce direttamente true o false: è il booleano pronto per l'\`if\` richiesto dallo scenario.`,
      },
      distractors: [
        {
          text: `s.indexOf('${sub}')`,
          why: `\`indexOf\` restituisce la posizione di '${sub}' (qui 0) oppure -1 se assente: è un numero, non un booleano, e in un \`if\` la posizione 0 verrebbe letta come falsa.`,
        },
        {
          text: `s.contains('${sub}')`,
          why: 'Le stringhe JavaScript non hanno un metodo `contains` (esiste in Java e C#): la chiamata lancerebbe un TypeError.',
        },
        {
          text: `s.search('${sub}')`,
          why: '`search` è pensata per le espressioni regolari e restituisce un indice, non un booleano: in un `if` andrebbe comunque confrontato con -1.',
        },
      ],
      short: 'includes() ritorna direttamente un booleano.',
      whyCorrect: `'${s}'.includes('${sub}') ritorna true in modo diretto e leggibile.`,
      concept: 'Ricerca in una stringa con includes',
      commonMistake: 'Usare indexOf senza confrontare il risultato con -1.',
      example: "'ciao mondo'.includes('mondo') // true",
    };
  },
);

const immutableFb = defineTemplate(
  {
    id: 'str-immutable-fb',
    topicId: TOPIC,
    subtopicId: 'strings-methods',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['immutabilità', 'toUpperCase'],
    tags: ['stringhe', 'bug'],
  },
  (rng) => {
    const s = pickOf(rng, WORDS);
    const name = pickOf(rng, ['testo', 'parola', 'titolo']);
    const code = `let ${name} = '${s}';\n${name}.toUpperCase();\nconsole.log(${name});`;
    return {
      prompt: `Questo codice dovrebbe stampare '${s.toUpperCase()}' ma stampa '${s}'. Qual è il bug?`,
      code: code,
      correct: {
        text: 'Il risultato non viene assegnato',
        why: `Le stringhe sono immutabili: \`${name}.toUpperCase()\` produce una nuova stringa che qui viene scartata. Serviva \`${name} = ${name}.toUpperCase()\`.`,
      },
      distractors: [
        {
          text: '`toUpperCase` cambia solo la prima lettera',
          why: `In realtà \`toUpperCase()\` trasforma tutta la stringa: il problema non è cosa produce, ma che il suo risultato non viene salvato in ${name}.`,
        },
        {
          text: 'Serve `toUpperCase` senza parentesi',
          why: 'Senza parentesi si accede alla funzione stessa, senza eseguirla: il metodo va chiamato con `()` e il risultato va poi assegnato.',
        },
        {
          text: '`let` blocca la modifica della stringa',
          why: `\`let\` permette proprio la riassegnazione, a differenza di \`const\`: il bug è che il risultato di \`toUpperCase()\` non viene assegnato a ${name}.`,
        },
      ],
      short:
        'Le stringhe sono immutabili: toUpperCase() ritorna una nuova stringa che qui viene scartata.',
      whyCorrect: 'Serve assegnare il risultato: `testo = testo.toUpperCase()`.',
      concept: 'Immutabilità delle stringhe',
      commonMistake: 'Aspettarsi che i metodi delle stringhe le modifichino sul posto.',
      example: 'let s = "a"; s.toUpperCase(); // s resta "a"',
    };
  },
);

export const STRING_CALLS: { expr: string; result: string; why: string }[] = [
  {
    expr: "'ciao'.toUpperCase()",
    result: fmt('ciao'.toUpperCase(), true),
    why: 'toUpperCase restituisce una nuova stringa tutta maiuscola: le lettere accentate seguono le regole Unicode.',
  },
  {
    expr: "'abc'.at(-1)",
    result: fmt('abc'.at(-1), true),
    why: "at con indice negativo conta dalla fine: -1 è l'ultimo carattere della stringa, qui la lettera c.",
  },
  {
    expr: "'  x '.trim().length",
    result: fmt('  x '.trim().length),
    why: 'trim toglie gli spazi ai due estremi lasciando solo la x: la lunghezza della stringa risultante è 1.',
  },
  {
    expr: "'a-b-c'.split('-').length",
    result: fmt('a-b-c'.split('-').length),
    why: "split sul trattino produce un array di tre elementi: la proprietà length dell'array vale 3.",
  },
  {
    expr: "'ciao'.slice(1, 3)",
    result: fmt('ciao'.slice(1, 3), true),
    why: 'slice prende i caratteri dall\'indice 1 incluso al 3 escluso: restano la i e la a, quindi "ia".',
  },
  {
    expr: "'banana'.indexOf('n')",
    result: fmt('banana'.indexOf('n')),
    why: 'indexOf restituisce la prima occorrenza: in banana la prima n è a indice 2, non le successive.',
  },
  {
    expr: "'Ab'.toLowerCase()",
    result: fmt('Ab'.toLowerCase(), true),
    why: 'toLowerCase converte ogni lettera maiuscola in minuscola: la A diventa a e il risultato è "ab".',
  },
  {
    expr: "'ha'.repeat(2)",
    result: fmt('ha'.repeat(2), true),
    why: 'repeat concatena la stringa a sé stessa per il numero indicato: due copie di "ha" fanno "haha".',
  },
  {
    expr: "'sole'.includes('ol')",
    result: fmt('sole'.includes('ol')),
    why: 'includes verifica se la sottostringa compare: "ol" è presente in "sole", quindi il risultato è true.',
  },
  {
    expr: "'ciao mondo'.split(' ').length",
    result: fmt('ciao mondo'.split(' ').length),
    why: "split sullo spazio divide in due parole: l'array risultante ha length 2.",
  },
];

const stringCallMatch = defineMatch(
  {
    id: 'str-call-match',
    topicId: TOPIC,
    subtopicId: 'strings-methods',
    type: 'match',
    difficulty: 'easy',
    skills: ['metodi', 'stringhe'],
    tags: ['stringhe'],
  },
  (rng) => {
    const picked = shuffle(STRING_CALLS, rng).slice(0, 4);
    if (new Set(picked.map((p) => p.result)).size !== picked.length) {
      throw new Error('risultati duplicati tra le righe');
    }
    return {
      prompt: 'Abbina ogni chiamata al valore che produce.',
      choices: shuffle(
        picked.map((p) => p.result),
        rng,
      ),
      rows: picked.map((p) => ({
        text: `\`${p.expr}\``,
        choice: p.result,
        why: p.why,
      })),
      short: 'Ogni metodo delle stringhe restituisce un valore nuovo calcolato sul contenuto.',
      whyCorrect:
        'Il risultato di ogni riga è il valore esatto prodotto dalla chiamata: la riga va abbinata a quel valore.',
      concept: 'Metodi delle stringhe e loro risultati',
      commonMistake:
        'Confondere indici 0-based o dimenticare che i metodi non modificano la stringa originale.',
      example: "'ciao'.slice(0, 2) // 'ci'",
    };
  },
);

export const stringsTemplates: QuestionTemplate[] = [
  lengthPo,
  slicePo,
  tplFg,
  upperMc,
  includesBm,
  immutableFb,
  stringCallMatch,
];
