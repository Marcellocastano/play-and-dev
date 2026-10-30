import type { AnswerResponse, Question, QuestionAttempt } from '@lg/core';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { RichText } from '../ui/RichText';
import { QuestionHeader } from './QuestionHeader';

type CategorizeQ = Extract<Question, { format: 'categorize' }>;

interface CategorizeQuestionProps {
  question: CategorizeQ;
  typeLabel: string;
  answered: QuestionAttempt | null;
  onAnswer(response: AnswerResponse): void;
}

export function CategorizeQuestion({
  question,
  typeLabel,
  answered,
  onAnswer,
}: CategorizeQuestionProps) {
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const justDragged = useRef(false);

  useEffect(() => {
    setPlacement(
      answered?.response.format === 'categorize' ? { ...answered.response.placement } : {},
    );
    setSelected(null);
  }, [question.id, answered]);

  const itemState = (itemId: string) => {
    if (!answered) return 'idle';
    const item = question.items.find((i) => i.id === itemId)!;
    return placement[itemId] === item.categoryId ? 'correct' : 'incorrect';
  };

  const itemLabel = (itemId: string) => {
    if (!answered) return null;
    const item = question.items.find((i) => i.id === itemId)!;
    if (placement[itemId] === item.categoryId) return 'Corretto';
    const target = question.categories.find((c) => c.id === item.categoryId);
    return `Da rivedere → ${target?.text ?? ''}`;
  };

  const place = (itemId: string, categoryId: string | null) => {
    setPlacement((prev) => {
      const next = { ...prev };
      if (categoryId === null) delete next[itemId];
      else next[itemId] = categoryId;
      return next;
    });
    setSelected(null);
  };

  const pool = question.items.filter((i) => !(i.id in placement));
  const complete = pool.length === 0;

  const renderItem = (item: CategorizeQ['items'][number]) => {
    const state = itemState(item.id);
    const label = itemLabel(item.id);
    return (
      <motion.button
        key={item.id}
        type="button"
        drag={!answered}
        dragSnapToOrigin
        onDragStart={() => {
          justDragged.current = true;
        }}
        whileDrag={{ scale: 1.04 }}
        onDragEnd={(_e, info) => {
          if (answered) return;
          const col = document
            .elementsFromPoint(info.point.x - window.scrollX, info.point.y - window.scrollY)
            .map((el) => el.closest('[data-category-id]'))
            .find(Boolean);
          if (col) place(item.id, col.getAttribute('data-category-id'));
          setTimeout(() => {
            justDragged.current = false;
          }, 0);
        }}
        aria-pressed={selected === item.id}
        disabled={answered !== null}
        onClick={() => {
          if (answered) return;
          if (justDragged.current) {
            justDragged.current = false;
            return;
          }
          if (item.id in placement) place(item.id, null);
          else setSelected((s) => (s === item.id ? null : item.id));
        }}
        className={`answer-option categorize-item categorize-item--${state}${selected === item.id ? ' categorize-item--selected' : ''}`}
      >
        <span className="answer-text">
          <RichText text={item.text} />
          {answered && (
            <strong className="answer-result">
              <Icon name={state === 'correct' ? 'check' : 'close'} size={13} /> {label}
            </strong>
          )}
        </span>
      </motion.button>
    );
  };

  return (
    <div className="choice-question">
      <QuestionHeader question={question} typeLabel={typeLabel} />
      <div className="answer-instruction">
        <span>
          Trascina ogni elemento nella colonna giusta, oppure selezionalo e poi scegli la colonna.
        </span>
      </div>
      <div className="categorize-board">
        <div
          className="categorize-columns"
          style={{ gridTemplateColumns: `repeat(${question.categories.length}, minmax(0, 1fr))` }}
        >
          {question.categories.map((cat) => (
            <div
              key={cat.id}
              data-category-id={cat.id}
              className={`categorize-column${selected ? ' categorize-column--target' : ''}`}
            >
              <span className="categorize-column-title">
                <RichText text={cat.text} />
              </span>
              <div className="categorize-column-items">
                {question.items.filter((i) => placement[i.id] === cat.id).map(renderItem)}
              </div>
              {!answered && (
                <button
                  type="button"
                  className="categorize-drop"
                  disabled={!selected}
                  onClick={() => selected && place(selected, cat.id)}
                >
                  {selected ? 'Sposta qui' : 'Seleziona un elemento'}
                </button>
              )}
            </div>
          ))}
        </div>
        {pool.length > 0 && (
          <div className="categorize-pool" role="group" aria-label="Elementi da classificare">
            {pool.map(renderItem)}
          </div>
        )}
      </div>
      {!answered && (
        <div className="question-confirm">
          <Button
            onClick={() => onAnswer({ format: 'categorize', placement })}
            disabled={!complete}
          >
            Conferma
          </Button>
          {!complete && (
            <span className="confirm-hint">Classifica tutti gli elementi per continuare</span>
          )}
        </div>
      )}
    </div>
  );
}
