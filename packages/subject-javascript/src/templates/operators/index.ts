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
        { text: fmt(a + 1), why: `++ incrementa ${name} di 1: da ${a} a ${a + 1}.` },
        [
          { text: fmt(a), why: '++ modifica la variabile: non resta al valore iniziale.' },
          { text: fmt(a + 2), why: '++ incrementa di 1, non di 2.' },
          { text: 'undefined', why: 'La variabile è inizializzata e poi incrementata.' },
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
          whyCorrect: 'Sia prefisso che postfisso incrementano la variabile; qui conta il valore finale.',
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
        { text: fmt(a + b), why: `+= somma ${b} a ${name}: ${a} + ${b} = ${a + b}.` },
        [
          { text: fmt(b), why: '+= aggiunge al valore esistente, non sostituisce.' },
          { text: fmt(a), why: 'La variabile viene aggiornata: non resta al valore iniziale.' },
          { text: fmt(`${a}${b}`), why: 'Con i numeri += somma; la concatenazione avviene solo con le stringhe.' },
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
          whyCorrect: 'L\'assegnazione composta aggiorna la variabile sommando.',
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
        { text: fmt(correct), why: `La moltiplicazione ha precedenza: ${b} * ${c} = ${b * c}, poi ${a} + ${b * c} = ${correct}.` },
        [
          { text: fmt((a + b) * c), why: 'Questo sarebbe il risultato con le parentesi (a + b) * c: senza, * viene prima.' },
          { text: fmt(a * b + c), why: 'Le operazioni non si riordinano: resta a + (b * c).' },
          { text: fmt(a + b + c), why: 'La moltiplicazione non sparisce: b * c va calcolata prima.' },
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
          commonMistake: 'Leggere l\'espressione da sinistra a destra ignorando la precedenza.',
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
        text: `=+ non esiste: il codice assegna +${b} a ${name}; per sommare serviva +=`,
        why: `${name} =+ ${b} è letto come "${name} = (+${b})": stampa ${b}, non ${a + b}.`,
      },
      [
        { text: 'console.log è chiamato su una variabile sbagliata', why: 'Il console.log stampa la variabile giusta: il problema è l\'assegnazione.' },
        { text: `${name} non può essere riassegnata perché let`, why: 'let è riassegnabile; il problema è l\'operatore usato.' },
        { text: 'Bisogna dichiarare la variabile due volte', why: 'Non serve: let permette la riassegnazione con l\'operatore corretto.' },
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
        whyCorrect: 'L\'assegnazione composta si scrive +=, con + prima di =.',
        whyOthersWrong: built.whyOthersWrong,
        concept: '+= vs =+',
        commonMistake: 'Invertire l\'ordine dei caratteri negli operatori composti.',
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
        { text: 'a && b', value: a && b, why: '&& richiede entrambi veri.' },
        { text: 'a || b', value: a || b, why: '|| basta un operando vero.' },
        { text: '!a && b', value: !a && b, why: `!a è ${!a} e b è ${b}.` },
        { text: 'a && !b', value: a && !b, why: `a è ${a} e !b è ${!b}.` },
        { text: '!(a || b)', value: !(a || b), why: `a || b è ${a || b}, negato è ${!(a || b)}.` },
        { text: '!a || b', value: !a || b, why: `!a è ${!a}, b è ${b}: || basta un vero.` },
      ];
      const trueOnes = exprs.filter((e) => e.value);
      const falseOnes = exprs.filter((e) => !e.value);
      if (trueOnes.length === 0 || falseOnes.length < 3) throw new Error('rigenera');
      const correct = pickOf(rng, trueOnes);
      const distractors = falseOnes.slice(0, 3).map((e) => ({
        text: e.text,
        why: `${e.text} vale false qui: ${e.why}`,
      }));
      const built = makeOptions(
        rng,
        { text: correct.text, why: `${correct.text} vale true: ${correct.why}` },
        distractors,
      );
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
