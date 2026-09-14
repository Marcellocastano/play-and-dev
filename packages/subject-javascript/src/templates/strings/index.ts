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
        { text: fmt(s.length), why: `length conta i caratteri: '${s}' ne ha ${s.length}.` },
        [
          { text: fmt(s.length - 1), why: 'length conta da 1, non da 0: non è l\'ultimo indice.' },
          { text: fmt(s.length + 1), why: 'Nessun carattere extra viene conteggiato.' },
          { text: 'undefined', why: 'length è una proprietà delle stringhe: esiste sempre.' },
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
          commonMistake: 'Confondere length con l\'ultimo indice (che è length - 1).',
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
        { text: correct, why: `slice(${a}, ${b}) prende i caratteri da ${a} a ${b - 1}: '${correct}'.` },
        [
          { text: s.slice(a, b - 1), why: `Il secondo indice è escluso: si arriva a ${b - 1}, non ${b - 2}.` },
          { text: s.slice(a, b + 1), why: `Il secondo indice ${b} è escluso: questo ne include uno di più.` },
          { text: s.slice(a + 1, b), why: 'Il primo indice è incluso: non si salta un carattere in più.' },
          { text: s.slice(b, a), why: 'Con indici invertiti slice restituisce stringa vuota.' },
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
      { text: '${nome}', why: 'Nei template literal si interpola con ${espressione}.' },
      [
        { text: '+ nome', why: 'La concatenazione con + non funziona dentro i backtick.' },
        { text: '#{nome}', why: '#{...} è la sintassi di Ruby, non di JavaScript.' },
        { text: '%nome%', why: '%...% non è una sintassi di interpolazione in JavaScript.' },
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
        commonMistake: 'Usare le virgolette invece dei backtick: ${...} funziona solo nei backtick.',
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
      { text: 'toUpperCase()', why: 'toUpperCase() restituisce la stringa tutta maiuscola.' },
      [
        { text: 'toUpper()', why: 'toUpper() non esiste: il metodo si chiama toUpperCase().' },
        { text: 'upperCase()', why: 'upperCase() non esiste in JavaScript.' },
        { text: 'capitalize()', why: 'capitalize() non esiste; renderebbe comunque maiuscola solo la prima lettera.' },
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
        whyCorrect: 'toUpperCase() è il metodo standard; le stringhe restano immutabili (ritorna una nuova stringa).',
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
      { text: `s.includes('${sub}')`, why: 'includes() ritorna true/false: è il modo più diretto e leggibile.' },
      [
        { text: `s.contains('${sub}')`, why: 'contains() non esiste in JavaScript (esiste in altri linguaggi).' },
        { text: `s.has('${sub}')`, why: 'Le stringhe non hanno un metodo has().' },
        { text: `s.indexOf('${sub}')`, why: 'indexOf ritorna la posizione (o -1), non un booleano: funziona ma va confrontato con >= 0, meno diretto.' },
      ],
    );
    return {
      templateId: 'str-includes-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'strings-methods',
      skills: ['includes'],
      prompt: `Hai \`const s = '${s}'\`. Qual è il modo migliore per sapere se contiene '${sub}'?`,
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
        text: `toUpperCase() non modifica la stringa: il risultato va assegnato (${name} = ${name}.toUpperCase())`,
        why: 'Le stringhe sono immutabili: i metodi ritornano una nuova stringa.',
      },
      [
        { text: 'console.log non può stampare stringhe let', why: 'console.log stampa qualunque valore; il problema è a monte.' },
        { text: 'toUpperCase() va scritto tutto minuscolo', why: 'Il nome del metodo è corretto: è il risultato ignorato il problema.' },
        { text: 'Manca il tipo della variabile', why: 'JavaScript non richiede l\'annotazione del tipo.' },
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
        short: 'Le stringhe sono immutabili: toUpperCase() ritorna una nuova stringa che qui viene scartata.',
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
