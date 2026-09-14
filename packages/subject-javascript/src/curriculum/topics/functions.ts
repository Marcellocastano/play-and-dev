import type { Topic } from '@lg/core';

export const functionsTopic: Topic = {
  id: 'functions',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Funzioni',
  overview:
    'Le funzioni incapsulano logica riusabile: si dichiarano con `function`, ricevono parametri e restituiscono un valore con `return`. Senza `return` esplicito restituiscono `undefined`; gli argomenti mancanti valgono `undefined`.',
  subtopics: [
    { id: 'functions-declaration', name: 'Dichiarazione e chiamata', overview: 'function nome(parametri) { ... } e invocazione.' },
    { id: 'functions-return', name: 'return', overview: 'Restituisce un valore e termina la funzione.' },
    { id: 'functions-params', name: 'Parametri e argomenti', overview: 'Argomenti mancanti → undefined; parametri di default.' },
  ],
  learningObjectives: [
    'Dichiarare e invocare funzioni',
    'Usare return per produrre un risultato',
    'Sapere che senza return il risultato è undefined',
    'Gestire argomenti mancanti e parametri di default',
  ],
  commonMistakes: [
    'Dimenticare il return e ottenere undefined',
    'Mettere codice dopo il return (mai eseguito)',
    'Chiamare la funzione senza () aspettandosi il risultato (si ottiene la funzione)',
    'Confondere parametri (nella definizione) e argomenti (nella chiamata)',
  ],
  examples: [
    'function somma(a, b) { return a + b; }',
    'function saluta(nome = "ospite") { return `Ciao ${nome}`; }',
    'const r = somma(2, 3); // 5',
  ],
  prerequisites: ['variables', 'operators'],
};
