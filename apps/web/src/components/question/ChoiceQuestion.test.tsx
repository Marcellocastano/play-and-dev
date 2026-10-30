// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChoiceQuestion } from './ChoiceQuestion';
import { FeedbackPanel } from '../feedback/FeedbackPanel';
import { RichText } from '../ui/RichText';

afterEach(cleanup);

const question: Extract<Question, { format: 'choice' }> = {
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
  format: 'choice',
  correctOptionId: 'a',
  explanation: {
    short: 'let è riassegnabile.',
    whyCorrect: 'let consente la riassegnazione.',
    why: { b: 'const è fissa.', c: 'non esiste.', d: 'non esiste.' },
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
    expect(onAnswer).toHaveBeenCalledWith({ format: 'choice', optionId: 'b' });
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
    expect(onAnswer).toHaveBeenCalledWith({ format: 'choice', optionId: 'b' });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: '1' });
    fireEvent.keyDown(window, { key: '1', repeat: true });
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });
});

describe('RichText', () => {
  it('rende i backtick come <code> senza mostrarli', () => {
    const { container } = render(<RichText text={'usa `let` per i contatori'} />);
    const code = container.querySelector('code.inline-code');
    expect(code?.textContent).toBe('let');
    expect(container.textContent).toBe('usa let per i contatori');
    expect(container.textContent).not.toContain('`');
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
    response: { format: 'choice' as const, optionId: 'b' },
    score: 0,
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

describe('FeedbackPanel parziale (formati di gioco)', () => {
  const catQuestion: Extract<Question, { format: 'categorize' }> = {
    id: 'q2',
    templateId: 't2',
    variantKey: 'v2',
    type: 'categorize',
    difficulty: 'easy',
    topicId: 'arrays-basics',
    subtopicId: 'arrays-mutators',
    skills: [],
    prompt: 'Classifica',
    format: 'categorize',
    categories: [
      { id: 'c1', text: 'Muta' },
      { id: 'c2', text: 'Puro' },
    ],
    items: [
      { id: 'i0', text: '`push()`', categoryId: 'c1' },
      { id: 'i1', text: '`pop()`', categoryId: 'c1' },
      { id: 'i2', text: '`map()`', categoryId: 'c2' },
      { id: 'i3', text: '`filter()`', categoryId: 'c2' },
    ],
    explanation: {
      short: 's',
      whyCorrect: 'w',
      why: {
        i0: "push muta perché scrive in coda sul posto e non crea copie dell'array.",
        i1: "pop muta perché rimuove l'ultimo elemento direttamente dall'array originale.",
        i2: 'map è puro perché costruisce un array nuovo con i risultati trasformati.',
        i3: 'filter è puro perché produce un nuovo array con i soli elementi filtrati.',
      },
    },
  };

  const partialAttempt = {
    questionId: 'q2',
    templateId: 't2',
    topicId: 'arrays-basics',
    subtopicId: 'arrays-mutators',
    type: 'categorize',
    difficulty: 'easy' as const,
    correct: false,
    response: {
      format: 'categorize' as const,
      placement: { i0: 'c1', i1: 'c2', i2: 'c2', i3: 'c2' },
    },
    score: 0.75,
    timeMs: 1000,
    attempt: 1,
    answeredAt: 1,
  };

  it('mostra "N su M corretti" e "Da rivedere" con solo gli sbagli', () => {
    render(<FeedbackPanel question={catQuestion} attempt={partialAttempt} onNext={vi.fn()} />);
    expect(screen.getByText('Quasi. 3 su 4 corretti.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Capisci il perché/ }));
    expect(screen.getByText('Da rivedere')).toBeTruthy();
    expect(screen.getByText('pop()')).toBeTruthy();
    expect(screen.queryByText('map()')).toBeNull();
  });
});
