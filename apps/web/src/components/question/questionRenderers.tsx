import type { Question, QuestionAttempt } from '@lg/core';
import type { ComponentType } from 'react';
import { ChoiceQuestion } from './ChoiceQuestion';

export interface QuestionRendererProps {
  question: Question;
  answered: QuestionAttempt | null;
  onAnswer(optionId: string): void;
}

const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Scelta multipla',
  'predict-output': "Prevedi l'output",
  'find-the-bug': 'Trova il bug',
  'fill-the-gap': 'Completa il codice',
  compare: 'Confronta',
  'best-method': 'Metodo migliore',
};

const withLabel =
  (label: string): ComponentType<QuestionRendererProps> =>
  (props) =>
    <ChoiceQuestion {...props} typeLabel={label} />;

export const questionRenderers: Record<string, ComponentType<QuestionRendererProps>> =
  Object.fromEntries(
    Object.entries(TYPE_LABELS).map(([type, label]) => [type, withLabel(label)]),
  );

export function questionTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}
