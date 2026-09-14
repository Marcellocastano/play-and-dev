import type { SubjectDefinition } from '@lg/core';
import { javascriptTheme } from './theme.js';
import { levels } from './curriculum/levels.js';
import { topics } from './curriculum/topics/index.js';
import { templates } from './templates/index.js';

export const javascriptSubject: SubjectDefinition = {
  id: 'javascript',
  name: 'JavaScript',
  kind: 'language',
  description:
    'Il linguaggio del web: variabili, tipi, funzioni, array, oggetti e i pattern che li fanno funzionare.',
  icon: 'JS',
  theme: javascriptTheme,
  status: 'available',
  levels,
  topics,
  templates,
  learningObjectives: [
    'Leggere e scrivere JavaScript moderno (let/const, funzioni, template literal)',
    'Prevedere l\'output di frammenti di codice',
    'Riconoscere e correggere i bug più comuni',
    'Usare array e oggetti con i metodi essenziali',
    'Comprendere scope, closure e trasformazioni funzionali',
  ],
};

export { javascriptTheme } from './theme.js';
export { levels } from './curriculum/levels.js';
export { topics } from './curriculum/topics/index.js';
export { templates } from './templates/index.js';
export { deepDives, getDeepDive } from './deepDive/index.js';
export type { DeepDive, DeepDiveSection } from './deepDive/index.js';
