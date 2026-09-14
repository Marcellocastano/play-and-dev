import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickName, pickOf, retry, shuffle, type Rng } from '../helpers.js';

const TOPIC = 'scope-basics';
const DD = 'dd-scope-basics';

const shadowPo: QuestionTemplate = {
  id: 'scope-shadow-po',
  topicId: TOPIC,
  subtopicId: 'scope-shadowing',
  type: 'predict-output',
  difficulty: 'hard',
  skills: ['shadowing', 'let'],
  tags: ['scope'],
  generate(rng: Rng) {
    return retry(() => {
      const name = pickName(rng);
      const outer = pickInt(rng, 1, 9);
      const inner = pickInt(rng, 10, 99);
      const code = `let ${name} = ${outer};\n{\n  let ${name} = ${inner};\n  console.log(${name});\n}\nconsole.log(${name});`;
      const built = makeOptions(
        rng,
        {
          text: `${inner}\n${outer}`,
          why: `Dentro il blocco vale la ${name} interna (${inner}); fuori resta ${outer}.`,
        },
        [
          { text: `${outer}\n${outer}`, why: 'Il let interno fa shadowing: dentro il blocco vale il valore interno.' },
          { text: `${inner}\n${inner}`, why: 'Il let interno vale solo nel blocco: fuori resta il valore originale.' },
          { text: 'ReferenceError', why: 'Entrambe le variabili sono dichiarate prima dell\'uso: nessun errore.' },
        ],
      );
      return {
        templateId: 'scope-shadow-po',
        type: 'predict-output',
        difficulty: 'hard' as const,
        topicId: TOPIC,
        subtopicId: 'scope-shadowing',
        skills: ['shadowing'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `La ${name} interna fa ombra a quella esterna solo dentro il blocco.`,
          whyCorrect: `Sono due variabili distinte: dentro stampa ${inner}, fuori ${outer}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Shadowing con let',
          commonMistake: 'Pensare che il let interno riassegni la variabile esterna.',
          example: 'let x = 1; { let x = 2; } // x esterno resta 1',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const blockMc: QuestionTemplate = {
  id: 'scope-block-mc',
  topicId: TOPIC,
  subtopicId: 'scope-block',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['let', 'scope di blocco'],
  tags: ['scope'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `if (true) {\n  let ${name} = ${v};\n}\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      {
        text: `ReferenceError: ${name} is not defined`,
        why: 'let ha scope di blocco: fuori dalle graffe la variabile non esiste.',
      },
      [
        { text: fmt(v), why: `Sarebbe il risultato con var: let non esce dal blocco.` },
        { text: 'undefined', why: 'La variabile non esiste proprio fuori dal blocco: è un errore, non undefined.' },
        { text: 'null', why: 'Non c\'è alcun valore da stampare: l\'esecuzione si ferma con un errore.' },
      ],
    );
    return {
      templateId: 'scope-block-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'scope-block',
      skills: ['let', 'scope'],
      prompt: 'Cosa succede eseguendo questo codice?',
      code,
      ...built,
      explanation: {
        short: 'let vive solo dentro il suo blocco: fuori è ReferenceError.',
        whyCorrect: 'Lo scope di blocco confina let/const tra le graffe.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Scope di blocco di let',
        commonMistake: 'Aspettarsi il comportamento di var.',
        example: '{ let a = 1; } console.log(a) // ReferenceError',
      },
      deepDiveRef: DD,
    };
  },
};

const varScopeCmp: QuestionTemplate = {
  id: 'scope-var-cmp',
  topicId: TOPIC,
  subtopicId: 'scope-function',
  type: 'compare',
  difficulty: 'medium',
  skills: ['var', 'let', 'scope'],
  tags: ['scope'],
  generate(rng: Rng) {
    const v = pickInt(rng, 1, 99);
    const trueStatements = [
      { text: 'var ha scope di funzione: dichiarata in un blocco è visibile anche fuori', why: `var ignora i blocchi: if (true) { var x = ${v}; } → x è visibile dopo e vale ${v}.` },
      { text: 'let dichiarata in un blocco non esiste fuori dal blocco', why: 'let/const hanno scope di blocco: oltre la graffa è ReferenceError.' },
      { text: 'var in un ciclo for resta visibile dopo il ciclo', why: 'var non ha scope di blocco: il contatore "esce".' },
      { text: 'let e const condividono lo scope di blocco', why: 'Entrambe sono confinate dalle graffe; var no.' },
    ];
    const falseStatements = [
      { text: 'var ha scope di blocco come let', why: 'No: è la differenza principale tra var e let.' },
      { text: 'let è visibile ovunque nello script', why: 'let è confinata al blocco che la contiene.' },
      { text: 'var dichiarata in un blocco dà ReferenceError fuori', why: 'Questo è il comportamento di let, non di var.' },
      { text: 'let in un for è visibile dopo il ciclo', why: 'let muore col blocco del for; è var a sopravvivere.' },
    ];
    const built = makeOptions(
      rng,
      pickOf(rng, trueStatements),
      shuffle(falseStatements, rng).slice(0, 3),
    );
    return {
      templateId: 'scope-var-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'scope-function',
      skills: ['var', 'let'],
      prompt: 'Qual è la differenza di scope tra var e let dentro un blocco (es. un if)?',
      ...built,
      explanation: {
        short: 'var esce dai blocchi, let no.',
        whyCorrect: 'var è "function-scoped": i blocchi non la contengono.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Function scope vs block scope',
        commonMistake: 'Usare var in un for e ritrovarsela fuori.',
        example: 'for (var i = 0; i < 3; i++) {} console.log(i) // 3',
      },
      deepDiveRef: DD,
    };
  },
};

const tdzFb: QuestionTemplate = {
  id: 'scope-tdz-fb',
  topicId: TOPIC,
  subtopicId: 'scope-block',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['let', 'TDZ'],
  tags: ['scope', 'bug'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `console.log(${name});\nlet ${name} = ${v};`;
    const built = makeOptions(
      rng,
      {
        text: `${name} è usata prima della dichiarazione: con let si è nella TDZ → ReferenceError`,
        why: 'A differenza di var, let/const non sono accessibili prima della riga di dichiarazione.',
      },
      [
        { text: 'Manca il punto e virgola', why: 'Il punto e virgola è opzionale e non è il problema.' },
        { text: 'console.log va dopo ogni dichiarazione', why: 'Non è una regola: il problema è leggere una let prima che esista.' },
        { text: 'Bisogna usare var in cima al file', why: 'Usare var "risolverebbe" solo perché var è sollevata: la vera soluzione è spostare la dichiarazione prima dell\'uso.' },
      ],
    );
    return {
      templateId: 'scope-tdz-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'scope-block',
      skills: ['TDZ'],
      prompt: `Questo codice dovrebbe stampare ${v} ma lancia un errore. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'La Temporal Dead Zone impedisce di leggere let/const prima della dichiarazione.',
        whyCorrect: `console.log(${name}) precede la riga let ${name}: ReferenceError.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Temporal Dead Zone',
        commonMistake: 'Aspettarsi l\'hoisting alla var (che darebbe undefined).',
        example: 'Sposta la dichiarazione sopra il console.log.',
      },
      deepDiveRef: DD,
    };
  },
};

const letForFg: QuestionTemplate = {
  id: 'scope-let-fg',
  topicId: TOPIC,
  subtopicId: 'scope-block',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['let', 'for'],
  tags: ['scope', 'cicli'],
  generate(rng: Rng) {
    const n = pickInt(rng, 3, 7);
    const i = pickOf(rng, ['i', 'idx', 'k', 'contatore']);
    const code = `for (___ ${i} = 0; ${i} < ${n}; ${i}++) {\n  console.log(${i});\n}\n// ${i} non deve esistere qui fuori`;
    const built = makeOptions(
      rng,
      { text: 'let', why: `let confina ${i} al blocco del for: fuori non esiste.` },
      [
        { text: 'var', why: `var ha scope di funzione: ${i} resterebbe visibile fuori dal ciclo.` },
        { text: 'const', why: `const non permette ${i}++: la riassegnazione lancerebbe TypeError.` },
        { text: 'static', why: 'static non è una parola chiave per le variabili in JavaScript.' },
      ],
    );
    return {
      templateId: 'scope-let-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'scope-block',
      skills: ['let'],
      prompt: `Completa affinché il contatore ${i} esista solo dentro il ciclo.`,
      code,
      ...built,
      explanation: {
        short: 'let nel for dà al contatore lo scope del ciclo.',
        whyCorrect: 'Con let, i è confinata alle graffe e all\'header del for.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'let nei for',
        commonMistake: 'Usare var e ritrovare il contatore "inquinato" fuori.',
        example: 'for (let i = 0; i < 3; i++) { } // i muore col ciclo',
      },
      deepDiveRef: DD,
    };
  },
};

export const scopeBasicsTemplates: QuestionTemplate[] = [
  shadowPo,
  blockMc,
  varScopeCmp,
  tdzFb,
  letForFg,
];
