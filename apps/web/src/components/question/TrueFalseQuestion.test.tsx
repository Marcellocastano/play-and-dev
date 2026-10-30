// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrueFalseQuestion } from './TrueFalseQuestion';

afterEach(cleanup);

type TrueFalseQ = Extract<Question, { format: 'true-false' }>;

const question: TrueFalseQ = {
  id: 'q1',
  templateId: 't1',
  variantKey: 'v1',
  type: 'true-false',
  difficulty: 'easy',
  topicId: 'scope-basics',
  subtopicId: 'scope-block',
  skills: [],
  prompt: 'Vero o falso?',
  format: 'true-false',
  statements: [
    { id: 's0', text: '`var` ha scope di funzione', value: true },
    { id: 's1', text: '`const` blocca le proprietà', value: false },
    { id: 's2', text: 'let è block-scoped', value: true },
    { id: 's3', text: 'TDZ restituisce undefined', value: false },
  ],
  explanation: { short: 's', whyCorrect: 'w', why: {} },
};

describe('TrueFalseQuestion', () => {
  it('Conferma disabilitato finché non si risponde a tutto', () => {
    render(
      <TrueFalseQuestion
        question={question}
        typeLabel="Vero o falso"
        answered={null}
        onAnswer={vi.fn()}
      />,
    );
    const confirm = screen.getByRole('button', { name: 'Conferma' });
    expect(confirm.hasAttribute('disabled')).toBe(true);
    const rows = screen.getAllByRole('group')[0]!.children;
    expect(rows.length).toBe(4);
  });

  it('invia values e mostra gli stati dopo la risposta', () => {
    const onAnswer = vi.fn();
    render(
      <TrueFalseQuestion
        question={question}
        typeLabel="Vero o falso"
        answered={null}
        onAnswer={onAnswer}
      />,
    );
    const rows = document.querySelectorAll('.tf-row');
    const click = (i: number, v: boolean) =>
      fireEvent.click(rows[i]!.querySelectorAll('.tf-btn')[v ? 0 : 1]! as HTMLElement);
    click(0, true);
    click(1, false);
    click(2, false);
    click(3, true);
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));
    expect(onAnswer).toHaveBeenCalledWith({
      format: 'true-false',
      values: { s0: true, s1: false, s2: false, s3: true },
    });
  });
});
