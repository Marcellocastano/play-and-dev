import type { AnswerResponse, Question, QuestionAttempt } from '@lg/core';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { RichText } from '../ui/RichText';
import { QuestionHeader } from './QuestionHeader';

type TrueFalseQ = Extract<Question, { format: 'true-false' }>;

interface TrueFalseQuestionProps {
  question: TrueFalseQ;
  typeLabel: string;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

export function TrueFalseQuestion({
  question,
  typeLabel,
  answered,
  onAnswer,
}: TrueFalseQuestionProps) {
  const [values, setValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(answered?.response.format === 'true-false' ? { ...answered.response.values } : {});
  }, [question.id, answered]);

  const complete = question.statements.every((s) => s.id in values);

  return (
    <div className="choice-question">
      <QuestionHeader question={question} typeLabel={typeLabel} />
      <div className="answer-instruction">
        <span>Indica se ogni affermazione è vera o falsa</span>
      </div>
      <div className="tf-rows" role="group" aria-label="Affermazioni">
        {question.statements.map((st) => {
          const chosen = values[st.id];
          const ok = answered ? chosen === st.value : undefined;
          return (
            <div
              key={st.id}
              className={`tf-row${answered ? (ok ? ' tf-row--correct' : ' tf-row--incorrect') : ''}`}
            >
              <span className="answer-text tf-row-text">
                <RichText text={st.text} />
                {answered && (
                  <strong className="answer-result">
                    <Icon name={ok ? 'check' : 'close'} size={13} />{' '}
                    {ok ? 'Corretto' : `Da rivedere · era ${st.value ? 'Vero' : 'Falso'}`}
                  </strong>
                )}
              </span>
              <span className="tf-buttons">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`tf-btn${chosen === v ? ' tf-btn--chosen' : ''}${answered && st.value === v ? ' tf-btn--right' : ''}`}
                    aria-pressed={chosen === v}
                    aria-label={v ? 'Vero' : 'Falso'}
                    disabled={answered !== null}
                    onClick={() => setValues((prev) => ({ ...prev, [st.id]: v }))}
                  >
                    {v ? 'V' : 'F'}
                  </button>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      {!answered && (
        <div className="question-confirm">
          <Button onClick={() => onAnswer({ format: 'true-false', values })} disabled={!complete}>
            Conferma
          </Button>
          {!complete && <span className="confirm-hint">Rispondi a tutte le affermazioni</span>}
        </div>
      )}
    </div>
  );
}
