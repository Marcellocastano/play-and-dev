import type { Topic } from '@lg/core';

export const stringsTopic: Topic = {
  id: 'strings',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Stringhe',
  overview:
    'Le stringhe sono sequenze immutabili di caratteri. Si concatenano con `+` o con i template literal (backtick), e offrono metodi come `length`, `slice`, `toUpperCase`, `includes`, `trim` e `split`.',
  subtopics: [
    { id: 'strings-length-concat', name: 'Lunghezza e concatenazione', overview: '`.length`, `+` e template literal con `${}`.' },
    { id: 'strings-methods', name: 'Metodi di base', overview: 'toUpperCase, toLowerCase, trim, includes, indexOf.' },
    { id: 'strings-slice', name: 'Estrarre parti', overview: 'slice con indici positivi e negativi; split per dividere.' },
  ],
  learningObjectives: [
    'Concatenare stringhe con + e template literal',
    'Usare length e i metodi di ricerca/trasformazione',
    'Estrarre sottostringhe con slice, anche con indici negativi',
    'Ricordare che le stringhe sono immutabili: i metodi ritornano nuove stringhe',
  ],
  commonMistakes: [
    'Aspettarsi che toUpperCase modifichi la stringa originale',
    'Confondere gli indici di slice (il secondo è escluso)',
    'Usare virgolette singole/doppie per un template literal invece dei backtick',
    'Cercare metodi come upperCase() che non esistono',
  ],
  examples: [
    "'ciao'.length // 4",
    "`Ciao ${nome}!` // template literal",
    "'javascript'.slice(0, 4) // 'java'",
    "'  testo  '.trim() // 'testo'",
  ],
  prerequisites: ['variables', 'primitive-types'],
};
