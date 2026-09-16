import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickName, pickOf, retry, type Rng } from '../helpers.js';

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
          why: `Dentro il blocco la seconda \`let ${name}\` fa ombra a quella esterna e stampa ${inner}; usciti dal blocco vale di nuovo la variabile esterna, che stampa ${outer}.`,
        },
        [
          {
            text: `${outer}\n${outer}`,
            why: `La \`let\` interna non riassegna la variabile esterna ma ne crea una nuova che fa ombra: dentro il blocco il primo log stampa ${inner}, non ${outer}.`,
          },
          {
            text: `${inner}\n${inner}`,
            why: `La \`let\` interna vive solo dentro le graffe: fuori la variabile originale vale ancora ${outer}, quindi il secondo log non stampa ${inner}.`,
          },
          {
            text: 'ReferenceError',
            why: 'Entrambe le variabili sono dichiarate prima di essere lette: il nome esiste in entrambi gli scope e non c’è alcun errore.',
          },
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
        text: 'ReferenceError',
        why: `\`let\` ha scope di blocco: ${name} esiste solo tra le graffe dell'\`if\`, quindi il \`console.log\` fuori lancia un ReferenceError.`,
      },
      [
        {
          text: fmt(v),
          why: `Stampare ${v} corrisponderebbe al comportamento di \`var\`, che ignora i blocchi: con \`let\` la variabile non esiste fuori dalle graffe.`,
        },
        {
          text: 'undefined',
          why: `Con \`var\` l'hoisting darebbe undefined, ma con \`let\` il nome fuori dal blocco non è proprio definito: l'esito è un ReferenceError.`,
        },
        {
          text: 'TypeError',
          why: 'L’errore riguarda un nome non definito nello scope, non un’operazione su un valore: è un ReferenceError, non un TypeError.',
        },
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
    const n = pickInt(rng, 2, 9);
    const codeA = `for (var i = 0; i < ${n}; i++) { }\nconsole.log(i);`;
    const codeB = `for (let i = 0; i < ${n}; i++) { }\nconsole.log(i);`;
    const built = makeOptions(
      rng,
      {
        text: `\`var\` stampa ${n}, \`let\` dà errore`,
        why: `\`var\` ha scope di funzione: il contatore sopravvive al ciclo e vale ${n}. Con \`let\` il contatore muore col blocco e il log lancia un ReferenceError.`,
      },
      [
        {
          text: `\`let\` stampa ${n}, \`var\` dà errore`,
          why: `I due scope sono invertiti: è \`var\` a uscire dal blocco del \`for\` e a stampare ${n}, mentre \`let\` resta confinata e dà errore.`,
        },
        {
          text: 'Stampano entrambe lo stesso',
          why: `\`var\` e \`let\` non sono equivalenti nello scope: solo \`var\` resta visibile dopo il \`for\` e stampa ${n}; con \`let\` il nome non esiste più.`,
        },
        {
          text: 'Danno entrambe errore',
          why: `Solo \`let\` muore col blocco: \`var\` ha scope di funzione, quindi il primo frammento stampa ${n} senza errori.`,
        },
      ],
    );
    return {
      templateId: 'scope-var-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'scope-function',
      skills: ['var', 'let'],
      prompt: 'Confronta i due frammenti: cosa stampa il `console.log` dopo il ciclo in ciascuno?',
      code: `A:\n${codeA}\n\nB:\n${codeB}`,
      ...built,
      explanation: {
        short: `Con var stampa ${n} (il contatore esce dal ciclo); con let è ReferenceError.`,
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
        text: 'Accesso prima della `let` (TDZ)',
        why: `Con \`let\` la variabile esiste ma non è accessibile prima della sua riga (Temporal Dead Zone): \`console.log(${name})\` arriva troppo presto e lancia un ReferenceError.`,
      },
      [
        {
          text: `\`${name}\` va dichiarata con \`const\``,
          why: `Anche \`const\` è soggetta alla TDZ: leggere ${name} prima della dichiarazione darebbe lo stesso errore; il problema è l'ordine delle righe.`,
        },
        {
          text: `Manca \`= ${v}\` nel \`console.log\``,
          why: `\`console.log\` legge il valore, non lo assegna: ${name} va dichiarata (e inizializzata) prima della riga del log.`,
        },
        {
          text: '`let` non accetta numeri',
          why: `\`let\` accetta qualunque tipo di valore, numeri compresi: l'errore nasce perché il log precede la dichiarazione di ${name}.`,
        },
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
        commonMistake: "Aspettarsi l'hoisting alla var (che darebbe undefined).",
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
      {
        text: 'let',
        why: `\`let\` confina ${i} al blocco del \`for\`: dopo il ciclo il nome non esiste più, come richiesto.`,
      },
      [
        {
          text: 'var',
          why: `\`var\` ha scope di funzione e ignora il blocco del \`for\`: dopo il ciclo ${i} resterebbe visibile e varrebbe ${n}.`,
        },
        {
          text: 'const',
          why: `\`const\` vieterebbe la riassegnazione: \`${i}++\` tenterebbe di modificare una costante e lancerebbe un TypeError al primo giro.`,
        },
        {
          text: 'static',
          why: 'In JavaScript `static` serve solo per i membri statici delle classi: non dichiara variabili e darebbe un errore di sintassi.',
        },
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
        whyCorrect: "Con let, i è confinata alle graffe e all'header del for.",
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
