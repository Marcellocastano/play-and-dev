import type { Topic } from '@lg/core';

export const jsonTopic: Topic = {
  id: 'json',
  subjectId: 'javascript',
  levelId: 'intermediate',
  name: 'JSON',
  overview:
    '`JSON.stringify` serializza un valore in testo e `JSON.parse` lo riporta in vita. Insieme sono il formato di scambio del web — con regole precise su cosa sopravvive al viaggio e cosa no.',
  subtopics: [
    {
      id: 'json-stringify',
      name: 'JSON.stringify',
      overview: 'Serializzare valori: cosa viene omesso e cosa convertito.',
    },
    {
      id: 'json-parse',
      name: 'JSON.parse',
      overview: 'Deserializzare il testo e gestire gli errori di formato.',
    },
    {
      id: 'json-deep-copy',
      name: 'Copia profonda via JSON',
      overview: 'Clonare strutture annidate e conoscerne i limiti.',
    },
  ],
  learningObjectives: [
    'Serializzare oggetti e array con JSON.stringify',
    'Sapere che undefined, funzioni e Symbol vengono omessi o diventano null',
    'Parsare con JSON.parse gestendo gli errori di sintassi',
    'Usare stringify+parse per una copia profonda, conoscendone i limiti (Date, Map, riferimenti ciclici)',
  ],
  commonMistakes: [
    'Aspettarsi che Date, Map o Set sopravvivano a JSON (diventano stringhe o oggetti vuoti)',
    'Parsare input esterno senza try/catch: JSON.parse lancia su testo non valido',
    'Usare virgolette singole nel JSON: richiede quelle doppie',
    'Copiare in profondità un oggetto con riferimenti ciclici (TypeError)',
  ],
  examples: [
    'JSON.stringify({ a: 1, b: undefined }) // \'{"a":1}\'',
    'JSON.parse(\'{"x": 2}\').x // 2',
    'const copia = JSON.parse(JSON.stringify(originale));',
  ],
  prerequisites: ['objects-basics', 'errors'],
};
