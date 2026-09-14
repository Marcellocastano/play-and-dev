import type { Topic } from '@lg/core';

export const destructuringTopic: Topic = {
  id: 'destructuring',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Destructuring',
  overview:
    'Il destructuring estrae valori da oggetti e array direttamente in variabili: `const { nome } = utente` o `const [primo] = lista`. Supporta rinomina (`{ a: b }`), valori di default e proprietà annidate.',
  subtopics: [
    { id: 'destructuring-objects', name: 'Destructuring di oggetti', overview: 'const { a, b } = obj, con rinomina e default.' },
    { id: 'destructuring-arrays', name: 'Destructuring di array', overview: 'const [x, y] = arr, con salto di elementi e rest.' },
  ],
  learningObjectives: [
    'Estrarre proprietà di oggetti in variabili',
    'Rinominare e assegnare default nel destructuring',
    'Destrutturare array per posizione',
    'Leggere il destructuring nei parametri di funzione',
  ],
  commonMistakes: [
    'Usare la sintassi degli array [] su oggetti o viceversa',
    'Dimenticare che la rinomina è { originale: nuovoNome }, non l\'inverso',
    'Destrutturare undefined/null senza default (TypeError)',
    'Confondere il default (valore mancante) con la rinomina',
  ],
  examples: [
    'const { nome } = { nome: "Ada" }; // nome = "Ada"',
    'const [a, , c] = [1, 2, 3]; // a=1, c=3',
    'const { x: y = 0 } = {}; // y = 0',
  ],
  prerequisites: ['objects-basics', 'arrays-basics'],
};
