import type { LevelDefinition } from '@lg/core';

export const BEGINNER_TOPIC_IDS = [
  'variables',
  'primitive-types',
  'strings',
  'numbers',
  'booleans-null-undefined',
  'operators',
  'comparisons',
  'conditionals',
  'loops',
  'functions',
  'scope-basics',
  'arrays-basics',
  'objects-basics',
] as const;

export const INTERMEDIATE_TOPIC_IDS = [
  'array-methods',
  'destructuring',
  'spread-rest',
  'string-methods-advanced',
  'objects-advanced',
  'errors',
  'json',
  'dates-math',
] as const;

export const ADVANCED_TOPIC_IDS = [
  'closures-advanced',
  'async-await',
  'promises',
  'prototypes',
  'iterators-generators',
] as const;

export const levels: LevelDefinition[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Le basi del linguaggio: variabili, tipi, operatori, controlli di flusso, funzioni, array e oggetti.',
    topicIds: [...BEGINNER_TOPIC_IDS],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Metodi degli array, destructuring, spread/rest, errori e strutture dati più ricche.',
    topicIds: [...INTERMEDIATE_TOPIC_IDS],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Closure, asincronia, prototype e pattern avanzati del linguaggio.',
    topicIds: [...ADVANCED_TOPIC_IDS],
  },
];
