import type { AnswerResponse, Question, QuestionAttempt } from '@lg/core';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { CodeBlock } from '../ui/CodeBlock';
import { Icon } from '../ui/Icon';
import { QuestionHeader } from './QuestionHeader';

type TextQ = Extract<Question, { format: 'text' }>;

interface TextAnswerQuestionProps {
  question: TextQ;
  typeLabel: string;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

export function TextAnswerQuestion({
  question,
  typeLabel,
  answered,
  onAnswer,
}: TextAnswerQuestionProps) {
  const [text, setText] = useState('');
  const multiline = (question.accepted[0] ?? '').includes('\n');

  useEffect(() => {
    setText(answered?.response.format === 'text' ? answered.response.text : '');
  }, [question.id, answered]);

  const submit = () => {
    if (answered || text.trim() === '') return;
    onAnswer({ format: 'text', text });
  };

  return (
    <div className="choice-question">
      <QuestionHeader question={question} typeLabel={typeLabel} />
      <div className="answer-instruction">
        <span>Scrivi esattamente ciò che stampa console.log (una riga per ogni chiamata)</span>
      </div>
      {multiline ? (
        <textarea
          className="text-answer-input"
          rows={2}
          value={text}
          disabled={answered !== null}
          autoComplete="off"
          spellCheck={false}
          autoFocus
          aria-label="La tua risposta"
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <input
          className="text-answer-input"
          type="text"
          value={text}
          disabled={answered !== null}
          autoComplete="off"
          spellCheck={false}
          autoFocus
          aria-label="La tua risposta"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />
      )}
      {answered ? (
        <div className="text-answer-review">
          <div>
            <span className="review-label">La tua risposta</span>
            <CodeBlock code={text || '—'} />
          </div>
          <div>
            <span className="review-label">Output atteso</span>
            <CodeBlock code={question.accepted[0] ?? ''} />
          </div>
          <strong className="answer-result">
            <Icon name={answered.correct ? 'check' : 'close'} size={13} />{' '}
            {answered.correct ? 'Corretto' : 'Da rivedere'}
          </strong>
        </div>
      ) : (
        <div className="question-confirm">
          <Button onClick={submit} disabled={text.trim() === ''}>
            Conferma
          </Button>
          {text.trim() === '' && <span className="confirm-hint">Scrivi l'output</span>}
        </div>
      )}
    </div>
  );
}
