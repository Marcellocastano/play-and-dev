import type { Topic } from '@lg/core';

export const variablesTopic: Topic = {
  id: 'variables',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Variabili',
  overview:
    'Le variabili sono contenitori per i dati. In JavaScript moderno si usano `let` per i valori che cambiano e `const` per quelli che restano fissi; `var` è la forma storica con regole di scope diverse.',
  subtopics: [
    { id: 'variables-declaration', name: 'Dichiarazione con let e const', overview: 'Come creare una variabile e assegnarle un valore.' },
    { id: 'variables-reassignment', name: 'Riassegnazione', overview: 'Cambiare il valore di una variabile `let`; `const` non lo consente.' },
    { id: 'variables-var', name: 'var e hoisting', overview: 'Il comportamento legacy di `var` e perché si evita.' },
    { id: 'variables-tdz', name: 'Temporal Dead Zone', overview: 'Usare `let`/`const` prima della dichiarazione genera un errore.' },
  ],
  learningObjectives: [
    'Dichiarare variabili con let e const',
    'Sapere quando riassegnare è consentito',
    'Riconoscere le differenze tra let, const e var',
    'Capire cosa succede usando una variabile prima di dichiararla',
  ],
  commonMistakes: [
    'Riassegnare una const (TypeError)',
    'Usare var aspettandosi lo scope di blocco',
    'Leggere una let prima della sua dichiarazione (ReferenceError)',
    'Dimenticare la parola chiave e creare una globale implicita',
  ],
  examples: [
    'let punteggio = 0; punteggio = 10;',
    "const nome = 'Ada'; // nome non può essere riassegnato",
    'var legacy = true; // forma storica, da evitare',
  ],
  prerequisites: [],
};
