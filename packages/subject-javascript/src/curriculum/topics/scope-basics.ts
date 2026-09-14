import type { Topic } from '@lg/core';

export const scopeBasicsTopic: Topic = {
  id: 'scope-basics',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Scope (basi)',
  overview:
    'Lo scope determina dove una variabile è visibile. `let` e `const` hanno scope di blocco (`{ ... }`), `var` ha scope di funzione. Una variabile interna può "fare ombra" (shadowing) a una esterna con lo stesso nome.',
  subtopics: [
    { id: 'scope-block', name: 'Scope di blocco', overview: 'let/const esistono solo dentro le graffe che le contengono.' },
    { id: 'scope-function', name: 'Scope di funzione (var)', overview: 'var ignora i blocchi e vale in tutta la funzione.' },
    { id: 'scope-shadowing', name: 'Shadowing', overview: 'La variabile più interna vince nel suo blocco.' },
  ],
  learningObjectives: [
    'Sapere che let/const non esistono fuori dal loro blocco',
    'Riconoscere lo shadowing tra variabili omonime',
    'Capire perché var "esce" dai blocchi',
    'Leggere codice con variabili a scope diversi',
  ],
  commonMistakes: [
    'Usare una let fuori dal blocco in cui è dichiarata (ReferenceError)',
    'Aspettarsi che una var dichiarata in un if resti confinata',
    'Riutilizzare lo stesso nome creando shadowing involontario',
    'Confondere shadowing (nuova variabile) con riassegnazione',
  ],
  examples: [
    'if (true) { let x = 1; } console.log(x); // ReferenceError',
    'if (true) { var y = 1; } console.log(y); // 1 — var esce dal blocco',
    'let n = 1; { let n = 2; /* shadowing */ }',
  ],
  prerequisites: ['variables', 'conditionals'],
};
