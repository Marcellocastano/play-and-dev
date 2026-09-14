import type { Topic } from '@lg/core';

export const comparisonsTopic: Topic = {
  id: 'comparisons',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Confronti',
  overview:
    'Per confrontare i valori si usano `===` (uguaglianza stretta, senza conversioni) e `==` (uguaglianza debole, con coercion). Le regole moderne consigliano quasi sempre `===`. `<`, `>`, `<=`, `>=` confrontano numeri o stringhe lessicograficamente.',
  subtopics: [
    { id: 'comparisons-strict', name: '=== e !==', overview: 'Confronto senza conversione di tipo: la scelta sicura.' },
    { id: 'comparisons-loose', name: '== e coercion', overview: 'Perché == può sorprendere e quando == null è ammesso.' },
    { id: 'comparisons-order', name: '<, >, <=, >=', overview: 'Confronti numerici e confronti tra stringhe.' },
  ],
  learningObjectives: [
    'Usare === e !== come confronto predefinito',
    'Prevedere i risultati di == con la coercion',
    'Confrontare numeri e stringhe con gli operatori d\'ordine',
    'Evitare il bug classico = al posto di ===',
  ],
  commonMistakes: [
    'Scrivere if (x = 5) assegnando invece di confrontare',
    'Aspettarsi che "5" === 5 sia vero (è false)',
    'Confrontare stringhe aspettandosi un confronto numerico ("10" < "9" è true)',
    'Usare == su tipi misti senza conoscere le regole di coercion',
  ],
  examples: [
    '5 === "5" // false',
    '5 == "5" // true (coercion)',
    '"b" > "a" // true (ordine alfabetico)',
    'null == undefined // true',
  ],
  prerequisites: ['primitive-types', 'booleans-null-undefined'],
};
