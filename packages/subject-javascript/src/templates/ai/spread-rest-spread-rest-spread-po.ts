import type { QuestionTemplate } from '@lg/core';
import { defineTemplate, fmt, pickInt, pickOf } from '../helpers.js';

const ARR_NAMES = ['a', 'b', 'c', 'arr', 'nums', 'valori'] as const;
const OBJ_NAMES = ['o', 'obj', 'dati', 'info', 'persona'] as const;
const KEY_NAMES = ['x', 'y', 'z', 'k', 'eta', 'livello'] as const;

export const templates: QuestionTemplate[] = [
  defineTemplate(
    {
      id: 'spread-rest-spread-po',
      topicId: 'spread-rest',
      subtopicId: 'spread-rest-spread',
      type: 'predict-output',
      difficulty: 'medium',
      skills: ['spread', 'array', 'object'],
      tags: ['spread', 'shallow-copy', 'array', 'object'],
    },
    (rng) => {
      const isArray = rng() < 0.5;
      if (isArray) {
        const arrName = pickOf(rng, ARR_NAMES);
        const objKey = pickOf(rng, KEY_NAMES);
        const innerVal = pickInt(rng, 1, 20);
        const correctVal = pickInt(rng, 60, 99);
        const nums = [pickInt(rng, 1, 9), pickInt(rng, 21, 59)];
        const code = `const ${arrName} = [${nums[0]}, ${nums[1]}, { ${objKey}: ${innerVal} }];\nconst copia = [...${arrName}];\ncopia[2].${objKey} = ${correctVal};\nconsole.log(${arrName}[2].${objKey});`;
        const distractor1 = {
          text: fmt(innerVal),
          why: `Lo spread copia solo il primo livello dell'array: l'oggetto interno è condiviso tra \`${arrName}\` e \`copia\`. Modificando \`copia[2].${objKey}\` si modifica anche \`${arrName}[2].${objKey}\`, quindi il risultato è \`${correctVal}\`, non il valore iniziale \`${innerVal}\`.`,
        };
        const distractor2 = {
          text: 'undefined',
          why: `L'oggetto alla posizione 2 dell'array \`${arrName}\` esiste ancora dopo la copia: \`copia[2]\` e \`${arrName}[2]\` puntano allo stesso oggetto, quindi \`${arrName}[2].${objKey}\` è definito e vale ${correctVal}.`,
        };
        const distractor3 = {
          text: fmt(nums[0]),
          why: `La modifica \`copia[2].${objKey} = ${correctVal}\` agisce sull'oggetto condiviso: non cambia nessun valore numerico dell'array, ma solo la proprietà \`${objKey}\` dell'oggetto. Il valore di \`${arrName}[2].${objKey}\` diventa ${correctVal}.`,
        };
        return {
          prompt: `Cosa stampa questo codice?`,
          code,
          correct: {
            text: fmt(correctVal),
            why: `Lo spread crea una copia superficiale dell'array: gli oggetti interni restano condivisi tra \`${arrName}\` e \`copia\`. Modificando la proprietà \`${objKey}\` dell'oggetto interno tramite la copia, cambia anche nell'originale, quindi il risultato è ${correctVal}.`,
          },
          distractors: [distractor1, distractor2, distractor3],
          short: `Lo spread copia solo il primo livello: oggetti interni restano condivisi, quindi la modifica si riflette anche nell'originale.`,
          whyCorrect: `Lo spread su array copia solo il contenitore: gli oggetti interni sono referenziati, non copiati.`,
          concept: 'Spread copia superficialmente: oggetti interni restano condivisi.',
          commonMistake:
            'Pensare che lo spread faccia una copia profonda anche degli oggetti annidati.',
          example:
            'const arr = [1, {x: 2}]; const copia = [...arr]; copia[1].x = 9; // arr[1].x === 9',
        };
      } else {
        const objName = pickOf(rng, OBJ_NAMES);
        const key1 = pickOf(rng, KEY_NAMES);
        const key2 = pickOf(
          rng,
          KEY_NAMES.filter((k) => k !== key1),
        );
        const innerVal = pickInt(rng, 10, 50);
        const correctVal = pickInt(rng, 60, 99);
        const code = `const ${objName} = { ${key1}: 1, ${key2}: { valore: ${innerVal} } };\nconst copia = { ...${objName} };\ncopia.${key2}.valore = ${correctVal};\nconsole.log(${objName}.${key2}.valore);`;
        const distractor1 = {
          text: fmt(innerVal),
          why: `Lo spread su oggetti copia solo le proprietà di primo livello: \`${key2}\` resta un riferimento all'oggetto interno. Modificando \`copia.${key2}.valore\`, anche \`${objName}.${key2}.valore\` cambia, quindi il risultato è ${correctVal} e non il valore iniziale \`${innerVal}\`.`,
        };
        const distractor2 = {
          text: 'undefined',
          why: `La proprietà \`${key2}\` dell'oggetto \`${objName}\` esiste e contiene la chiave \`valore\`. Modificando \`copia.${key2}.valore\` si cambia anche \`${objName}.${key2}.valore\`, quindi non è undefined.`,
        };
        const distractor3 = {
          text: '1',
          why: `La proprietà \`${key1}\` non viene toccata dalla modifica: solo \`${key2}.valore\` viene cambiata in ${correctVal} sia nella copia che nell'originale, perché l'oggetto interno è condiviso.`,
        };
        return {
          prompt: `Cosa stampa questo codice?`,
          code,
          correct: {
            text: fmt(correctVal),
            why: `Lo spread su oggetti crea una copia superficiale: le proprietà di primo livello vengono copiate, ma gli oggetti annidati restano condivisi. Modificando \`valore\` tramite la copia, anche l'originale viene aggiornato, quindi il risultato è ${correctVal}.`,
          },
          distractors: [distractor1, distractor2, distractor3],
          short: `Lo spread copia solo il primo livello: oggetti annidati restano condivisi, quindi la modifica si riflette anche nell'originale.`,
          whyCorrect: `Lo spread su oggetti copia solo le proprietà di primo livello: gli oggetti annidati sono referenziati, non copiati.`,
          concept: 'Spread copia superficialmente: oggetti annidati restano condivisi.',
          commonMistake:
            'Pensare che lo spread faccia una copia profonda anche degli oggetti annidati.',
          example: 'const o = { a: {x: 2} }; const copia = { ...o }; copia.a.x = 9; // o.a.x === 9',
        };
      }
    },
  ),
];
