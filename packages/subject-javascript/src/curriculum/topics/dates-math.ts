import type { Topic } from '@lg/core';

export const datesMathTopic: Topic = {
  id: 'dates-math',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Date e Math',
  overview:
    '`Math` copia il kit matematico (max, min, abs, random, floor), `Number.isInteger`, `parseInt` e `parseFloat` convertono con trappole note, e `Date` gestisce il tempo — con i mesi che partono da 0.',
  subtopics: [
    {
      id: 'dates-math-math',
      name: 'Math',
      overview: 'max, min, abs, random e gli arrotondamenti.',
    },
    {
      id: 'dates-math-number',
      name: 'Number e parsing',
      overview: 'isInteger, parseInt, parseFloat e le loro trappole.',
    },
    {
      id: 'dates-math-date',
      name: 'Date',
      overview: 'Creare date, mesi 0-based e timestamp con getTime.',
    },
  ],
  learningObjectives: [
    'Usare Math.max/min/abs/random correttamente',
    'Distinguere parseInt (tronca alla prima non-cifra) da Number (NaN se sporco)',
    'Ricordare che i mesi di Date partono da 0 e i giorni da 1',
    'Confrontare date con getTime() invece che con gli operatori',
  ],
  commonMistakes: [
    'Dimenticare che new Date(2024, 5, 1) è giugno, non maggio (mesi 0-based)',
    'Usare parseFloat dove serve un intero, o parseInt senza radix',
    'Aspettarsi precisione decimale esatta (0.1 + 0.2 !== 0.3)',
    'Confrontare due Date con === : sono oggetti, si confronta getTime()',
  ],
  examples: [
    'Math.max(3, 9, 4) // 9',
    "parseInt('12px') // 12; Number('12px') // NaN",
    'new Date(2024, 0, 15) // 15 gennaio 2024 (mese 0 = gennaio)',
  ],
  prerequisites: ['numbers', 'objects-basics'],
};
