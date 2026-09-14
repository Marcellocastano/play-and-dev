import type { Topic } from '@lg/core';

export const arrayMethodsTopic: Topic = {
  id: 'array-methods',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Metodi degli array',
  overview:
    '`map`, `filter`, `find` e `reduce` trasformano e interrogano gli array senza mutarli. Sono il cuore della programmazione funzionale in JavaScript e sostituiscono la maggior parte dei cicli for.',
  subtopics: [
    { id: 'array-methods-map', name: 'map', overview: 'Trasforma ogni elemento e ritorna un nuovo array.' },
    { id: 'array-methods-filter-find', name: 'filter e find', overview: 'Selezionare elementi che soddisfano una condizione.' },
    { id: 'array-methods-reduce', name: 'reduce', overview: 'Comprimere un array in un singolo valore.' },
  ],
  learningObjectives: [
    'Usare map per trasformazioni elemento per elemento',
    'Usare filter e find per selezioni',
    'Usare reduce per aggregazioni',
    'Ricordare che questi metodi non mutano l\'array originale',
  ],
  commonMistakes: [
    'Dimenticare il return nella callback di map',
    'Usare forEach aspettandosi un nuovo array (ritorna undefined)',
    'Omettere il valore iniziale di reduce su array che possono essere vuoti',
    'Confondere find (primo elemento) con filter (tutti gli elementi)',
  ],
  examples: [
    '[1, 2, 3].map((n) => n * 2) // [2, 4, 6]',
    '[1, 2, 3].filter((n) => n > 1) // [2, 3]',
    '[1, 2, 3].reduce((s, n) => s + n, 0) // 6',
  ],
  prerequisites: ['arrays-basics', 'functions'],
};
