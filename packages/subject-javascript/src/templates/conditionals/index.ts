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
      {
        text: '>=',
        why: `La condizione \`${name} >= ${t}\` restituisce true quando ${name} è almeno ${t}: è ciò che serve al ternario.`,
      },
      [
        {
          text: '=>',
          why: '`=>` è la sintassi delle arrow function, non un operatore di confronto: in quel punto darebbe un errore di sintassi.',
        },
        {
          text: '?',
          why: '`?` apre il ramo "vero" del ternario e arriva dopo la condizione: qui serve un operatore che confronti ${name} con ${t}.',
        },
        {
          text: '=',
          why: `\`=\` assegnerebbe ${t} a ${name} invece di confrontarlo: la condizione risulterebbe sempre vera e la variabile verrebbe sovrascritta.`,
        },
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
          why: `La condizione \`${name} > ${t}\` con ${name} = ${v} vale ${yes}: si esegue il ramo ${yes ? 'if' : 'else'} e si stampa '${correctText}'.`,
        },
        [
          {
            text: yes ? 'sotto' : 'sopra',
            why: `La condizione ${v} > ${t} vale ${yes}: il ramo che stampa '${yes ? 'sotto' : 'sopra'}' non viene raggiunto.`,
          },
          {
            text: 'sopra\nsotto',
            why: 'Un `if/else` esegue un solo ramo: scelto quello corrispondente alla condizione, l’altro viene saltato.',
          },
          {
            text: 'undefined',
            why: 'Entrambi i rami contengono un `console.log` con una stringa: qualunque sia la condizione, qualcosa viene stampato.',
          },
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
          commonMistake:
            'Leggere la condizione al contrario o pensare che si eseguano entrambi i rami.',
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
  difficulty: 'hard',
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
        text: 'Manca `break` dopo ogni `case`',
        why: `Lo switch trova \`case ${g}\` e stampa '${cases[g - 1]}', ma senza \`break\` l'esecuzione prosegue nei casi successivi (fallthrough) e stampa anche il resto.`,
      },
      [
        {
          text: '`default` deve stare per primo',
          why: 'La posizione di `default` è libera: qui sta in fondo, ed è comunque quello che viene eseguito per i casi non corrispondenti.',
        },
        {
          text: '`switch` confronta con `==`',
          why: `\`switch\` confronta con l'uguaglianza stretta \`===\`, e qui \`case ${g}\` corrisponde proprio al valore di \`g\`: il confronto funziona. Il problema è che, trovata la corrispondenza, l'esecuzione continua nei \`case\` successivi perché manca \`break\`.`,
        },
        {
          text: '`case` richiede le parentesi',
          why: 'La sintassi `case valore:` è quella corretta: le parentesi non servono e il codice compila e gira senza errori.',
        },
      ],
    );
    return {
      templateId: 'cond-switch-fb',
      type: 'find-the-bug',
      difficulty: 'hard' as const,
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
        commonMistake: "Dimenticare il break e ottenere l'esecuzione a cascata.",
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
        {
          text: 'medio',
          why: `La prima condizione ${v} >= ${t2} è falsa, ma la seconda ${v} >= ${t1} è vera: si esegue il ramo \`else if\` e si stampa 'medio'.`,
        },
        [
          {
            text: 'alto',
            why: `Per stampare 'alto' servirebbe ${v} >= ${t2}, ma ${v} è minore di ${t2}: il primo ramo viene saltato.`,
          },
          {
            text: 'basso',
            why: `Il ramo \`else\` si raggiunge solo se nessuna condizione è vera: qui ${v} >= ${t1} è vera, quindi si ferma a 'medio'.`,
          },
          {
            text: 'medio\nbasso',
            why: "In una catena `if/else if/else` si esegue solo il primo ramo con condizione vera: dopo 'medio' l'`else` viene saltato.",
          },
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
  difficulty: 'medium',
  skills: ['switch'],
  tags: ['condizioni', 'best-practice'],
  generate(rng: Rng) {
    const n = pickInt(rng, 4, 9);
    const built = makeOptions(
      rng,
      {
        text: 'Uno `switch` con `default`',
        why: `Con ${n} casi distinti più un fallback, lo \`switch\` elenca i casi in modo leggibile e \`default\` copre tutto il resto.`,
      },
      [
        {
          text: `Una catena di ${n} \`if\` separati`,
          why: `Senza \`else\` ogni \`if\` viene valutato anche dopo aver trovato il caso giusto, e manca un punto unico per il fallback: la struttura non è pensata per ${n} alternative.`,
        },
        {
          text: 'Ternari `? :` annidati',
          why: `Annidare ${n} ternari produce un'unica espressione illeggibile e fragile: i ternari sono adatti a due esiti, non a una lista di casi.`,
        },
        {
          text: 'Un solo `if` con `||`',
          why: `\`||\` unisce le condizioni in un unico vero/falso: non permette di distinguere quale dei ${n} valori è arrivato né di assegnare azioni diverse.`,
        },
      ],
    );
    return {
      templateId: 'cond-switch-bm',
      type: 'best-method',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'conditionals-switch',
      skills: ['switch'],
      prompt: `Devi confrontare \`comando\` con ${n} valori distinti, ognuno con la propria azione, più un caso di fallback, in modo leggibile. Qual è la struttura più adatta?`,
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
