import type { AnswerResponse, Question, QuestionAttempt } from '@lg/core';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { RichText } from '../ui/RichText';
import { QuestionHeader } from './QuestionHeader';

type MatchQ = Extract<Question, { format: 'match' }>;

interface MatchQuestionProps {
  question: MatchQ;
  typeLabel: string;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

export function MatchQuestion({ question, typeLabel, answered, onAnswer }: MatchQuestionProps) {
  const [selection, setSelection] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelection(answered?.response.format === 'match' ? { ...answered.response.selection } : {});
  }, [question.id, answered]);

  const complete = question.rows.every((r) => selection[r.id]);

  return (
    <div className="choice-question">
      <QuestionHeader question={question} typeLabel={typeLabel} />
      <div className="answer-instruction">
        <span>Scegli il valore giusto per ogni riga</span>
      </div>
      <div className="match-rows" role="group" aria-label="Righe da abbinare">
        {question.rows.map((row) => {
          const chosen = selection[row.id];
          const ok = answered ? chosen === row.choiceId : undefined;
          const target = question.choices.find((c) => c.id === row.choiceId);
          return (
            <div
              key={row.id}
              className={`match-row${answered ? (ok ? ' match-row--correct' : ' match-row--incorrect') : ''}`}
            >
              <span className="answer-text match-row-text">
                <RichText text={row.text} />
                {answered && (
                  <strong className="answer-result">
                    <Icon name={ok ? 'check' : 'close'} size={13} />{' '}
                    {ok ? 'Corretto' : `Da rivedere → ${target?.text ?? ''}`}
                  </strong>
                )}
              </span>
              <select
                className="match-select"
                value={chosen ?? ''}
                disabled={answered !== null}
                aria-label={`Abbina: ${row.text.replaceAll('`', '')}`}
                onChange={(e) => setSelection((prev) => ({ ...prev, [row.id]: e.target.value }))}
              >
                <option value="" disabled>
                  Scegli…
                </option>
                {question.choices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.text.replaceAll('`', '')}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {!answered && (
        <div className="question-confirm">
          <Button onClick={() => onAnswer({ format: 'match', selection })} disabled={!complete}>
            Conferma
          </Button>
          {!complete && <span className="confirm-hint">Completa tutte le righe</span>}
        </div>
      )}
    </div>
  );
}
