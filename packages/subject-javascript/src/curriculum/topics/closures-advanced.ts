import type { Topic } from '@lg/core';

export const closuresAdvancedTopic: Topic = {
  id: 'closures-advanced',
  subjectId: 'javascript',
  levelId: 'advanced',
  name: 'Closure avanzate',
  overview:
    'Una closure è una funzione che ricorda le variabili dello scope in cui è stata creata, anche dopo che quello scope è terminato. È il meccanismo dietro contatori privati, factory di funzioni e molti pattern asincroni.',
  subtopics: [
    { id: 'closures-capture', name: 'Cattura delle variabili', overview: 'La funzione interna vede e trattiene lo scope esterno.' },
    { id: 'closures-state', name: 'Stato privato', overview: 'Contatori e incapsulamento senza classi.' },
    { id: 'closures-loops', name: 'Closure nei cicli', overview: 'Il classico problema di var in un ciclo e come let lo risolve.' },
  ],
  learningObjectives: [
    'Riconoscere quando una funzione "cattura" variabili esterne',
    'Creare stato privato con le closure',
    'Prevedere i valori catturati in più invocazioni',
    'Capire la differenza tra var e let nelle closure create in cicli',
  ],
  commonMistakes: [
    'Aspettarsi che ogni chiamata della factory condivida il contatore (ogni chiamata crea scope nuovo)',
    'Catturare var in un ciclo e trovare sempre il valore finale',
    'Pensare che la closure copi il valore (cattura la variabile, non il valore)',
  ],
  examples: [
    'function counter() { let n = 0; return () => ++n; }',
    'const c = counter(); c(); c(); // c() vale 2',
    'for (let i = 0; i < 3; i++) { fns.push(() => i); } // ogni fn vede il suo i',
  ],
  prerequisites: ['functions', 'scope-basics'],
};
