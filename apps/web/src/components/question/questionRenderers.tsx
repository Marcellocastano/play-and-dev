import type { AnswerResponse, Question, QuestionAttempt, QuestionFormat } from '@lg/core';
import type { ComponentType } from 'react';
import { CategorizeQuestion } from './CategorizeQuestion';
import { ChoiceQuestion } from './ChoiceQuestion';
import { MatchQuestion } from './MatchQuestion';
import { TextAnswerQuestion } from './TextAnswerQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';

export interface QuestionRendererProps {
  question: Question;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Scelta multipla',
  'predict-output': "Prevedi l'output",
  'find-the-bug': 'Trova il bug',
  'fill-the-gap': 'Completa il codice',
  compare: 'Confronta',
  'best-method': 'Metodo migliore',
  categorize: 'Classifica',
  match: 'Abbina',
  'true-false': 'Vero o falso',
};

export function questionTypeLabel(question: Question): string {
  const base = TYPE_LABELS[question.type] ?? question.type;
  if (question.format === 'text') return `${base} · scrivilo tu`;
  return base;
}

const unsupported: ComponentType<QuestionRendererProps> = ({ question }) => (
  <p>Tipo di domanda non supportato: {question.format}</p>
);

export const questionRenderers: Record<QuestionFormat, ComponentType<QuestionRendererProps>> = {
  choice: (props) =>
    props.question.format === 'choice' ? (
      <ChoiceQuestion
        {...props}
        question={props.question}
        typeLabel={questionTypeLabel(props.question)}
      />
    ) : null,
  categorize: (props) =>
    props.question.format === 'categorize' ? (
      <CategorizeQuestion
        {...props}
        question={props.question}
        typeLabel={questionTypeLabel(props.question)}
      />
    ) : (
      unsupported(props)
    ),
  match: (props) =>
    props.question.format === 'match' ? (
      <MatchQuestion
        {...props}
        question={props.question}
        typeLabel={questionTypeLabel(props.question)}
      />
    ) : (
      unsupported(props)
    ),
  'true-false': (props) =>
    props.question.format === 'true-false' ? (
      <TrueFalseQuestion
        {...props}
        question={props.question}
        typeLabel={questionTypeLabel(props.question)}
      />
    ) : (
      unsupported(props)
    ),
  text: (props) =>
    props.question.format === 'text' ? (
      <TextAnswerQuestion
        {...props}
        question={props.question}
        typeLabel={questionTypeLabel(props.question)}
      />
    ) : (
      unsupported(props)
    ),
};
