// @vitest-environment jsdom
import type { Question } from '@lg/core';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextAnswerQuestion } from './TextAnswerQuestion';

afterEach(cleanup);

type TextQ = Extract<Question, { format: 'text' }>;

const base: Omit<TextQ, 'accepted'> = {
  id: 'q1',
  templateId: 't1',
  variantKey: 'v1',
  type: 'predict-output',
  difficulty: 'easy',
  topicId: 'variables',
  subtopicId: 'variables-declaration',
  skills: [],
  prompt: 'Cosa stampa?',
  code: 'console.log(1);',
  format: 'text',
  explanation: { short: 's', whyCorrect: 'w', why: {} },
};

const question: TextQ = { ...base, accepted: ['1'] };
const multiline: TextQ = { ...base, accepted: ['1\n2'] };

describe('TextAnswerQuestion', () => {
  it('Invio invia la risposta su input singola riga', () => {
    const onAnswer = vi.fn();
    render(
      <TextAnswerQuestion
        question={question}
        typeLabel="Scrivi"
        answered={null}
        onAnswer={onAnswer}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAnswer).toHaveBeenCalledWith({ format: 'text', text: '1' });
  });

  it('con output multilinea usa textarea e Invio non invia', () => {
    const onAnswer = vi.fn();
    render(
      <TextAnswerQuestion
        question={multiline}
        typeLabel="Scrivi"
        answered={null}
        onAnswer={onAnswer}
      />,
    );
    const area = screen.getByRole('textbox');
    fireEvent.change(area, { target: { value: '1\n2' } });
    fireEvent.keyDown(area, { key: 'Enter' });
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));
    expect(onAnswer).toHaveBeenCalledWith({ format: 'text', text: '1\n2' });
  });

  it('Conferma disabilitato con input vuoto', () => {
    render(
      <TextAnswerQuestion
        question={question}
        typeLabel="Scrivi"
        answered={null}
        onAnswer={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Conferma' }).hasAttribute('disabled')).toBe(true);
  });
});
