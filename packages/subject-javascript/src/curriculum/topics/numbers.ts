import type { Topic } from '@lg/core';

export const numbersTopic: Topic = {
  id: 'numbers',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Numeri',
  overview:
    'In JavaScript esiste un solo tipo numerico (`number`, in virgola mobile). Oltre alle quattro operazioni ci sono `%` (resto), `**` (potenza), i metodi di `Math` e le conversioni `Number`/`parseInt`. Le operazioni impossibili producono `NaN`.',
  subtopics: [
    { id: 'numbers-arithmetic', name: 'Aritmetica e resto', overview: '+, -, *, /, % e **.' },
    { id: 'numbers-math', name: 'Math', overview: 'floor, round, max, min e gli altri metodi utili.' },
    { id: 'numbers-conversion', name: 'Conversioni e NaN', overview: 'Number(), parseInt() e il valore NaN.' },
  ],
  learningObjectives: [
    'Eseguire operazioni aritmetiche inclusi % e **',
    'Arrotondare con Math.floor, Math.round e simili',
    'Convertire stringhe in numeri con Number e parseInt',
    'Riconoscere quando un\'operazione produce NaN',
  ],
  commonMistakes: [
    'Sommare un numero a una stringa ottenendo concatenazione ("5" + 3 → "53")',
    'Aspettarsi che parseInt("12px") fallisca: restituisce 12',
    'Confondere Math.floor (sempre giù) con Math.round (al più vicino)',
    'Usare = al posto di === nei confronti numerici',
  ],
  examples: [
    '7 % 3 // 1',
    '2 ** 10 // 1024',
    'Math.floor(4.9) // 4',
    'Number("42") // 42',
  ],
  prerequisites: ['variables', 'primitive-types'],
};
