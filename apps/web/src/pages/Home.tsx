import { masteryBand, type SubjectKind } from '@lg/core';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Badge, BAND_LABEL, kindLabel } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SubjectArtwork, subjectStyle } from '../components/ui/SubjectArtwork';
import { useProgressStore } from '../state/progressStore';
import { useSubjectStore } from '../state/subjectStore';
import { previewSubjectTheme } from '../theme/ThemeProvider';

const filters: { id: SubjectKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Tutti i percorsi' },
  { id: 'language', label: 'Linguaggi' },
  { id: 'framework', label: 'Framework' },
  { id: 'runtime', label: 'Runtime' },
];

export function Home() {
  const subjects = useSubjectStore((s) => s.subjects);
  const progressBySubject = useProgressStore((s) => s.bySubject);
  const [filter, setFilter] = useState<SubjectKind | 'all'>('all');
  const restoreRef = useRef<(() => void) | null>(null);
  const restore = () => {
    restoreRef.current?.();
    restoreRef.current = null;
  };
  useEffect(() => () => restoreRef.current?.(), []);
  const filtered = subjects.filter((s) => filter === 'all' || s.kind === filter);

  return (
    <div className="explore-page page-enter">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="tiny-dot" /> IL TUO PROSSIMO PASSO INIZIA QUI
          </span>
          <h1>Cosa vuoi padroneggiare?</h1>
          <p>
            Accendi la curiosità. Metti alla prova le idee.
            <br className="desktop-break" /> Trasforma ogni tentativo in qualcosa che resta.
          </p>
        </div>
        <div className="intro-stamp" aria-hidden="true">
          <Icon name="spark" size={30} />
          <span>
            Meno teoria a memoria.
            <br />
            <strong>Più connessioni.</strong>
          </span>
        </div>
      </section>
      <div className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="Filtra i percorsi">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => {
                restore();
                setFilter(f.id);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="catalog-count">{filtered.length} percorsi da esplorare</span>
      </div>
      <div className="catalog-grid">
        {filtered.map((subject) => {
          const progress = progressBySubject[subject.id];
          const score = subject.topics.length
            ? Math.round(
                subject.topics.reduce(
                  (sum, t) => sum + (progress?.topicMastery[t.id]?.score ?? 0),
                  0,
                ) / subject.topics.length,
              )
            : 0;
          const available = subject.status === 'available';
          return available ? (
            <article key={subject.id} className="course-feature" style={subjectStyle(subject)}>
              <div className="course-feature-main">
                <div className="course-copy">
                  <div className="course-overline">
                    <Badge tone="success">Disponibile ora</Badge>
                    <span>{kindLabel(subject.kind)}</span>
                  </div>
                  <h2>
                    {subject.name}
                    <span className="course-title-dot">.</span>
                  </h2>
                  <p>{subject.description}</p>
                  <div className="course-facts">
                    <span>
                      <Icon name="layers" size={16} />
                      {subject.topics.filter((t) => t.levelId === 'beginner').length} argomenti base
                    </span>
                    <span>
                      <Icon name="code" size={16} />
                      {new Set(subject.templates.map((t) => t.type)).size} tipi di esercizio
                    </span>
                  </div>
                  <Link className="button button--primary course-cta" to={`/${subject.id}`}>
                    Entra nel percorso
                    <Icon name="arrow" size={18} />
                  </Link>
                  <span className="course-cta-note">Il tuo ritmo. Una sessione alla volta.</span>
                </div>
                <SubjectArtwork subject={subject} />
              </div>
              <div className="course-progress">
                <span className="progress-level">
                  {String(progress?.playerLevel ?? 1).padStart(2, '0')}
                  <small>LIVELLO</small>
                </span>
                <div>
                  <div className="course-progress-label">
                    <strong>
                      {score === 0 ? 'La tua storia inizia da qui' : BAND_LABEL[masteryBand(score)]}
                    </strong>
                    <span>{score}% padronanza</span>
                  </div>
                  <ProgressBar value={score} max={100} label={`Padronanza ${subject.name}`} />
                </div>
                <Icon name="target" size={24} />
              </div>
              <details className="course-preview">
                <summary>
                  Dentro questo percorso
                  <span>
                    Esplora gli argomenti
                    <Icon name="chevron" size={14} />
                  </span>
                </summary>
                <div className="preview-topics">
                  {subject.topics.map((t) => (
                    <span key={t.id}>{t.name}</span>
                  ))}
                </div>
              </details>
            </article>
          ) : (
            <article
              key={subject.id}
              className="upcoming-course"
              style={subjectStyle(subject)}
              onMouseEnter={() => {
                restore();
                restoreRef.current = previewSubjectTheme(subject.id);
              }}
              onMouseLeave={restore}
            >
              <div className="upcoming-top">
                <span className="subject-monogram">{subject.icon}</span>
                <Badge>Prossimamente</Badge>
              </div>
              <div className="upcoming-glyph" aria-hidden="true">
                {subject.icon}
              </div>
              <div className="upcoming-copy">
                <span className="eyebrow">{kindLabel(subject.kind)}</span>
                <h2>{subject.name}</h2>
                <p>{subject.description}</p>
              </div>
              <details
                className="upcoming-details"
                onFocus={() => {
                  restore();
                  restoreRef.current = previewSubjectTheme(subject.id);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) restore();
                }}
              >
                <summary>
                  Scopri il percorso
                  <Icon name="arrow" size={16} />
                </summary>
                <p>
                  Questo percorso è in preparazione. Esercizi e progressi saranno disponibili quando
                  il curriculum sarà pronto.
                </p>
              </details>
            </article>
          );
        })}
      </div>
      <section className="learning-strip">
        <span className="learning-strip-symbol">
          <Icon name="spark" size={27} />
        </span>
        <div>
          <strong>Non una corsa al punteggio. Un modo diverso di imparare.</strong>
          <p>Gli errori diventano spiegazioni. Le spiegazioni diventano nuove competenze.</p>
        </div>
        <div className="learning-cycle">
          <span>Esplora</span>
          <Icon name="arrow" size={14} />
          <span>Prova</span>
          <Icon name="arrow" size={14} />
          <span>Comprendi</span>
        </div>
      </section>
    </div>
  );
}
