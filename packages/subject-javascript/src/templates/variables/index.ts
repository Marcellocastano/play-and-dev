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
        {
          text: fmt(b),
          why: `La riga \`${name} = ${b}\` sovrascrive il valore precedente, quindi il log stampa ${b}.`,
        },
        [
          {
            text: fmt(a),
            why: `${a} era il valore della prima riga, ma \`${name} = ${b}\` lo sostituisce prima della stampa: stampare ${a} vorrebbe dire ignorare la riassegnazione.`,
          },
          {
            text: fmt(a + b),
            why: `L'assegnazione non accumula: \`${name} = ${b}\` sostituisce il valore, quindi ${a} e ${b} non si sommano.`,
          },
          {
            text: 'undefined',
            why: `${name} viene dichiarata e inizializzata nella prima riga, quindi non è mai undefined: dopo la riassegnazione vale ${b}.`,
          },
          {
            text: 'Errore',
            why: 'Riassegnare una variabile `let` è perfettamente lecito: solo `const` farebbe fallire la seconda assegnazione.',
          },
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
          commonMistake:
            'Pensare che il primo valore resti "in coda" o che le assegnazioni si sommino.',
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
      {
        text: 'const',
        why: 'Solo `const` crea un binding che non può essere riassegnato: è la scelta per un valore fisso.',
      },
      [
        {
          text: 'let',
          why: 'Con `let` la variabile resta modificabile: una riassegnazione successiva andrebbe a buon fine, quindi non garantisce che il valore non cambi mai.',
        },
        {
          text: 'var',
          why: 'Anche `var` permette la riassegnazione e in più porta con sé comportamenti legacy come lo scope di funzione: non crea una costante.',
        },
        {
          text: 'final',
          why: 'In JavaScript `final` non è una parola chiave: esiste in Java, mentre qui le costanti si dichiarano con `const`.',
        },
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
        commonMistake:
          'Confondere const con "valore immutabile": gli oggetti const possono cambiare dentro.',
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
        text: 'Si riassegna una `const`',
        why: `La riga \`${name} = ${b}\` tenta di riassegnare una costante: l'esecuzione si ferma con un TypeError prima del log. Per stampare ${b} serviva \`let\` alla prima riga.`,
      },
      [
        {
          text: `Manca \`let\` davanti a \`${name} = ${b}\``,
          why: `Aggiungere \`let\` alla seconda riga tenterebbe di ridichiarare ${name} nello stesso scope, che è un errore: il problema è che la prima riga usa \`const\` invece di \`let\`.`,
        },
        {
          text: '`const` non accetta numeri',
          why: '`const` accetta qualunque tipo di valore, numeri compresi: ciò che vieta è la riassegnazione fatta alla riga successiva, non il contenuto.',
        },
        {
          text: `\`${name}\` va dichiarata due volte`,
          why: `Dichiarare di nuovo ${name} nello stesso scope è un errore di sintassi: per cambiare valore bastava dichiararla una volta sola con \`let\`.`,
        },
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
      {
        text: 'let',
        why: 'La seconda riga riassegna la variabile: `let` permette la riassegnazione e ha scope di blocco, la scelta moderna.',
      },
      [
        {
          text: 'const',
          why: `Con \`const\` la riga \`${name} = ${name} + ${b}\` lancerebbe un TypeError, perché una costante non può essere riassegnata.`,
        },
        {
          text: 'var',
          why: '`var` funzionerebbe perché permette la riassegnazione, ma ha scope di funzione e comportamenti datati: per una variabile mutabile la prassi moderna è `let`.',
        },
        {
          text: 'static',
          why: 'In JavaScript `static` non dichiara variabili: serve solo per i membri statici delle classi, quindi la parola chiave giusta è `let`.',
        },
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
        whyCorrect:
          'La variabile viene riassegnata nella seconda riga: serve let (o var, ma è sconsigliato).',
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
    const v = pickInt(rng, 1, 99);
    const code = `if (true) {\n  var ${name} = ${v};\n}\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      {
        text: `\`var\` → ${v}, \`let\` → ReferenceError`,
        why: `Con \`var\` la dichiarazione ignora il blocco e resta visibile fuori, quindi stampa ${v}; con \`let\` la variabile muore dentro le graffe e la riga finale lancia un ReferenceError.`,
      },
      [
        {
          text: `\`var\` → ReferenceError, \`let\` → ${v}`,
          why: `Il comportamento è invertito: è \`var\` a ignorare il blocco e a stampare ${v}, mentre \`let\` è confinata alle graffe e fuori produce un errore.`,
        },
        {
          text: `${v} in entrambi i casi`,
          why: `Con \`let\` la variabile dichiarata nel blocco non esiste più dopo la graffa di chiusura: la stampa finale lancia un ReferenceError invece di mostrare ${v}.`,
        },
        {
          text: 'ReferenceError in entrambi i casi',
          why: `\`var\` non ha scope di blocco: la dichiarazione dentro l'if resta valida anche dopo, quindi con \`var\` il log stampa ${v} senza errori.`,
        },
      ],
    );
    return {
      templateId: 'var-let-var-cmp',
      type: 'compare',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'variables-var',
      skills: ['var', 'scope'],
      prompt: 'Cosa stampa con `var`? E sostituendo `var` con `let`?',
      code,
      ...built,
      explanation: {
        short: `var ignora i blocchi: stampa ${v}. Con let sarebbe ReferenceError.`,
        whyCorrect:
          'var ha scope di funzione, non di blocco: la dichiarazione "esce" dalle graffe.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Scope di funzione di var vs scope di blocco di let',
        commonMistake: 'Aspettarsi che var rispetti i confini di un blocco come let.',
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
      {
        text: 'undefined',
        why: `L'hoisting solleva la dichiarazione di ${name} in cima ma non l'assegnazione: al momento del log la variabile esiste e vale undefined.`,
      },
      [
        {
          text: fmt(v),
          why: `L'assegnazione \`${name} = ${v}\` resta alla sua riga, dopo il console.log: stampare ${v} vorrebbe dire che anche il valore viene sollevato.`,
        },
        {
          text: 'ReferenceError',
          why: `Con \`var\` la dichiarazione è sollevata in cima allo scope, quindi il nome esiste già: un ReferenceError si avrebbe solo con \`let\` o \`const\`, che hanno la TDZ.`,
        },
        {
          text: 'null',
          why: 'Una variabile `var` dichiarata senza valore vale `undefined`, non `null`: `null` va assegnato esplicitamente.',
        },
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
        short: "L'hoisting solleva la dichiarazione ma non l'assegnazione: stampa undefined.",
        whyCorrect: 'È come scrivere: var x; console.log(x); x = v.',
        whyOthersWrong: built.whyOthersWrong,
        concept: 'Hoisting di var',
        commonMistake:
          'Confondere il caso con let/const, che invece lancerebbero ReferenceError (TDZ).',
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
