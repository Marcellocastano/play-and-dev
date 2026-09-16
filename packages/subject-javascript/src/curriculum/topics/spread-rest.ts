import type { Topic } from '@lg/core';

export const spreadRestTopic: Topic = {
  id: 'spread-rest',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Spread e rest',
  overview:
    'I tre puntini `...` fanno due lavori opposti: come spread espandono un iterabile o un oggetto dentro un altro, come rest raccolgono gli elementi rimanenti. Servono per copiare, unire e raccogliere senza mutare gli originali.',
  subtopics: [
    {
      id: 'spread-rest-spread',
      name: 'Spread su array e oggetti',
      overview: 'Espandere array e oggetti per copiare o unire senza mutare.',
    },
    {
      id: 'spread-rest-params',
      name: 'Rest nei parametri',
      overview: 'Raccogliere un numero variabile di argomenti in un array.',
    },
    {
      id: 'spread-rest-destructuring',
      name: 'Rest nel destructuring',
      overview: 'Catturare gli elementi rimanenti in array e oggetti.',
    },
  ],
  learningObjectives: [
    'Usare lo spread per copiare e unire array e oggetti',
    'Ricordare che la copia con spread è superficiale',
    'Usare i parametri rest per funzioni variadiche',
    'Usare il rest nel destructuring per gli elementi rimanenti',
  ],
  commonMistakes: [
    'Pensare che lo spread copi in profondità (gli oggetti interni restano condivisi)',
    'Mettere un parametro rest in una posizione diversa dall\u2019ultima',
    'Confondere spread (espande) e rest (raccoglie): stessa sintassi, direzione opposta',
    'Usare `arguments` invece dei parametri rest nelle arrow function (non esiste)',
  ],
  examples: [
    'const copia = [...originale, 4];',
    'const unito = { ...base, extra: true };',
    'function somma(...numeri) { return numeri.reduce((s, n) => s + n, 0); }',
  ],
  prerequisites: ['arrays-basics', 'objects-basics', 'destructuring'],
};
