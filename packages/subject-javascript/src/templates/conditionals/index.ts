import type { QuestionTemplate } from '@lg/core';
import { makeOptions, pickInt, pickName, pickOf, retry, type Rng } from '../helpers.js';

const TOPIC = 'conditionals';
const DD = 'dd-conditionals';

const ternaryFg: QuestionTemplate = {
  id: 'cond-ternary-fg',
  topicId: TOPIC,
  subtopicId: 'conditionals-ternary',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['ternario'],
  tags: ['condizioni'],
  generate(rng: Rng) {
    const name = pickOf(rng, ['eta', 'punti', 'livello']);
    const t = pickInt(rng, 5, 30);
    const code = `const msg = ${name} ___ ${t} ? 'ok' : 'no';`;
    const built = makeOptions(
      rng,
      { text: '>=', why: `La condizione ${name} >= ${t} produce true/false, che il ternario usa.` },
      [
        { text: '=>', why: '=> è la sintassi delle arrow function, non un confronto.' },
        { text: '?', why: '? apre il ramo "vero" del ternario, non è l\'operatore di confronto.' },
        { text: '=', why: '= è assegnazione: renderebbe la condizione sempre vera e sovrascriverebbe la variabile.' },
      ],
    );
    return {
      templateId: 'cond-ternary-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'conditionals-ternary',
      skills: ['ternario'],
      prompt: `Completa: vogliamo msg = 'ok' quando ${name} è almeno ${t}.`,
      code,
      ...built,
      explanation: {
        short: `Il ternario è condizione ? valoreSeVero : valoreSeFalso.`,
        whyCorrect: `${name} >= ${t} è la condizione corretta per "almeno ${t}".`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Operatore ternario',
        commonMistake: 'Confondere ? con il confronto: ? separa i rami, la condizione sta prima.',
        example: 'const etichetta = x > 0 ? "positivo" : "non positivo";',
      },
      deepDiveRef: DD,
    };
  },
};

const ifelsePo: QuestionTemplate = {
  id: 'cond-ifelse-po',
  topicId: TOPIC,
  subtopicId: 'conditionals-if-else',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['if/else'],
  tags: ['condizioni'],
  generate(rng: Rng) {
    return retry(() => {
      const name = pickName(rng);
      const t = pickInt(rng, 5, 15);
      const v = pickInt(rng, 1, 20);
      const yes = v > t;
      const code = `let ${name} = ${v};\nif (${name} > ${t}) {\n  console.log('sopra');\n} else {\n  console.log('sotto');\n}`;
      const correctText = yes ? 'sopra' : 'sotto';
      const built2 = makeOptions(
        rng,
        {
          text: correctText,
          why: `${v} > ${t} è ${yes}, quindi si esegue il ramo ${yes ? 'if' : 'else'}.`,
        },
        [
          { text: yes ? 'sotto' : 'sopra', why: `La condizione ${v} > ${t} è ${yes ? 'vera' : 'falsa'}: si esegue l'altro ramo.` },
          { text: 'sopra\nsotto', why: 'if/else esegue un solo ramo.' },
          { text: 'undefined', why: 'Entrambi i rami stampano una stringa.' },
        ],
      );
      return {
        templateId: 'cond-ifelse-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'conditionals-if-else',
        skills: ['if/else'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built2,
        explanation: {
          short: `${v} > ${t} è ${yes}: si stampa '${correctText}'.`,
          whyCorrect: `Il ramo ${yes ? 'if' : 'else'} è quello eseguito.`,
          whyOthersWrong: built2.whyOthersWrong,
          concept: 'Diramazione if/else',
          commonMistake: 'Leggere la condizione al contrario o pensare che si eseguano entrambi i rami.',
          example: 'if (x > 0) { ... } else { ... } // un solo ramo',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const switchFb: QuestionTemplate = {
  id: 'cond-switch-fb',
  topicId: TOPIC,
  subtopicId: 'conditionals-switch',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['switch', 'break'],
  tags: ['condizioni', 'bug'],
  generate(rng: Rng) {
    const cases = pickOf(rng, [
      ['lunedi', 'martedi', 'altro'],
      ['start', 'stop', 'pausa'],
      ['rosso', 'verde', 'blu'],
      ['nord', 'sud', 'est'],
    ]);
    const g = pickInt(rng, 1, 2);
    const code = `const g = ${g};\nswitch (g) {\n  case 1: console.log('${cases[0]}');\n  case 2: console.log('${cases[1]}');\n  default: console.log('${cases[2]}');\n}`;
    const built = makeOptions(
      rng,
      {
        text: `Manca break: dopo '${cases[g - 1]}' lo switch prosegue e stampa anche i casi successivi`,
        why: 'Senza break il flusso "cade" nei casi successivi (fallthrough).',
      },
      [
        { text: 'switch non accetta numeri', why: 'switch funziona con qualunque valore, numeri inclusi.' },
        { text: 'default va messo per primo', why: 'default può stare in fondo; il problema è il fallthrough.' },
        { text: `case ${g} non è valido`, why: `La sintassi case ${g}: è corretta.` },
      ],
    );
    return {
      templateId: 'cond-switch-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'conditionals-switch',
      skills: ['switch'],
      prompt: `Questo codice dovrebbe stampare solo '${cases[g - 1]}', ma stampa anche altro. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'Senza break, switch esegue tutti i casi da quello corrispondente in poi.',
        whyCorrect: 'Ogni case va chiuso con break (o return).',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Fallthrough dello switch',
        commonMistake: 'Dimenticare il break e ottenere l\'esecuzione a cascata.',
        example: 'case 1: console.log("x"); break;',
      },
      deepDiveRef: DD,
    };
  },
};

const elseIfMc: QuestionTemplate = {
  id: 'cond-elseif-mc',
  topicId: TOPIC,
  subtopicId: 'conditionals-if-else',
  type: 'multiple-choice',
  difficulty: 'medium',
  skills: ['else if'],
  tags: ['condizioni'],
  generate(rng: Rng) {
    return retry(() => {
      const t1 = pickInt(rng, 10, 20);
      const t2 = t1 + pickInt(rng, 5, 10);
      const v = pickInt(rng, t1 + 1, t2 - 1); // tra t1 e t2 → secondo ramo
      const code = `const v = ${v};\nif (v >= ${t2}) {\n  console.log('alto');\n} else if (v >= ${t1}) {\n  console.log('medio');\n} else {\n  console.log('basso');\n}`;
      const built = makeOptions(
        rng,
        { text: 'medio', why: `${v} < ${t2} ma ${v} >= ${t1}: entra nel secondo ramo.` },
        [
          { text: 'alto', why: `${v} >= ${t2} è falso: il primo ramo non si esegue.` },
          { text: 'basso', why: `${v} >= ${t1} è vero: non si arriva all'else.` },
          { text: 'medio\nbasso', why: 'Solo il primo ramo con condizione vera viene eseguito.' },
        ],
      );
      return {
        templateId: 'cond-elseif-mc',
        type: 'multiple-choice',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'conditionals-if-else',
        skills: ['else if'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `Le condizioni si valutano dall'alto: ${v} soddisfa la seconda → 'medio'.`,
          whyCorrect: `v = ${v}: non ≥ ${t2}, ma ≥ ${t1}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Catena else if',
          commonMistake: 'Pensare che vengano eseguiti tutti i rami con condizione vera.',
          example: 'Le condizioni sono esclusive: la prima vera vince.',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const switchBm: QuestionTemplate = {
  id: 'cond-switch-bm',
  topicId: TOPIC,
  subtopicId: 'conditionals-switch',
  type: 'best-method',
  difficulty: 'easy',
  skills: ['switch'],
  tags: ['condizioni', 'best-practice'],
  generate(rng: Rng) {
    const n = pickInt(rng, 4, 9);
    const thing = pickOf(rng, ['un comando', 'un giorno', 'uno stato', 'un codice']);
    const built = makeOptions(
      rng,
      { text: 'switch sul valore', why: 'Con molti casi sullo stesso valore, switch è più leggibile e manutenibile.' },
      [
        { text: `${n} if separati`, why: 'If indipendenti senza else valutano tutte le condizioni: ridondante e rischioso.' },
        { text: 'ternari annidati', why: 'I ternari annidati diventano illeggibili oltre 2 livelli.' },
        { text: 'un ciclo for', why: 'Il for ripete codice, non seleziona tra casi.' },
      ],
    );
    return {
      templateId: 'cond-switch-bm',
      type: 'best-method',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'conditionals-switch',
      skills: ['switch'],
      prompt: `Devi confrontare ${thing} con ${n} valori possibili diversi. Qual è la struttura più adatta?`,
      ...built,
      explanation: {
        short: 'switch è pensato per confrontare un valore con molti casi.',
        whyCorrect: 'Un solo punto di lettura dei casi, con default per il resto.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Quando usare switch',
        commonMistake: 'Catene if/else lunghe su un unico valore.',
        example: 'switch (comando) { case "start": ...; break; default: ... }',
      },
      deepDiveRef: DD,
    };
  },
};

export const conditionalsTemplates: QuestionTemplate[] = [
  ternaryFg,
  ifelsePo,
  switchFb,
  elseIfMc,
  switchBm,
];
