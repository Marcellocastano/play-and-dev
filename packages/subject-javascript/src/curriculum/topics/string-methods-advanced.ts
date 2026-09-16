import type { Topic } from '@lg/core';

export const stringMethodsAdvancedTopic: Topic = {
  id: 'string-methods-advanced',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Metodi avanzati delle stringhe',
  overview:
    'Oltre a `length` e `slice`, le stringhe offrono `split`, `trim`, `padStart`, `replace`, `at` e i controlli `startsWith`/`endsWith`. Sono gli strumenti per pulire, formattare e scomporre il testo.',
  subtopics: [
    {
      id: 'string-methods-advanced-split-join',
      name: 'split e join',
      overview: 'Spezzare una stringa in array e ricomporla.',
    },
    {
      id: 'string-methods-advanced-trim-pad',
      name: 'trim e pad',
      overview: 'Pulire gli spazi e allineare il testo a una lunghezza.',
    },
    {
      id: 'string-methods-advanced-replace',
      name: 'replace e ricerche',
      overview: 'Sostituire e controllare porzioni di stringa.',
    },
  ],
  learningObjectives: [
    'Spezzare e ricomporre testo con split e join',
    'Pulire input con trim e allineare con padStart/padEnd',
    'Distinguere replace (prima occorrenza) da replaceAll',
    'Usare at, startsWith e endsWith per accessi e controlli mirati',
  ],
  commonMistakes: [
    'Aspettarsi che `replace` sostituisca tutte le occorrenze (solo la prima con una stringa)',
    'Dimenticare che i metodi delle stringhe non mutano: il risultato va assegnato',
    'Usare `split()` senza separatore e ottenere un array con l\u2019intera stringa',
    'Confondere `at(-1)` con `length - 1`: `at` accetta indici negativi',
  ],
  examples: [
    "'a,b,c'.split(',') // ['a', 'b', 'c']",
    "'  ok  '.trim() // 'ok'",
    "'5'.padStart(3, '0') // '005'",
  ],
  prerequisites: ['strings'],
};
