// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChoiceQuestion } from './ChoiceQuestion';
import { FeedbackPanel } from '../feedback/FeedbackPanel';

afterEach(cleanup);

const question: Question = {
  id: 'q1',
  templateId: 't1',
  variantKey: 'v1',
  type: 'multiple-choice',
  difficulty: 'easy',
  topicId: 'variables',
  subtopicId: 'variables-declaration',
  skills: ['let'],
  prompt: 'Quale parola chiave dichiara una variabile riassegnabile?',
  options: [
    { id: 'a', text: 'let' },
    { id: 'b', text: 'const' },
    { id: 'c', text: 'tipo' },
    { id: 'd', text: 'var2' },
  ],
  correctOptionId: 'a',
  explanation: {
    short: 'let è riassegnabile.',
    whyCorrect: 'let consente la riassegnazione.',
    whyOthersWrong: { b: 'const è fissa.', c: 'non esiste.', d: 'non esiste.' },
    concept: 'Dichiarazioni',
  },
};

describe('ChoiceQuestion', () => {
  it('rende le 4 opzioni come bottoni e chiama onAnswer al click', () => {
    const onAnswer = vi.fn();
    render(
      <ChoiceQuestion
        question={question}
        typeLabel="Scelta multipla"
        answered={null}
        onAnswer={onAnswer}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    fireEvent.click(buttons[1]!);
    expect(onAnswer).toHaveBeenCalledWith('b');
  });

  it('gestisce i tasti numerici ma ignora input e pressioni ripetute', () => {
    const onAnswer = vi.fn();
    render(
      <>
        <ChoiceQuestion
          question={question}
          typeLabel="Scelta multipla"
          answered={null}
          onAnswer={onAnswer}
        />
        <input aria-label="Appunti" />
      </>,
    );
    fireEvent.keyDown(window, { key: '2' });
    expect(onAnswer).toHaveBeenCalledWith('b');
    fireEvent.keyDown(screen.getByRole('textbox'), { key: '1' });
    fireEvent.keyDown(window, { key: '1', repeat: true });
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });
});

describe('FeedbackPanel', () => {
  const attempt = {
    questionId: 'q1',
    templateId: 't1',
    topicId: 'variables',
    subtopicId: 'variables-declaration',
    type: 'multiple-choice',
    difficulty: 'easy' as const,
    correct: false,
    selectedOptionId: 'b',
    timeMs: 1000,
    attempt: 1,
    answeredAt: 1,
  };

  it('non intercetta Invio su un controllo di approfondimento', () => {
    const onNext = vi.fn();
    render(<FeedbackPanel question={question} attempt={attempt} onNext={onNext} />);
    const explain = screen.getByRole('button', { name: /Capisci il perché/ });
    fireEvent.keyDown(explain, { key: 'Enter' });
    expect(onNext).not.toHaveBeenCalled();
    fireEvent.click(explain);
    expect(explain.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('let consente la riassegnazione.')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('mostra un esito testuale e blocca Avanti durante il salvataggio', () => {
    const onNext = vi.fn();
    render(<FeedbackPanel question={question} attempt={attempt} onNext={onNext} busy />);
    expect(screen.getByRole('status').textContent).toContain('Risposta corretta: let');
    const next = screen.getByRole('button', { name: /Prossima domanda/ });
    expect(next.hasAttribute('disabled')).toBe(true);
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.click(next);
    expect(onNext).not.toHaveBeenCalled();
  });
});
