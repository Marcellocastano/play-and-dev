import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickName, retry, type Rng } from '../helpers.js';

const TOPIC = 'variables';
const DD = 'dd-variables';

const reassignPo: QuestionTemplate = {
  id: 'var-reassign-po',
  topicId: TOPIC,
  subtopicId: 'variables-reassignment',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['let', 'riassegnazione'],
  tags: ['variabili'],
  generate(rng: Rng) {
    return retry(() => {
      const name = pickName(rng);
      const [a, b] = [pickInt(rng, 1, 50), pickInt(rng, 1, 50)];
      const code = `let ${name} = ${a};\n${name} = ${b};\nconsole.log(${name});`;
      const built = makeOptions(
        rng,
        { text: fmt(b), why: `La riassegnazione sovrascrive il valore: ${name} vale ${b}.` },
        [
          { text: fmt(a), why: `${a} era il valore iniziale, ma viene sostituito dalla riassegnazione.` },
          { text: fmt(a + b), why: 'La riassegnazione sostituisce, non somma: il primo valore va perso.' },
          { text: 'undefined', why: 'La variabile è dichiarata e valorizzata: non vale undefined.' },
          { text: 'Errore', why: 'Riassegnare una variabile let è perfettamente lecito.' },
        ],
      );
      return {
        templateId: 'var-reassign-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'variables-reassignment',
        skills: ['let', 'riassegnazione'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `La seconda assegnazione sovrascrive la prima: stampa ${b}.`,
          whyCorrect: `\`${name} = ${b}\` sostituisce il valore precedente; console.log stampa ${b}.`,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Riassegnazione di una variabile let',
          commonMistake: 'Pensare che il primo valore resti "in coda" o che le assegnazioni si sommino.',
          example: 'let x = 1; x = 2; // x vale 2',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const constMc: QuestionTemplate = {
  id: 'var-const-mc',
  topicId: TOPIC,
  subtopicId: 'variables-declaration',
  type: 'multiple-choice',
  difficulty: 'easy',
  skills: ['const'],
  tags: ['variabili'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const built = makeOptions(
      rng,
      { text: 'const', why: '`const` dichiara una costante: non può essere riassegnata.' },
      [
        { text: 'let', why: '`let` crea una variabile riassegnabile, non una costante.' },
        { text: 'var', why: '`var` è la forma storica e anch\'essa è riassegnabile.' },
        { text: 'function', why: '`function` dichiara una funzione, non una costante.' },
      ],
    );
    return {
      templateId: 'var-const-mc',
      type: 'multiple-choice',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'variables-declaration',
      skills: ['const'],
      prompt: `Vuoi dichiarare \`${name}\` in modo che non possa mai cambiare valore. Quale parola chiave usi?`,
      ...built,
      explanation: {
        short: '`const` crea un binding immutabile: riassegnarlo lancia un TypeError.',
        whyCorrect: '`const` è la parola chiave per le costanti in JavaScript.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Dichiarazione di costanti',
        commonMistake: 'Confondere const con "valore immutabile": gli oggetti const possono cambiare dentro.',
        example: `const ${name} = 10; ${name} = 20; // TypeError`,
      },
      deepDiveRef: DD,
    };
  },
};

const constBug: QuestionTemplate = {
  id: 'var-const-bug',
  topicId: TOPIC,
  subtopicId: 'variables-reassignment',
  type: 'find-the-bug',
  difficulty: 'easy',
  skills: ['const', 'riassegnazione'],
  tags: ['variabili', 'bug'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const a = pickInt(rng, 1, 9);
    const b = pickInt(rng, 10, 99);
    const code = `const ${name} = ${a};\n${name} = ${b};\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      {
        text: `${name} è una const e non può essere riassegnata`,
        why: 'Esatto: riassegnare una const lancia TypeError. Servirebbe let.',
      },
      [
        { text: 'console.log non può stampare numeri', why: 'console.log stampa qualunque valore, numeri inclusi.' },
        { text: 'Manca il punto e virgola dopo la dichiarazione', why: 'Il punto e virgola finale è opzionale e non è il problema.' },
        { text: `${name} non è stata dichiarata`, why: `${name} è dichiarata con const alla prima riga.` },
      ],
    );
    return {
      templateId: 'var-const-bug',
      type: 'find-the-bug',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'variables-reassignment',
      skills: ['const'],
      prompt: `Questo codice dovrebbe stampare ${b}, ma lancia un errore. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: 'Una const non può essere riassegnata: la seconda riga lancia TypeError.',
        whyCorrect: `La riga \`${name} = ${b}\` tenta di riassegnare una costante.`,
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Immutabilità del binding const',
        commonMistake: 'Usare const e poi dimenticarsene in fase di aggiornamento del valore.',
        example: 'Per un valore che cambia usa let: let x = 1; x = 2;',
      },
      deepDiveRef: DD,
    };
  },
};

const letFg: QuestionTemplate = {
  id: 'var-let-fg',
  topicId: TOPIC,
  subtopicId: 'variables-declaration',
  type: 'fill-the-gap',
  difficulty: 'easy',
  skills: ['let'],
  tags: ['variabili'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const a = pickInt(rng, 1, 9);
    const b = pickInt(rng, 10, 99);
    const code = `___ ${name} = ${a};\n${name} = ${name} + ${b};\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      { text: 'let', why: '`let` dichiara una variabile riassegnabile con scope di blocco: la scelta moderna.' },
      [
        { text: 'const', why: 'Con const la seconda riga lancerebbe TypeError: non è riassegnabile.' },
        { text: 'var', why: 'var funzionerebbe, ma ha scope di funzione e comportamenti legacy: la prassi moderna è let.' },
        { text: 'function', why: 'function dichiara una funzione, non una variabile numerica.' },
      ],
    );
    return {
      templateId: 'var-let-fg',
      type: 'fill-the-gap',
      difficulty: 'easy' as const,
      topicId: TOPIC,
      subtopicId: 'variables-declaration',
      skills: ['let'],
      prompt: 'Completa il codice con la parola chiave più adatta secondo la prassi moderna.',
      code,
      ...built,
      explanation: {
        short: '`let` dichiara una variabile riassegnabile con scope di blocco.',
        whyCorrect: 'La variabile viene riassegnata nella seconda riga: serve let (o var, ma è sconsigliato).',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'let vs const vs var',
        commonMistake: 'Usare const "per abitudine" anche dove serve riassegnare.',
        example: 'let n = 0; n = n + 1;',
      },
      deepDiveRef: DD,
    };
  },
};

const letVarCmp: QuestionTemplate = {
  id: 'var-let-var-cmp',
  topicId: TOPIC,
  subtopicId: 'variables-var',
  type: 'compare',
  difficulty: 'medium',
  skills: ['let', 'var', 'scope'],
  tags: ['variabili', 'scope'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const built = makeOptions(
      rng,
      {
        text: `let resta confinata al blocco; var dichiarata nel blocco è visibile anche fuori`,
        why: 'var ha scope di funzione: ignora i blocchi if/for e "esce" dal blocco.',
      },
      [
        {
          text: `let e var si comportano allo stesso modo dentro un blocco`,
          why: 'No: let ha scope di blocco, var no — è la differenza principale.',
        },
        {
          text: `var resta confinata al blocco; let è visibile ovunque`,
          why: 'È l\'esatto contrario: è var a ignorare i blocchi.',
        },
        {
          text: `Nessuna delle due può essere dichiarata dentro un blocco`,
          why: 'Entrambe si possono dichiarare in un blocco; cambia solo la loro visibilità.',
        },
      ],
    );
    return {
      templateId: 'var-let-var-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'variables-var',
      skills: ['let', 'var', 'scope'],
      prompt: `In \`if (true) { ... ${name} = 1; }\`, qual è la differenza tra dichiarare ${name} con let e con var?`,
      ...built,
      explanation: {
        short: 'let ha scope di blocco; var ha scope di funzione e ignora i blocchi.',
        whyCorrect: 'Una var dichiarata in un if resta visibile (e vale) anche dopo la graffa.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Scope di blocco vs scope di funzione',
        commonMistake: 'Aspettarsi che var rispetti i confini di un blocco.',
        example: 'if (true) { var v = 1; let l = 2; } // v esiste ancora, l no',
      },
      deepDiveRef: DD,
    };
  },
};

const hoistPo: QuestionTemplate = {
  id: 'var-hoist-po',
  topicId: TOPIC,
  subtopicId: 'variables-var',
  type: 'predict-output',
  difficulty: 'medium',
  skills: ['var', 'hoisting'],
  tags: ['variabili', 'hoisting'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const v = pickInt(rng, 1, 99);
    const code = `console.log(${name});\nvar ${name} = ${v};`;
    const built = makeOptions(
      rng,
      { text: 'undefined', why: 'var viene "sollevata" (hoisting) ma non il valore: stampa undefined.' },
      [
        { text: fmt(v), why: `Il valore ${v} non è ancora assegnato al momento del console.log.` },
        { text: 'ReferenceError', why: 'Con var non c\'è ReferenceError: la dichiarazione è sollevata in cima.' },
        { text: 'null', why: 'Una var non inizializzata vale undefined, non null.' },
      ],
    );
    return {
      templateId: 'var-hoist-po',
      type: 'predict-output',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'variables-var',
      skills: ['var', 'hoisting'],
      prompt: 'Cosa stampa questo codice?',
      code,
      ...built,
      explanation: {
        short: 'L\'hoisting solleva la dichiarazione ma non l\'assegnazione: stampa undefined.',
        whyCorrect: 'È come scrivere: var x; console.log(x); x = v.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Hoisting di var',
        commonMistake: 'Confondere il caso con let/const, che invece lancerebbero ReferenceError (TDZ).',
        example: 'console.log(y); let y = 1; // ReferenceError, a differenza di var',
      },
      deepDiveRef: DD,
    };
  },
};

export const variablesTemplates: QuestionTemplate[] = [
  reassignPo,
  constMc,
  constBug,
  letFg,
  letVarCmp,
  hoistPo,
];
