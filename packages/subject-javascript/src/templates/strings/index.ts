import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickOf, PERSON_NAMES, retry, type Rng } from '../helpers.js';

const TOPIC = 'strings';
const DD = 'dd-strings';
const WORDS = ['javascript', 'programma', 'computer', 'tastiera', 'sviluppo', 'funzione'] as const;

const lengthPo: QuestionTemplate = {
  id: 'str-length-po',
  topicId: TOPIC,
  subtopicId: 'strings-length-concat',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['length'],
  tags: ['stringhe'],
  generate(rng: Rng) {
    return retry(() => {
      const s = pickOf(rng, WORDS);
      const code = `const parola = '${s}';\nconsole.log(parola.length);`;
      const built = makeOptions(
        rng,
        {
          text: fmt(s.length),
          why: `\`length\` conta i caratteri della stringa: '${s}' ne ha esattamente ${s.length}.`,
        },
        [
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
      );
      return {
        templateId: 'str-length-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'strings-length-concat',
        skills: ['length'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `length restituisce il numero di caratteri: ${s.length}.`,
          whyCorrect: `'${s}'.length === ${s.length}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Proprietà length delle stringhe',
          commonMistake: "Confondere length con l'ultimo indice (che è length - 1).",
          example: "'ciao'.length // 4",
        },
        deepDiveRef: DD,
      };
    });
  },
};

const slicePo: QuestionTemplate = {
  id: 'str-slice-po',
  topicId: TOPIC,
  subtopicId: 'strings-slice',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['slice'],
  tags: ['stringhe'],
  generate(rng: Rng) {
    return retry(() => {
      const s = pickOf(rng, WORDS);
      const a = pickInt(rng, 0, Math.min(3, s.length - 3));
      const b = pickInt(rng, a + 2, s.length - 1);
      const correct = s.slice(a, b);
      const code = `const s = '${s}';\nconsole.log(s.slice(${a}, ${b}));`;
      const built = makeOptions(
        rng,
        {
          text: correct,
          why: `\`slice(${a}, ${b})\` estrae i caratteri dall'indice ${a} incluso fino a ${b} escluso: in '${s}' formano '${correct}'.`,
        },
        [
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
      );
      return {
        templateId: 'str-slice-po',
        type: 'predict-output',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'strings-slice',
        skills: ['slice'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `slice(${a}, ${b}) estrae da indice ${a} (incluso) a ${b} (escluso): '${correct}'.`,
          whyCorrect: `In '${s}' i caratteri ${a}–${b - 1} formano '${correct}'.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'slice con indice finale escluso',
          commonMistake: 'Includere il carattere al secondo indice: slice(a, b) si ferma a b - 1.',
          example: "'javascript'.slice(0, 4) // 'java'",
        },
        deepDiveRef: DD,
      };
    });
  },
};

const tplFg: QuestionTemplate = {
  id: 'str-tpl-fg',
  topicId: TOPIC,
  subtopicId: 'strings-length-concat',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['template literal'],
  tags: ['stringhe'],
  generate(rng: Rng) {
    const name = pickOf(rng, PERSON_NAMES);
    const code = `const nome = '${name}';\nconsole.log(\`Ciao ___!\`);`;
    const built = makeOptions(
      rng,
      {
        text: '${nome}',
        why: `Nei template literal i valori si inseriscono con \`\${...}\`: \`Ciao \${nome}!\` stampa "Ciao ${name}!".`,
      },
      [
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
    );
    return {
      templateId: 'str-tpl-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'strings-length-concat',
      skills: ['template literal'],
      prompt: `Completa il template literal per stampare "Ciao ${name}!".`,
      code,
      ...built,
      explanation: {
        short: 'Nei template literal (backtick) i valori si inseriscono con ${...}.',
        whyCorrect: `\`Ciao \${nome}!\` produce "Ciao ${name}!".`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Interpolazione nei template literal',
        commonMistake:
          'Usare le virgolette invece dei backtick: ${...} funziona solo nei backtick.',
        example: "`Tot: ${n}` è più leggibile di 'Tot: ' + n",
      },
      deepDiveRef: DD,
    };
  },
};

const upperMc: QuestionTemplate = {
  id: 'str-upper-mc',
  topicId: TOPIC,
  subtopicId: 'strings-methods',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['toUpperCase'],
  tags: ['stringhe', 'metodi'],
  generate(rng: Rng) {
    const s = pickOf(rng, WORDS);
    const built = makeOptions(
      rng,
      {
        text: 'toUpperCase()',
        why: `\`'${s}'.toUpperCase()\` restituisce una nuova stringa tutta maiuscola: '${s.toUpperCase()}'.`,
      },
      [
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
    );
    return {
      templateId: 'str-upper-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'strings-methods',
      skills: ['toUpperCase'],
      prompt: `Quale metodo trasforma '${s}' in '${s.toUpperCase()}'?`,
      ...built,
      explanation: {
        short: `'${s}'.toUpperCase() restituisce '${s.toUpperCase()}'.`,
        whyCorrect:
          'toUpperCase() è il metodo standard; le stringhe restano immutabili (ritorna una nuova stringa).',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Metodi di trasformazione delle stringhe',
        commonMistake: 'Inventare nomi di metodi: in JS sono toUpperCase / toLowerCase.',
        example: "'ciao'.toUpperCase() // 'CIAO'",
      },
      deepDiveRef: DD,
    };
  },
};

const includesBm: QuestionTemplate = {
  id: 'str-includes-bm',
  topicId: TOPIC,
  subtopicId: 'strings-methods',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['includes'],
  tags: ['stringhe', 'best-practice'],
  generate(rng: Rng) {
    const s = pickOf(rng, WORDS);
    const sub = s.slice(0, pickInt(rng, 2, 4));
    const built = makeOptions(
      rng,
      {
        text: `s.includes('${sub}')`,
        why: `\`includes('${sub}')\` restituisce direttamente true o false: è il booleano pronto per l'\`if\` richiesto dallo scenario.`,
      },
      [
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
    );
    return {
      templateId: 'str-includes-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'strings-methods',
      skills: ['includes'],
      prompt: `Hai \`const s = '${s}'\` e ti serve un booleano pronto per un \`if\`: sapere se contiene '${sub}'. Qual è il modo più diretto?`,
      ...built,
      explanation: {
        short: 'includes() ritorna direttamente un booleano.',
        whyCorrect: `'${s}'.includes('${sub}') ritorna true in modo diretto e leggibile.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Ricerca in una stringa con includes',
        commonMistake: 'Usare indexOf senza confrontare il risultato con -1.',
        example: "'ciao mondo'.includes('mondo') // true",
      },
      deepDiveRef: DD,
    };
  },
};

const immutableFb: QuestionTemplate = {
  id: 'str-immutable-fb',
  topicId: TOPIC,
  subtopicId: 'strings-methods',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['immutabilità', 'toUpperCase'],
  tags: ['stringhe', 'bug'],
  generate(rng: Rng) {
    const s = pickOf(rng, WORDS);
    const name = pickOf(rng, ['testo', 'parola', 'titolo']);
    const code = `let ${name} = '${s}';\n${name}.toUpperCase();\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      {
        text: 'Il risultato non viene assegnato',
        why: `Le stringhe sono immutabili: \`${name}.toUpperCase()\` produce una nuova stringa che qui viene scartata. Serviva \`${name} = ${name}.toUpperCase()\`.`,
      },
      [
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
    );
    return {
      templateId: 'str-immutable-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'strings-methods',
      skills: ['immutabilità'],
      prompt: `Questo codice dovrebbe stampare '${s.toUpperCase()}' ma stampa '${s}'. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short:
          'Le stringhe sono immutabili: toUpperCase() ritorna una nuova stringa che qui viene scartata.',
        whyCorrect: 'Serve assegnare il risultato: `testo = testo.toUpperCase()`.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Immutabilità delle stringhe',
        commonMistake: 'Aspettarsi che i metodi delle stringhe le modifichino sul posto.',
        example: 'let s = "a"; s.toUpperCase(); // s resta "a"',
      },
      deepDiveRef: DD,
    };
  },
};

export const stringsTemplates: QuestionTemplate[] = [
  lengthPo,
  slicePo,
  tplFg,
  upperMc,
  includesBm,
  immutableFb,
];
