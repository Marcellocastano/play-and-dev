import type { Topic } from '@lg/core';

export const loopsTopic: Topic = {
  id: 'loops',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Cicli',
  overview:
    'I cicli ripetono il codice: `for` classico con contatore, `while` e `do...while` basati su condizione, `for...of` per scorrere gli elementi di un array. `break` esce dal ciclo, `continue` salta all\'iterazione successiva.',
  subtopics: [
    { id: 'loops-for', name: 'for classico', overview: 'inizializzazione; condizione; incremento.' },
    { id: 'loops-while', name: 'while e do...while', overview: 'Ripeti finché la condizione è vera.' },
    { id: 'loops-for-of', name: 'for...of', overview: 'Scorre direttamente i valori di un iterabile.' },
    { id: 'loops-control', name: 'break e continue', overview: 'Uscita anticipata e salto di iterazione.' },
  ],
  learningObjectives: [
    'Scrivere un for con contatore e prevederne le iterazioni',
    'Usare while e do...while (quest\'ultimo esegue almeno una volta)',
    'Scorrere un array con for...of',
    'Usare break e continue in modo appropriato',
  ],
  commonMistakes: [
    'Off-by-one: i <= arr.length scorre un indice di troppo',
    'Dimenticare l\'incremento in un while (ciclo infinito)',
    'Usare for...in sugli array (scorre le chiavi, non i valori)',
    'Modificare l\'array mentre lo si scorre',
  ],
  examples: [
    'for (let i = 0; i < 5; i++) { console.log(i); }',
    'for (const item of lista) { ... }',
    'while (x > 0) { x--; }',
  ],
  prerequisites: ['conditionals', 'operators'],
};
