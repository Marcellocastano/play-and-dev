import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useProgressStore } from '../../state/progressStore';
import { useSubjectStore } from '../../state/subjectStore';
import { Icon } from './Icon';

/** Layout con header (subject, XP, streak) e sfondo con gradiente hero + forme decorative. */
export function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const routeSubjectId = pathname.split('/')[1];
  const subjects = useSubjectStore((s) => s.subjects);
  const selectSubject = useSubjectStore((s) => s.selectSubject);
  const subject = subjects.find((s) => s.id === routeSubjectId);
  const progress = useProgressStore((s) => (subject ? s.bySubject[subject.id] : undefined));
  const studying = pathname.endsWith('/session');
  const section =
    pathname === '/'
      ? 'Esplora i percorsi'
      : studying
        ? 'Il tuo spazio di pratica'
        : pathname.endsWith('/setup')
          ? 'Prepara la sessione'
          : pathname.endsWith('/summary')
            ? 'I tuoi risultati'
            : 'Il tuo percorso';

  useEffect(() => {
    selectSubject(subject?.id ?? null);
  }, [subject?.id, selectSubject]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={`app-shell ${studying ? 'app-shell--focus' : ''}`}>
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="Play & Dev, tutti i percorsi">
          <span className="brand-mark">
            <Icon name="code" size={23} />
          </span>
          <span>
            play<span className="brand-and">&</span>dev<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="sidebar-label">IL TUO SPAZIO</div>
        <nav className="main-nav" aria-label="Navigazione principale">
          <NavLink to="/" end aria-label="Esplora tutti i percorsi">
            <Icon name="grid" />
            <span>Esplora</span>
            <span className="nav-count">{subjects.length}</span>
          </NavLink>
          {subject?.status === 'available' && (
            <>
              <NavLink to={`/${subject.id}`} end aria-label="Il mio percorso">
                <Icon name="chart" />
                <span>Il mio percorso</span>
              </NavLink>
              <NavLink to={`/${subject.id}/setup`} aria-label="Allenamento">
                <Icon name="bolt" />
                <span>Allenamento</span>
              </NavLink>
            </>
          )}
        </nav>
        <div className="sidebar-label sidebar-courses-label">I PERCORSI DISPONIBILI</div>
        <div className="sidebar-courses">
          {subjects
            .filter((s) => s.status === 'available')
            .map((s) => (
              <Link key={s.id} to={`/${s.id}`} className="sidebar-course">
                <span style={{ background: s.theme.primary }}>{s.icon}</span>
                <span>
                  {s.name}
                  <small>Impara. Sperimenta. Cresci.</small>
                </span>
                <Icon name="chevron" size={14} />
              </Link>
            ))}
        </div>
        <div className="sidebar-note">
          <span className="note-icon">
            <Icon name="spark" size={23} />
          </span>
          <strong>
            Il prossimo errore?
            <br />
            Un passo avanti.
          </strong>
          <p>Qui non devi sapere già tutto. Devi solo avere voglia di capire.</p>
          <div className="note-line" />
        </div>
        <div className="sidebar-footer">
          <span className="avatar">Tu</span>
          <div>
            <strong>Il tuo spazio personale</strong>
            <small>Progressi salvati sul dispositivo</small>
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="breadcrumb">
            <Link to="/">Studio</Link>
            <span>/</span>
            <span>{section}</span>
          </div>
          <div className="topbar-status">
            <span className="saved-status">
              <span />
              Salvataggio locale
            </span>
            {progress && (
              <span className="xp-chip">
                <Icon name="bolt" size={15} />
                {progress.xp} XP
              </span>
            )}
            <span className="avatar avatar--small">Tu</span>
          </div>
        </header>
        <main id="main-content" className="page-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="page-footer">
          <span>Piccoli passi. Grandi connessioni.</span>
          <span>Impara per capire, non solo per rispondere.</span>
        </footer>
      </div>
    </div>
  );
}
