import type { QuestionTemplate } from '@lg/core';
import { fmt, makeOptions, pickInt, pickName, pickOf, retry, type Rng } from '../helpers.js';

const TOPIC = 'operators';
const DD = 'dd-operators';

const incPo: QuestionTemplate = {
  id: 'op-inc-po',
  topicId: TOPIC,
  subtopicId: 'operators-increment',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['++'],
  tags: ['operatori'],
  generate(rng: Rng) {
    return retry(() => {
      const name = pickName(rng);
      const a = pickInt(rng, 1, 20);
      const postfix = rng() < 0.5;
      const code = postfix
        ? `let ${name} = ${a};\n${name}++;\nconsole.log(${name});`
        : `let ${name} = ${a};\n++${name};\nconsole.log(${name});`;
      const built = makeOptions(
        rng,
        {
          text: fmt(a + 1),
          why: `L'operatore \`++\` incrementa ${name} di 1: da ${a} passa a ${a + 1} prima del log.`,
        },
        [
          {
            text: fmt(a),
            why: `\`++\` modifica la variabile sul posto: ${name} non resta al valore iniziale ${a} ma sale a ${a + 1}.`,
          },
          {
            text: fmt(a + 2),
            why: `\`++\` aggiunge sempre e solo 1: un incremento doppio richiederebbe due operatori o \`+= 2\`, quindi ${a} diventa ${a + 1}.`,
          },
          {
            text: 'undefined',
            why: `La variabile viene inizializzata a ${a} e poi incrementata: ha sempre un valore numerico, mai undefined.`,
          },
        ],
      );
      return {
        templateId: 'op-inc-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'operators-increment',
        skills: ['++'],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `${postfix ? `${name}++` : `++${name}`} incrementa ${name}: stampa ${a + 1}.`,
          whyCorrect:
            'Sia prefisso che postfisso incrementano la variabile; qui conta il valore finale.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatore di incremento ++',
          commonMistake: 'Pensare che x++ non modifichi x.',
          example: 'let n = 1; n++; // n = 2',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const compoundPo: QuestionTemplate = {
  id: 'op-compound-po',
  topicId: TOPIC,
  subtopicId: 'operators-assignment',
  type: 'predict-output',
  difficulty: 'easy',
  skills: ['+='],
  tags: ['operatori'],
  generate(rng: Rng) {
    return retry(() => {
      const name = pickName(rng);
      const a = pickInt(rng, 1, 30);
      const b = pickInt(rng, 1, 9);
      const code = `let ${name} = ${a};\n${name} += ${b};\nconsole.log(${name});`;
      const built = makeOptions(
        rng,
        {
          text: fmt(a + b),
          why: `\`+=\` somma ${b} al valore esistente: \`${name} += ${b}\` equivale a \`${name} = ${a} + ${b}\`, cioè ${a + b}.`,
        },
        [
          {
            text: fmt(b),
            why: `\`+=\` aggiunge al valore esistente invece di sostituirlo: ${name} parte da ${a}, quindi non diventa ${b} ma ${a + b}.`,
          },
          {
            text: fmt(a),
            why: `La seconda riga aggiorna ${name} sommandovi ${b}: il valore iniziale ${a} non è quello stampato.`,
          },
          {
            text: fmt(`${a}${b}`),
            why: `La concatenazione avviene solo quando un operando è una stringa: ${a} e ${b} sono numeri, quindi \`+=\` li somma in ${a + b}.`,
          },
        ],
      );
      return {
        templateId: 'op-compound-po',
        type: 'predict-output',
        difficulty: 'easy' as const,
        topicId: TOPIC,
        subtopicId: 'operators-assignment',
        skills: ['+='],
        prompt: 'Cosa stampa questo codice?',
        code,
        ...built,
        explanation: {
          short: `${name} += ${b} equivale a ${name} = ${name} + ${b} → ${a + b}.`,
          whyCorrect: "L'assegnazione composta aggiorna la variabile sommando.",
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Assegnazione composta',
          commonMistake: 'Leggere += come semplice assegnazione.',
          example: 'let x = 10; x += 5; // x = 15',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const precedenceMc: QuestionTemplate = {
  id: 'op-precedence-mc',
  topicId: TOPIC,
  subtopicId: 'operators-precedence',
  type: 'multiple-choice',
  difficulty: 'medium',
  skills: ['precedenza'],
  tags: ['operatori'],
  generate(rng: Rng) {
    return retry(() => {
      const a = pickInt(rng, 1, 9);
      const b = pickInt(rng, 1, 9);
      const c = pickInt(rng, 2, 9);
      const correct = a + b * c;
      const built = makeOptions(
        rng,
        {
          text: fmt(correct),
          why: `La moltiplicazione ha la precedenza sull'addizione: prima ${b} * ${c} = ${b * c}, poi ${a} + ${b * c} = ${correct}.`,
        },
        [
          {
            text: fmt((a + b) * c),
            why: `Questo sarebbe il risultato di \`(${a} + ${b}) * ${c}\`: senza parentesi la moltiplicazione si calcola prima e il risultato è ${correct}.`,
          },
          {
            text: fmt(a * b + c),
            why: `Le operazioni non si riordinano: l'espressione resta ${a} + (${b} * ${c}), quindi ${a * b + c} non è tra i risultati possibili.`,
          },
          {
            text: fmt(a + b + c),
            why: `La moltiplicazione non scompare: ${b} * ${c} vale ${b * c} e va calcolata prima della somma, quindi il totale è ${correct}.`,
          },
        ],
      );
      return {
        templateId: 'op-precedence-mc',
        type: 'multiple-choice',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'operators-precedence',
        skills: ['precedenza'],
        prompt: `Quanto vale \`${a} + ${b} * ${c}\`?`,
        ...built,
        explanation: {
          short: `Prima ${b} * ${c} = ${b * c}, poi + ${a}: risultato ${correct}.`,
          whyCorrect: '* ha precedenza maggiore di +.',
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Precedenza degli operatori',
          commonMistake: "Leggere l'espressione da sinistra a destra ignorando la precedenza.",
          example: '2 + 3 * 4 // 14, non 20',
        },
        deepDiveRef: DD,
      };
    });
  },
};

const eqPlusFb: QuestionTemplate = {
  id: 'op-eqplus-fb',
  topicId: TOPIC,
  subtopicId: 'operators-assignment',
  type: 'find-the-bug',
  difficulty: 'medium',
  skills: ['+='],
  tags: ['operatori', 'bug'],
  generate(rng: Rng) {
    const name = pickName(rng);
    const a = pickInt(rng, 5, 50);
    const b = pickInt(rng, 1, 9);
    const code = `let ${name} = ${a};\n${name} =+ ${b};\nconsole.log(${name});`;
    const built = makeOptions(
      rng,
      {
        text: '`=+` assegna invece di sommare',
        why: `\`${name} =+ ${b}\` viene letto come \`${name} = (+${b})\`: il + unario non somma ma assegna ${b}, quindi stampa ${b} invece di ${a + b}.`,
      },
      [
        {
          text: 'La variabile va ridichiarata',
          why: `${name} è già dichiarata nella prima riga: bastava correggere l'operatore in \`+=\`, senza aggiungere una nuova dichiarazione.`,
        },
        {
          text: `Manca \`let\` davanti a \`${name}\``,
          why: `${name} esiste già grazie alla prima riga: il problema non è la dichiarazione ma l'operatore \`=+\`, che assegna invece di sommare.`,
        },
        {
          text: `\`+${b}\` va scritto \`${b}+\``,
          why: `Il segno va spostato prima dell'\`=\`, non dopo il numero: la forma corretta è \`${name} += ${b}\`.`,
        },
      ],
    );
    return {
      templateId: 'op-eqplus-fb',
      type: 'find-the-bug',
      difficulty: 'medium' as const,
      topicId: TOPIC,
      subtopicId: 'operators-assignment',
      skills: ['+='],
      prompt: `Questo codice dovrebbe stampare ${a + b} ma stampa ${b}. Qual è il bug?`,
      code,
      ...built,
      explanation: {
        short: `=+ ${b} assegna +${b} (più unario), non somma: ${name} diventa ${b}.`,
        whyCorrect: "L'assegnazione composta si scrive +=, con + prima di =.",
        whyOthersWrong: built.whyOthersWrong,
        concept: '+= vs =+',
        commonMistake: "Invertire l'ordine dei caratteri negli operatori composti.",
        example: 'x =+ 5 assegna 5; x += 5 somma 5',
      },
      deepDiveRef: DD,
    };
  },
};

const logicCmp: QuestionTemplate = {
  id: 'op-logic-cmp',
  topicId: TOPIC,
  subtopicId: 'operators-logical',
  type: 'compare',
  difficulty: 'medium',
  skills: ['&&', '||', '!'],
  tags: ['operatori', 'logica'],
  generate(rng: Rng) {
    return retry(() => {
      const a = rng() < 0.5;
      const b = rng() < 0.5;
      const exprs = [
        {
          text: 'a && b',
          value: a && b,
          why: `\`a && b\` richiede entrambi veri: con a = ${a} e b = ${b} vale ${a && b}.`,
        },
        {
          text: 'a || b',
          value: a || b,
          why: `\`a || b\` richiede almeno un operando vero: con a = ${a} e b = ${b} vale ${a || b}.`,
        },
        {
          text: '!a && b',
          value: !a && b,
          why: `\`!a\` vale ${!a} e \`b\` vale ${b}: la congiunzione \`!a && b\` risulta ${!a && b}.`,
        },
        {
          text: 'a && !b',
          value: a && !b,
          why: `\`a\` vale ${a} e \`!b\` vale ${!b}: la congiunzione \`a && !b\` risulta ${a && !b}.`,
        },
        {
          text: '!(a || b)',
          value: !(a || b),
          why: `\`a || b\` vale ${a || b} e la negazione lo inverte: \`!(a || b)\` risulta ${!(a || b)}.`,
        },
        {
          text: '!a || b',
          value: !a || b,
          why: `\`!a\` vale ${!a} e \`b\` vale ${b}: la disgiunzione \`!a || b\` risulta ${!a || b}.`,
        },
      ];
      const trueOnes = exprs.filter((e) => e.value);
      const falseOnes = exprs.filter((e) => !e.value);
      if (trueOnes.length === 0 || falseOnes.length < 3) throw new Error('rigenera');
      const correct = pickOf(rng, trueOnes);
      const distractors = falseOnes.slice(0, 3).map((e) => ({
        text: e.text,
        why: e.why,
      }));
      const built = makeOptions(rng, { text: correct.text, why: correct.why }, distractors);
      return {
        templateId: 'op-logic-cmp',
        type: 'compare',
        difficulty: 'medium' as const,
        topicId: TOPIC,
        subtopicId: 'operators-logical',
        skills: ['&&', '||', '!'],
        prompt: `Se \`a = ${a}\` e \`b = ${b}\`, quale espressione vale true?`,
        ...built,
        explanation: {
          short: `${correct.text} è true con a = ${a}, b = ${b}.`,
          whyCorrect: correct.why,
          whyOthersWrong: built.whyOthersWrong,
          concept: 'Operatori logici && e ||',
          commonMistake: 'Confondere && (entrambi veri) con || (almeno uno vero).',
          example: 'true || false // true; true && false // false',
        },
        deepDiveRef: DD,
      };
    });
  },
};

export const operatorsTemplates: QuestionTemplate[] = [
  incPo,
  compoundPo,
  precedenceMc,
  eqPlusFb,
  logicCmp,
];
