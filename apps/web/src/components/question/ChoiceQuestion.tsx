import type { AnswerResponse, Question, QuestionAttempt } from '@lg/core';
import { useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { QuestionHeader } from './QuestionHeader';
import { RichText } from '../ui/RichText';

type ChoiceQ = Extract<Question, { format: 'choice' }>;

interface ChoiceQuestionProps {
  question: ChoiceQ;
  typeLabel: string;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

export function ChoiceQuestion({ question, typeLabel, answered, onAnswer }: ChoiceQuestionProps) {
  useEffect(() => {
    if (answered) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))
      )
        return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        const opt = question.options[n - 1];
        if (opt) {
          e.preventDefault();
          onAnswer({ format: 'choice', optionId: opt.id });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answered, question.options, onAnswer]);

  return (
    <div className="choice-question">
      <QuestionHeader question={question} typeLabel={typeLabel} />
      <div className="answer-instruction">
        <span>Scegli la tua risposta</span>
        <span className="keyboard-hint">
          oppure premi <kbd>1</kbd> – <kbd>4</kbd>
        </span>
      </div>
      <div className="answer-grid" role="group" aria-label="Opzioni di risposta">
        {question.options.map((opt, i) => {
          const isCorrect = opt.id === question.correctOptionId;
          const isSelected =
            answered?.response.format === 'choice' && answered.response.optionId === opt.id;
          const state = !answered
            ? 'idle'
            : isCorrect
              ? 'correct'
              : isSelected
                ? 'incorrect'
                : 'muted';
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isSelected}
              disabled={answered !== null}
              onClick={() => onAnswer({ format: 'choice', optionId: opt.id })}
              className={`answer-option answer-option--${state}`}
            >
              <span className="answer-number">
                {answered && (isCorrect || isSelected) ? (
                  <Icon name={isCorrect ? 'check' : 'close'} size={17} />
                ) : (
                  i + 1
                )}
              </span>
              <span className="answer-text">
                <RichText text={opt.text} />
                {answered && isCorrect && <strong className="answer-result">Corretta</strong>}
                {answered && isSelected && !isCorrect && (
                  <strong className="answer-result">Sbagliata</strong>
                )}
              </span>
              {!answered && <Icon name="arrow" className="answer-arrow" size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
