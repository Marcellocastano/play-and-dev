import type { QuestionTemplate } from '@lg/core';
import {
  defineTemplate,
  defineTrueFalse,
  fmt,
  pickInt,
  pickName,
  pickOf,
  shuffle,
} from '../helpers.js';

const TOPIC = 'scope-basics';

const shadowPo = defineTemplate(
  {
    id: 'scope-shadow-po',
    topicId: TOPIC,
    subtopicId: 'scope-shadowing',
    type: 'predict-output',
    difficulty: 'hard',
    skills: ['shadowing', 'let'],
    tags: ['scope'],
  },
  (rng) => {
    const name = pickName(rng);
    const outer = pickInt(rng, 1, 9);
    const inner = pickInt(rng, 10, 99);
    const code = `let ${name} = ${outer};\n{\n  let ${name} = ${inner};\n  console.log(${name});\n}\nconsole.log(${name});`;
    return {
      prompt: 'Cosa stampa questo codice?',
      code: code,
      correct: {
        text: `${inner}\n${outer}`,
        why: `Dentro il blocco la seconda \`let ${name}\` fa ombra a quella esterna e stampa ${inner}; usciti dal blocco vale di nuovo la variabile esterna, che stampa ${outer}.`,
      },
      distractors: [
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
      short: `La ${name} interna fa ombra a quella esterna solo dentro il blocco.`,
      whyCorrect: `Sono due variabili distinte: dentro stampa ${inner}, fuori ${outer}.`,
      concept: 'Shadowing con let',
      commonMistake: 'Pensare che il let interno riassegni la variabile esterna.',
      example: 'let x = 1; { let x = 2; } // x esterno resta 1',
    };
  },
);

const blockMc = defineTemplate(
  {
    id: 'scope-block-mc',
    topicId: TOPIC,
    subtopicId: 'scope-block',
    type: 'multiple-choice',
    difficulty: 'easy',
    skills: ['let', 'scope di blocco'],
    tags: ['scope'],
  },
  (rng) => {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `if (true) {\n  let ${name} = ${v};\n}\nconsole.log(${name});`;
    return {
      prompt: 'Cosa succede eseguendo questo codice?',
      code: code,
      correct: {
        text: 'ReferenceError',
        why: `\`let\` ha scope di blocco: ${name} esiste solo tra le graffe dell'\`if\`, quindi il \`console.log\` fuori lancia un ReferenceError.`,
      },
      distractors: [
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
      short: 'let vive solo dentro il suo blocco: fuori è ReferenceError.',
      whyCorrect: 'Lo scope di blocco confina let/const tra le graffe.',
      concept: 'Scope di blocco di let',
      commonMistake: 'Aspettarsi il comportamento di var.',
      example: '{ let a = 1; } console.log(a) // ReferenceError',
    };
  },
);

const varScopeCmp = defineTemplate(
  {
    id: 'scope-var-cmp',
    topicId: TOPIC,
    subtopicId: 'scope-function',
    type: 'compare',
    difficulty: 'medium',
    skills: ['var', 'let', 'scope'],
    tags: ['scope'],
  },
  (rng) => {
    const n = pickInt(rng, 2, 9);
    const codeA = `for (var i = 0; i < ${n}; i++) { }\nconsole.log(i);`;
    const codeB = `for (let i = 0; i < ${n}; i++) { }\nconsole.log(i);`;
    return {
      prompt: 'Confronta i due frammenti: cosa stampa il `console.log` dopo il ciclo in ciascuno?',
      code: `A:\n${codeA}\n\nB:\n${codeB}`,
      correct: {
        text: `\`var\` stampa ${n}, \`let\` dà errore`,
        why: `\`var\` ha scope di funzione: il contatore sopravvive al ciclo e vale ${n}. Con \`let\` il contatore muore col blocco e il log lancia un ReferenceError.`,
      },
      distractors: [
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
      short: `Con var stampa ${n} (il contatore esce dal ciclo); con let è ReferenceError.`,
      whyCorrect: 'var è "function-scoped": i blocchi non la contengono.',
      concept: 'Function scope vs block scope',
      commonMistake: 'Usare var in un for e ritrovarsela fuori.',
      example: 'for (var i = 0; i < 3; i++) {} console.log(i) // 3',
    };
  },
);

const tdzFb = defineTemplate(
  {
    id: 'scope-tdz-fb',
    topicId: TOPIC,
    subtopicId: 'scope-block',
    type: 'find-the-bug',
    difficulty: 'medium',
    skills: ['let', 'TDZ'],
    tags: ['scope', 'bug'],
  },
  (rng) => {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 9);
    const code = `console.log(${name});\nlet ${name} = ${v};`;
    return {
      prompt: `Questo codice dovrebbe stampare ${v} ma lancia un errore. Qual è il bug?`,
      code: code,
      correct: {
        text: 'Accesso prima della `let` (TDZ)',
        why: `Con \`let\` la variabile esiste ma non è accessibile prima della sua riga (Temporal Dead Zone): \`console.log(${name})\` arriva troppo presto e lancia un ReferenceError.`,
      },
      distractors: [
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
      short: 'La Temporal Dead Zone impedisce di leggere let/const prima della dichiarazione.',
      whyCorrect: `console.log(${name}) precede la riga let ${name}: ReferenceError.`,
      concept: 'Temporal Dead Zone',
      commonMistake: "Aspettarsi l'hoisting alla var (che darebbe undefined).",
      example: 'Sposta la dichiarazione sopra il console.log.',
    };
  },
);

const letForFg = defineTemplate(
  {
    id: 'scope-let-fg',
    topicId: TOPIC,
    subtopicId: 'scope-block',
    type: 'fill-the-gap',
    difficulty: 'easy',
    skills: ['let', 'for'],
    tags: ['scope', 'cicli'],
  },
  (rng) => {
    const n = pickInt(rng, 3, 7);
    const i = pickOf(rng, ['i', 'idx', 'k', 'contatore']);
    const code = `for (___ ${i} = 0; ${i} < ${n}; ${i}++) {\n  console.log(${i});\n}\n// ${i} non deve esistere qui fuori`;
    return {
      prompt: `Completa affinché il contatore ${i} esista solo dentro il ciclo.`,
      code: code,
      correct: {
        text: 'let',
        why: `\`let\` confina ${i} al blocco del \`for\`: dopo il ciclo il nome non esiste più, come richiesto.`,
      },
      distractors: [
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
      short: 'let nel for dà al contatore lo scope del ciclo.',
      whyCorrect: "Con let, i è confinata alle graffe e all'header del for.",
      concept: 'let nei for',
      commonMistake: 'Usare var e ritrovare il contatore "inquinato" fuori.',
      example: 'for (let i = 0; i < 3; i++) { } // i muore col ciclo',
    };
  },
);

const SCOPE_FACTS: { text: string; value: boolean; why: string }[] = [
  {
    text: '`const` impedisce di modificare le proprietà di un oggetto assegnato',
    value: false,
    why: "const blocca solo la riassegnazione del nome: le proprietà dell'oggetto restano modificabili, perché il binding punta sempre allo stesso oggetto.",
  },
  {
    text: 'Una variabile `let` dichiarata dentro un blocco `if` non è visibile fuori dal blocco',
    value: true,
    why: 'let ha scope di blocco: la variabile esiste solo tra le graffe che la contengono e fuori produce un ReferenceError.',
  },
  {
    text: '`var` ha scope di funzione, non di blocco',
    value: true,
    why: 'var ignora i blocchi e risale alla funzione che la contiene: fuori da un if o da un ciclo il nome resta visibile.',
  },
  {
    text: 'Leggere una variabile `let` prima della sua dichiarazione restituisce `undefined`',
    value: false,
    why: 'Prima della dichiarazione la variabile è nella zona morta temporale: leggerla lancia un ReferenceError, non undefined.',
  },
  {
    text: 'Due variabili `let` con lo stesso nome possono coesistere nello stesso blocco',
    value: false,
    why: 'let non consente ridichiarazioni nello stesso scope: la seconda dichiarazione è un errore di sintassi a tempo di parsing.',
  },
  {
    text: 'Una variabile `let` dentro un blocco interno può fare ombra a una esterna con lo stesso nome',
    value: true,
    why: 'Lo shadowing è consentito: dentro il blocco il nome si riferisce alla variabile più interna, fuori torna quella esterna.',
  },
  {
    text: 'I parametri di una funzione si comportano come variabili locali',
    value: true,
    why: 'I parametri sono binding locali alla funzione: assegnarli non tocca le variabili esterne con lo stesso nome.',
  },
  {
    text: 'Una variabile dichiarata senza `let`, `const` o `var` resta confinata nella funzione',
    value: false,
    why: "Un'assegnazione senza dichiarazione crea una variabile globale (o lancia in strict mode): non resta locale alla funzione.",
  },
  {
    text: 'Una `const` dichiarata senza valore iniziale vale `undefined`',
    value: false,
    why: 'const senza inizializzatore è un errore di sintassi: la dichiarazione deve assegnare un valore sulla stessa riga.',
  },
  {
    text: 'Una `var` in un ciclo `for` è una variabile nuova a ogni iterazione',
    value: false,
    why: "var condivide un unico binding per tutto il ciclo: le closure create dentro vedono tutte il valore finale.",
  },
  {
    text: 'Una `let` in un ciclo `for` crea un binding distinto a ogni iterazione',
    value: true,
    why: 'Il linguaggio crea un nuovo binding per ogni giro: le closure catturate dentro vedono il valore di quella iterazione.',
  },
  {
    text: 'Le funzioni possono leggere le variabili degli scope esterni in cui sono definite',
    value: true,
    why: 'È la catena di scope: se il nome non è locale, la ricerca risale negli scope esterni fino al globale.',
  },
];

const scopeFactsTf = defineTrueFalse(
  {
    id: 'scope-facts-tf',
    topicId: TOPIC,
    subtopicId: 'scope-block',
    type: 'true-false',
    difficulty: 'easy',
    skills: ['let', 'const', 'var', 'scope'],
    tags: ['scope'],
  },
  (rng) => {
    const picked = shuffle(SCOPE_FACTS, rng).slice(0, 5);
    return {
      prompt: 'Per ogni affermazione, indica se è vera o falsa.',
      statements: picked.map((p) => ({ text: p.text, value: p.value, why: p.why })),
      short: 'Scope, shadowing e zona morta decidono dove un nome è visibile.',
      whyCorrect:
        'Ogni affermazione è vera o falsa in base alle regole di visibilità di let, const e var e alla catena degli scope.',
      concept: 'Scope di blocco, di funzione e shadowing',
      commonMistake: 'Pensare che let prima della dichiarazione valga undefined: è ReferenceError.',
      example: '{ let x = 1; } console.log(x); // ReferenceError',
    };
  },
);

export const scopeBasicsTemplates: QuestionTemplate[] = [
  shadowPo,
  blockMc,
  varScopeCmp,
  tdzFb,
  letForFg,
  scopeFactsTf,
];
