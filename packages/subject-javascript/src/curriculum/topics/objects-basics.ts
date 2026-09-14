import type { Topic } from '@lg/core';

export const objectsBasicsTopic: Topic = {
  id: 'objects-basics',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Oggetti (basi)',
  overview:
    'Un oggetto raccoglie coppie chiave-valore. Le proprietà si leggono con `obj.chiave` o `obj["chiave"]` (necessario per chiavi dinamiche o con spazi); si aggiungono assegnando, si rimuovono con `delete`, si verificano con `in`.',
  subtopics: [
    { id: 'objects-access', name: 'Dot notation e bracket notation', overview: 'obj.prop vs obj["prop"] e quando serve la seconda.' },
    { id: 'objects-mutation', name: 'Aggiungere e rimuovere proprietà', overview: 'Assegnazione diretta e delete.' },
    { id: 'objects-methods-in', name: 'Metodi e operatore in', overview: 'Funzioni come proprietà; verifica di esistenza con in.' },
  ],
  learningObjectives: [
    'Leggere e scrivere proprietà con dot e bracket notation',
    'Aggiungere e cancellare proprietà a runtime',
    'Definire metodi e invocarli con ()',
    'Verificare l\'esistenza di una chiave con in',
  ],
  commonMistakes: [
    'Usare obj.key dove key è una variabile: serve obj[key]',
    'Leggere obj.metodo senza () ottenendo la funzione, non il risultato',
    'Aspettarsi un errore per una proprietà inesistente (si ottiene undefined)',
    'Confondere la chiave con il valore',
  ],
  examples: [
    'const u = { nome: "Ada", eta: 36 }; u.nome // "Ada"',
    'u["nome"] // "Ada" — utile con chiavi dinamiche',
    '"nome" in u // true',
    'delete u.eta;',
  ],
  prerequisites: ['variables', 'primitive-types', 'functions'],
};
