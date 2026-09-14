// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Home } from './Home';
import { SessionSetup } from './SessionSetup';
import { Dashboard } from './Dashboard';
import { Route, Routes } from 'react-router';

afterEach(cleanup);

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

describe('Home', () => {
  it('mostra il percorso disponibile e le tecnologie in arrivo', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: 'Cosa vuoi padroneggiare?' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /JavaScript/ })).toBeTruthy();
    expect(screen.getAllByText('Prossimamente')).toHaveLength(6);
    expect(screen.getByRole('link', { name: /Entra nel percorso/ }).getAttribute('href')).toBe(
      '/javascript',
    );
  });

  it('filtra i percorsi senza rendere avviabili quelli non disponibili', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: 'Framework' }));
    expect(screen.queryByRole('heading', { name: /JavaScript/ })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Vue' })).toBeTruthy();
    expect(screen.getAllByText('Prossimamente')).toHaveLength(3);
    expect(screen.queryByRole('link', { name: /Entra nel percorso/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Framework' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tutti i percorsi' }));
    expect(screen.getByRole('heading', { name: /JavaScript/ })).toBeTruthy();
  });

  it('espone il curriculum in una disclosure accessibile', () => {
    renderHome();
    const summary = screen.getByText('Dentro questo percorso').closest('summary')!;
    fireEvent.click(summary);
    expect(summary.parentElement?.hasAttribute('open')).toBe(true);
    fireEvent.click(summary);
    expect(summary.parentElement?.hasAttribute('open')).toBe(false);
  });
});

describe('Dashboard', () => {
  it('funziona prima del caricamento dei progressi e mostra un curriculum esplorabile', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/javascript']}>
          <Routes>
            <Route path="/:subjectId" element={<Dashboard />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(screen.getByRole('heading', { name: 'Costruisci le basi. E vai oltre.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Inizia allenamento/ }).getAttribute('href')).toBe(
      '/javascript/setup',
    );
    expect(screen.getByText('La prima pagina è ancora da scrivere.')).toBeTruthy();
  });
});

describe('SessionSetup', () => {
  it('permette di scegliere un livello senza avviare subito una sessione', () => {
    render(
      <MemoryRouter initialEntries={['/javascript/setup']}>
        <Routes>
          <Route path="/:subjectId/setup" element={<SessionSetup />} />
        </Routes>
      </MemoryRouter>,
    );
    const beginner = screen.getByRole('button', { name: /Le fondamenta/ });
    const intermediate = screen.getByRole('button', { name: /Le connessioni/ });
    expect(beginner.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(intermediate);
    expect(intermediate.getAttribute('aria-pressed')).toBe('true');
    expect(beginner.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /Iniziamo a imparare/ })).toBeTruthy();
  });
});
