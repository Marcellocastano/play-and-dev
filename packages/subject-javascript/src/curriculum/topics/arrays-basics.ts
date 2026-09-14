import type { Topic } from '@lg/core';

export const arraysBasicsTopic: Topic = {
  id: 'arrays-basics',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Array (basi)',
  overview:
    'Un array è una lista ordinata di valori con indici da `0` a `length - 1`. `push`/`pop` agiscono in coda, `unshift`/`shift` in testa; `indexOf` e `includes` cercano elementi. Accedere oltre l\'ultimo indice dà `undefined`.',
  subtopics: [
    { id: 'arrays-access', name: 'Indici e length', overview: 'arr[0] è il primo elemento; arr.length il numero di elementi.' },
    { id: 'arrays-mutators', name: 'push, pop, shift, unshift', overview: 'Aggiungere e togliere da testa e coda.' },
    { id: 'arrays-search', name: 'indexOf e includes', overview: 'Trovare la posizione o verificare la presenza.' },
  ],
  learningObjectives: [
    'Accedere agli elementi con gli indici (partendo da 0)',
    'Usare push, pop, shift, unshift e prevederne il risultato',
    'Cercare elementi con indexOf e includes',
    'Sapere che arr[arr.length] è undefined',
  ],
  commonMistakes: [
    'Off-by-one: l\'ultimo indice è length - 1, non length',
    'Pensare che pop restituisca l\'array (restituisce l\'elemento tolto)',
    'Confondere indexOf (posizione o -1) con includes (true/false)',
    'Aspettarsi un errore accedendo a un indice inesistente (si ottiene undefined)',
  ],
  examples: [
    'const a = [10, 20, 30]; a[1] // 20',
    'a.push(40); // a.length diventa 4',
    'a.includes(20) // true',
  ],
  prerequisites: ['variables', 'numbers'],
};
