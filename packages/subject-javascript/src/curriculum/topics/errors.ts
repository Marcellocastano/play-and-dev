import type { Topic } from '@lg/core';

export const errorsTopic: Topic = {
  id: 'errors',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Errori',
  overview:
    '`throw` solleva un errore, `try/catch/finally` lo gestisce. Gli oggetti `Error` portano `name` e `message`, e JavaScript lancia da solo `TypeError`, `ReferenceError` e `RangeError` in situazioni precise.',
  subtopics: [
    {
      id: 'errors-try-catch',
      name: 'try/catch/finally',
      overview: 'Intercettare gli errori ed eseguire sempre il cleanup.',
    },
    {
      id: 'errors-throw',
      name: 'throw e oggetto Error',
      overview: 'Sollevare errori con messaggi e nomi significativi.',
    },
    {
      id: 'errors-native',
      name: 'Errori nativi',
      overview: 'TypeError, ReferenceError e RangeError lanciati dal linguaggio.',
    },
  ],
  learningObjectives: [
    'Intercettare un errore con try/catch e capire il ruolo di finally',
    'Sollevare errori significativi con throw new Error(...)',
    'Leggere name e message di un oggetto Error',
    'Riconoscere quando il linguaggio lancia TypeError, ReferenceError o RangeError',
  ],
  commonMistakes: [
    'Lanciare una stringa invece di un oggetto Error (si perdono name e stack)',
    'Pensare che finally giri solo in caso di errore (gira sempre)',
    'Confondere ReferenceError (nome non definito) con TypeError (operazione su tipo sbagliato)',
    'Catturare tutto con catch e ignorare l\u2019errore, rendendo i bug invisibili',
  ],
  examples: [
    "try { JSON.parse(testo) } catch (e) { console.log('non valido'); }",
    "throw new TypeError('atteso un numero');",
    'try { ... } finally { risorsa.chiudi(); }',
  ],
  prerequisites: ['functions', 'objects-basics'],
};
