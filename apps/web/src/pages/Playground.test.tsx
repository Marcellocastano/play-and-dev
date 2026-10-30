// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Playground } from './Playground';

afterEach(cleanup);

const renderPage = () =>
  render(
    <MemoryRouter>
      <Playground />
    </MemoryRouter>,
  );

describe('Playground', () => {
  it('genera una domanda categorize con gli elementi da classificare', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Classifica' }));
    fireEvent.click(screen.getByRole('button', { name: 'Altra domanda' }));
    expect(document.querySelector('[data-category-id]')).toBeTruthy();
    expect(document.querySelector('.question-surface')).toBeTruthy();
  });

  it('genera una domanda vero/falso con i bottoni V e F', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Vero o falso' }));
    fireEvent.click(screen.getByRole('button', { name: 'Altra domanda' }));
    expect(screen.getAllByRole('button', { name: 'Vero' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Falso' }).length).toBeGreaterThan(0);
  });
});
