import type { Topic } from '@lg/core';

export const booleansNullUndefinedTopic: Topic = {
  id: 'booleans-null-undefined',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Booleani, null e undefined',
  overview:
    'I booleani (`true`/`false`) governano le condizioni; `undefined` indica un valore mai assegnato, `null` un\'assenza intenzionale. Ogni valore ha una "verità" implicita: `0`, `""`, `null`, `undefined` e `NaN` sono falsy, tutto il resto è truthy.',
  subtopics: [
    { id: 'bnu-booleans', name: 'true e false', overview: 'Il tipo boolean e la negazione con `!`.' },
    { id: 'bnu-truthy-falsy', name: 'Truthy e falsy', overview: 'Quali valori si comportano come falso nelle condizioni.' },
    { id: 'bnu-null-undefined', name: 'null vs undefined', overview: 'Due modi diversi di dire "nessun valore".' },
  ],
  learningObjectives: [
    'Usare valori booleani e la negazione !',
    'Riconoscere i valori falsy (0, "", null, undefined, NaN, false)',
    'Distinguere null (assenza voluta) da undefined (non assegnato)',
    'Sapere che null == undefined ma null !== undefined',
  ],
  commonMistakes: [
    'Pensare che "0" o [] siano falsy (sono truthy!)',
    'Confondere null e undefined nei confronti con ===',
    'Usare == invece di === nei controlli su null/undefined',
    'Aspettarsi che una variabile non inizializzata valga null (vale undefined)',
  ],
  examples: [
    '!true // false',
    'Boolean("") // false — stringa vuota è falsy',
    'null == undefined // true',
    'null === undefined // false',
  ],
  prerequisites: ['primitive-types'],
};
