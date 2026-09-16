import type { Topic } from '@lg/core';

export const objectsAdvancedTopic: Topic = {
  id: 'objects-advanced',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'Oggetti avanzati',
  overview:
    '`Object.keys`, `values` ed `entries` trasformano gli oggetti in array per iterare e filtrare. Le shorthand e le chiavi computate rendono i letterali più compatti, mentre `?.` e `??` gestiscono i valori mancanti senza errori.',
  subtopics: [
    {
      id: 'objects-advanced-entries',
      name: 'keys, values, entries',
      overview: 'Convertire un oggetto in array per iterarlo.',
    },
    {
      id: 'objects-advanced-literals',
      name: 'Shorthand e chiavi computate',
      overview: 'Scorciatoie e chiavi dinamiche nei letterali oggetto.',
    },
    {
      id: 'objects-advanced-chaining',
      name: 'Optional chaining e ??',
      overview: 'Accessi sicuri e default con `?.` e `??`.',
    },
  ],
  learningObjectives: [
    'Iterare un oggetto con Object.keys/values/entries',
    'Usare la shorthand delle proprietà e le chiavi computate',
    'Leggere proprietà annidate in sicurezza con `?.`',
    'Distinguere `??` (solo null/undefined) da `||` (tutti i falsy)',
  ],
  commonMistakes: [
    'Iterare un oggetto con for...of (non è iterabile: serve Object.entries)',
    'Usare `||` per un default e perdere i valori falsy legittimi come 0 o ""',
    'Dimenticare che le chiavi computate vanno tra parentesi quadre `[expr]`',
    'Confondere `a?.b` (valore mancante → undefined) con un controllo di esistenza completo',
  ],
  examples: [
    'Object.entries({ a: 1 }) // [["a", 1]]',
    'const o = { [chiave]: valore };',
    'utente.indirizzo?.citta ?? "sconosciuta"',
  ],
  prerequisites: ['objects-basics', 'destructuring'],
};
