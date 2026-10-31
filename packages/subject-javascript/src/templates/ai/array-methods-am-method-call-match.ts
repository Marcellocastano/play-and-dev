import type { QuestionTemplate } from '@lg/core';
import { defineMatch, fmt, shuffle } from '../helpers.js';

const TOPIC = 'array-methods';

const ARRAY_METHOD_CALLS: { expr: string; result: string; why: string }[] = [
  {
    expr: '[1, 2, 3].map(x => x * 2)',
    result: fmt([1, 2, 3].map((x) => x * 2)),
    why: '`map` applica la funzione a ogni elemento e restituisce un nuovo array: qui ogni elemento viene moltiplicato per 2, quindi il risultato è `[ 2, 4, 6 ]`. Questo non modifica l’array di partenza e produce un array della stessa lunghezza, con tutti i valori raddoppiati.',
  },
  {
    expr: '[5, 8, 12].map(n => n - 1)',
    result: fmt([5, 8, 12].map((n) => n - 1)),
    why: '`map` restituisce un nuovo array dove ogni elemento è diminuito di 1 rispetto all’originale: `[ 4, 7, 11 ]`. La trasformazione avviene elemento per elemento e non altera l’array di partenza.',
  },
  {
    expr: '[2, 4, 6].map(n => n / 2)',
    result: fmt([2, 4, 6].map((n) => n / 2)),
    why: '`map` divide ogni elemento per 2: 2/2=1, 4/2=2, 6/2=3, quindi il risultato è `[ 1, 2, 3 ]`. L’array originale non viene modificato e la trasformazione è applicata a tutti gli elementi.',
  },
  {
    expr: '[4, 5, 6].filter(n => n !== 5)',
    result: fmt([4, 5, 6].filter((n) => n !== 5)),
    why: '`filter` restituisce un nuovo array con solo gli elementi che soddisfano la condizione: qui vengono tenuti solo i valori diversi da 5, quindi il risultato è `[ 4, 6 ]`. Gli elementi che non rispettano la condizione vengono esclusi.',
  },
  {
    expr: '[10, 20, 30].filter(x => x < 25)',
    result: fmt([10, 20, 30].filter((x) => x < 25)),
    why: '`filter` seleziona solo i valori minori di 25: 10 e 20, quindi il risultato è `[ 10, 20 ]`. La funzione di filtro viene applicata a ogni elemento e quelli che non rispettano la condizione vengono scartati.',
  },
  {
    expr: '[7, 8, 9].filter(n => n % 2 === 1)',
    result: fmt([7, 8, 9].filter((n) => n % 2 === 1)),
    why: '`filter` seleziona solo i numeri dispari: 7 e 9, quindi il risultato è `[ 7, 9 ]`. Gli elementi vengono testati individualmente e solo quelli dispari restano nell’array risultante.',
  },
  {
    expr: '[1, 2, 3].reduce((acc, n) => acc + n, 0)',
    result: fmt([1, 2, 3].reduce((acc, n) => acc + n, 0)),
    why: '`reduce` calcola la somma partendo da 0: 0 + 1 = 1, 1 + 2 = 3, 3 + 3 = 6. Il risultato finale è 6, che rappresenta la somma di tutti gli elementi dell’array. Questo metodo restituisce un singolo valore, non un array.',
  },
  {
    expr: '[2, 3, 4].reduce((acc, n) => acc * n, 1)',
    result: fmt([2, 3, 4].reduce((acc, n) => acc * n, 1)),
    why: '`reduce` calcola il valore aggregato partendo da 1 e moltiplicando tutti gli elementi: 1 * 2 = 2, 2 * 3 = 6, 6 * 4 = 24. Il risultato finale è 24, che rappresenta il prodotto di tutti i valori.',
  },
  {
    expr: '[1, 4, 9].reduce((acc, n) => acc - n, 20)',
    result: fmt([1, 4, 9].reduce((acc, n) => acc - n, 20)),
    why: '`reduce` parte da 20 e sottrae ogni elemento: 20 - 1 = 19, 19 - 4 = 15, 15 - 9 = 6. Il risultato finale è 6, ottenuto sottraendo ogni elemento in sequenza.',
  },
  {
    expr: '[4, 5, 6].filter(n => n > 4)',
    result: fmt([4, 5, 6].filter((n) => n > 4)),
    why: '`filter` restituisce un nuovo array con solo gli elementi maggiori di 4: qui rimangono 5 e 6, quindi il risultato è `[ 5, 6 ]`. Gli altri elementi vengono esclusi.',
  },
  {
    expr: '[1, 2, 3].map(x => x + 1)',
    result: fmt([1, 2, 3].map((x) => x + 1)),
    why: '`map` applica la funzione a ogni elemento e restituisce un nuovo array: qui ogni elemento viene incrementato di 1, quindi il risultato è `[ 2, 3, 4 ]`. L’array originale non viene modificato.',
  },
  {
    expr: '[5, 8, 12].map(n => n * 2)',
    result: fmt([5, 8, 12].map((n) => n * 2)),
    why: '`map` restituisce un nuovo array dove ogni elemento è il doppio di quello originale: `[ 10, 16, 24 ]`. La trasformazione è applicata a tutti gli elementi e non modifica l’array di partenza.',
  },
];

export const templates: QuestionTemplate[] = [
  defineMatch(
    {
      id: 'am-method-call-match',
      topicId: TOPIC,
      subtopicId: 'array-methods-map',
      type: 'match',
      difficulty: 'easy',
      skills: ['map', 'filter', 'reduce'],
      tags: ['array', 'metodi'],
    },
    (rng) => {
      const picked = shuffle(ARRAY_METHOD_CALLS, rng).slice(0, 4);
      const results = picked.map((p) => p.result);
      if (new Set(results).size !== picked.length) {
        throw new Error('risultati duplicati tra le chiamate pescate');
      }
      return {
        prompt: 'Abbina ogni chiamata di metodo array al valore che produce.',
        choices: shuffle(
          picked.map((p) => p.result),
          rng,
        ),
        rows: picked.map((p) => ({
          text: `\`${p.expr}\``,
          choice: p.result,
          why: p.why,
        })),
        short:
          'I metodi map, filter e reduce restituiscono nuovi valori calcolati dagli elementi senza modificare l’array originale.',
        whyCorrect:
          'Ogni chiamata produce il valore mostrato: map trasforma ogni elemento, filter seleziona secondo la condizione, reduce aggrega tutti i valori in uno solo. Tutti questi metodi non modificano mai l’array di partenza.',
        concept: 'Risultato dei principali metodi degli array',
        commonMistake:
          'Confondere map e filter, aspettarsi che i metodi modifichino l’array originale o che filter restituisca un singolo valore invece di un array.',
        example:
          '[1,2,3].map(n => n*2) // [2,4,6]   [1,2,3].filter(n => n>1) // [2,3]   [1,2,3].reduce((s,n)=>s+n,0) // 6',
      };
    },
  ),
];
