import type { Topic } from '@lg/core';

export const conditionalsTopic: Topic = {
  id: 'conditionals',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Condizioni',
  overview:
    'Le strutture condizionali eseguono codice in base a una condizione: `if/else` per i casi generali, l\'operatore ternario per scelte brevi e `switch` per confrontare un valore con molti casi.',
  subtopics: [
    { id: 'conditionals-if-else', name: 'if, else if, else', overview: 'La struttura condizionale fondamentale.' },
    { id: 'conditionals-ternary', name: 'Operatore ternario', overview: '`cond ? a : b` per assegnazioni rapide.' },
    { id: 'conditionals-switch', name: 'switch', overview: 'Molti casi sullo stesso valore; attenzione al break.' },
  ],
  learningObjectives: [
    'Scrivere catene if/else if/else',
    'Usare il ternario per espressioni condizionali brevi',
    'Usare switch con break per evitare il fallthrough',
    'Scegliere la struttura più leggibile per il caso',
  ],
  commonMistakes: [
    'Dimenticare il break in uno switch (esegue anche i casi successivi)',
    'Mettere un ; dopo la condizione dell\'if, annullandola',
    'Usare il ternario per logiche troppo complesse',
    'Dimenticare il ramo else quando serve un default',
  ],
  examples: [
    'if (x > 10) { ... } else { ... }',
    'const msg = x > 10 ? "grande" : "piccolo";',
    'switch (giorno) { case 1: ...; break; default: ... }',
  ],
  prerequisites: ['comparisons', 'booleans-null-undefined'],
};
