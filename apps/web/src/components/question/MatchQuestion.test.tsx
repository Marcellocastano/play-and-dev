// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MatchQuestion } from './MatchQuestion';

afterEach(cleanup);

type MatchQ = Extract<Question, { format: 'match' }>;

const question: MatchQ = {
  id: 'q1',
  templateId: 't1',
  variantKey: 'v1',
  type: 'match',
  difficulty: 'medium',
  topicId: 'primitive-types',
  subtopicId: 'primitive-types-typeof',
  skills: [],
  prompt: 'Abbina typeof al risultato',
  format: 'match',
  choices: [
    { id: 'c0', text: 'object' },
    { id: 'c1', text: 'number' },
    { id: 'c2', text: 'array' },
  ],
  rows: [
    { id: 'r0', text: '`typeof null`', choiceId: 'c0' },
    { id: 'r1', text: '`typeof []`', choiceId: 'c0' },
    { id: 'r2', text: '`typeof NaN`', choiceId: 'c1' },
  ],
  explanation: { short: 's', whyCorrect: 'w', why: {} },
};

describe('MatchQuestion', () => {
  it('Conferma disabilitato finché una riga non ha scelta', () => {
    render(
      <MatchQuestion question={question} typeLabel="Abbina" answered={null} onAnswer={vi.fn()} />,
    );
    const confirm = screen.getByRole('button', { name: 'Conferma' });
    expect(confirm.hasAttribute('disabled')).toBe(true);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0]!, { target: { value: 'c0' } });
    fireEvent.change(selects[1]!, { target: { value: 'c0' } });
    expect(confirm.hasAttribute('disabled')).toBe(true);
    fireEvent.change(selects[2]!, { target: { value: 'c1' } });
    expect(confirm.hasAttribute('disabled')).toBe(false);
  });

  it('invia la selection corretta', () => {
    const onAnswer = vi.fn();
    render(
      <MatchQuestion question={question} typeLabel="Abbina" answered={null} onAnswer={onAnswer} />,
    );
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0]!, { target: { value: 'c0' } });
    fireEvent.change(selects[1]!, { target: { value: 'c0' } });
    fireEvent.change(selects[2]!, { target: { value: 'c2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));
    expect(onAnswer).toHaveBeenCalledWith({
      format: 'match',
      selection: { r0: 'c0', r1: 'c0', r2: 'c2' },
    });
  });
});
