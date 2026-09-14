import type { Topic } from '@lg/core';

export const primitiveTypesTopic: Topic = {
  id: 'primitive-types',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Tipi primitivi',
  overview:
    'JavaScript ha sette tipi primitivi: string, number, bigint, boolean, undefined, symbol e null. L\'operatore `typeof` rivela il tipo di un valore, con qualche sorpresa storica come `typeof null === "object"`.',
  subtopics: [
    { id: 'primitive-types-typeof', name: 'L\'operatore typeof', overview: 'Restituisce una stringa con il nome del tipo.' },
    { id: 'primitive-types-list', name: 'I sette primitivi', overview: 'string, number, bigint, boolean, undefined, symbol, null.' },
    { id: 'primitive-types-quirks', name: 'Casi particolari', overview: 'typeof NaN, typeof null, typeof di array e funzioni.' },
  ],
  learningObjectives: [
    'Elencare i tipi primitivi di JavaScript',
    'Usare typeof per ispezionare un valore',
    'Conoscere i risultati sorprendenti di typeof (NaN, null, array)',
    'Distinguere primitivi da oggetti',
  ],
  commonMistakes: [
    'Pensare che NaN non sia un number: typeof NaN è "number"',
    'Aspettarsi "null" da typeof null (restituisce "object")',
    'Confondere il tipo con il valore: typeof restituisce sempre una stringa',
    'Pensare che gli array siano un tipo primitivo',
  ],
  examples: [
    'typeof 42 // "number"',
    'typeof "ciao" // "string"',
    'typeof true // "boolean"',
    'typeof undefined // "undefined"',
  ],
  prerequisites: ['variables'],
};
