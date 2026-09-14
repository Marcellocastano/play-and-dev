import type { Topic } from '@lg/core';

export const operatorsTopic: Topic = {
  id: 'operators',
  subjectId: 'javascript',
  levelId: 'beginner',
  name: 'Operatori',
  overview:
    'Gli operatori trasformano e combinano i valori: aritmetici (`+`, `-`, `*`, `/`, `%`, `**`), di assegnazione composta (`+=`, `-=`…), di incremento (`++`, `--`) e logici (`&&`, `||`, `!`). La precedenza decide l\'ordine di valutazione.',
  subtopics: [
    { id: 'operators-assignment', name: 'Assegnazione composta', overview: '+=, -=, *= e le sorelle.' },
    { id: 'operators-increment', name: 'Incremento e decremento', overview: '++ e -- in forma prefissa e postfissa.' },
    { id: 'operators-logical', name: 'Operatori logici', overview: '&&, || e ! con i valori truthy/falsy.' },
    { id: 'operators-precedence', name: 'Precedenza', overview: 'Chi viene calcolato prima e perché servono le parentesi.' },
  ],
  learningObjectives: [
    'Usare le assegnazioni composte per aggiornare variabili',
    'Sapere la differenza tra x++ e ++x',
    'Valutare espressioni con &&, || e !',
    'Applicare la precedenza degli operatori (o usare le parentesi)',
  ],
  commonMistakes: [
    'Scrivere =+ 5 invece di += 5 (assegna +5, non somma)',
    'Aspettarsi che x++ restituisca il valore già incrementato',
    'Dimenticare che && restituisce un valore, non per forza un booleano',
    'Sottovalutare la precedenza: 2 + 3 * 4 è 14, non 20',
  ],
  examples: [
    'let x = 5; x += 3; // x vale 8',
    'let n = 1; n++; // n vale 2',
    'true && false // false',
    '2 + 3 * 4 // 14',
  ],
  prerequisites: ['variables', 'numbers', 'booleans-null-undefined'],
};
