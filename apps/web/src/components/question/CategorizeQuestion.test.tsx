// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CategorizeQuestion } from './CategorizeQuestion';

afterEach(cleanup);

type CategorizeQ = Extract<Question, { format: 'categorize' }>;

const question: CategorizeQ = {
  id: 'q1',
  templateId: 't1',
  variantKey: 'v1',
  type: 'categorize',
  difficulty: 'easy',
  topicId: 'arrays-basics',
  subtopicId: 'arrays-mutators',
  skills: [],
  prompt: 'Classifica i metodi',
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
  explanation: { short: 's', whyCorrect: 'w', why: {} },
};

const answeredAttempt = {
  questionId: 'q1',
  templateId: 't1',
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

describe('CategorizeQuestion', () => {
  it('Conferma è disabilitato finché un elemento resta nel pool', () => {
    render(
      <CategorizeQuestion
        question={question}
        typeLabel="Classifica"
        answered={null}
        onAnswer={vi.fn()}
      />,
    );
    const confirm = screen.getByRole('button', { name: 'Conferma' });
    expect(confirm.hasAttribute('disabled')).toBe(true);
  });

  it('click-to-place: seleziona item, poi colonna, poi invia il placement', () => {
    const onAnswer = vi.fn();
    render(
      <CategorizeQuestion
        question={question}
        typeLabel="Classifica"
        answered={null}
        onAnswer={onAnswer}
      />,
    );
    const placeIn = (itemText: string, colTitle: string) => {
      fireEvent.click(
        screen.getByRole('button', { name: new RegExp(itemText.replace(/[()`]/g, '\\$&')) }),
      );
      const col = screen.getByText(colTitle).closest('[data-category-id]')!;
      fireEvent.click(col.querySelector('.categorize-drop')!);
    };
    placeIn('push()', 'Muta');
    placeIn('pop()', 'Muta');
    placeIn('map()', 'Puro');
    placeIn('filter()', 'Puro');
    const confirm = screen.getByRole('button', { name: 'Conferma' });
    expect(confirm.hasAttribute('disabled')).toBe(false);
    fireEvent.click(confirm);
    expect(onAnswer).toHaveBeenCalledWith({
      format: 'categorize',
      placement: { i0: 'c1', i1: 'c1', i2: 'c2', i3: 'c2' },
    });
  });

  it('clic su un item in colonna lo riporta al pool', () => {
    render(
      <CategorizeQuestion
        question={question}
        typeLabel="Classifica"
        answered={null}
        onAnswer={vi.fn()}
      />,
    );
    const item = screen.getByRole('button', { name: /push\(\)/ });
    fireEvent.click(item);
    const col = screen.getByText('Muta').closest('[data-category-id]')!;
    fireEvent.click(col.querySelector('.categorize-drop')!);
    // ora è in colonna: un clic lo riporta al pool
    fireEvent.click(screen.getByRole('button', { name: /push\(\)/ }));
    expect(screen.getByRole('group', { name: 'Elementi da classificare' }).textContent).toContain(
      'push()',
    );
  });

  it('dopo la risposta mostra Corretto/Da rivedere con la categoria giusta', () => {
    render(
      <CategorizeQuestion
        question={question}
        typeLabel="Classifica"
        answered={answeredAttempt}
        onAnswer={vi.fn()}
      />,
    );
    expect(screen.getAllByText(/Corretto/)).toHaveLength(3);
    expect(screen.getByText(/Da rivedere → Muta/)).toBeTruthy();
  });
});
