import { buildRecommendations, emptyProgress, type LevelId, type Session } from '@lg/core';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Badge, BAND_LABEL } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatTile } from '../components/ui/StatTile';
import { SubjectArtwork, subjectStyle } from '../components/ui/SubjectArtwork';
import { persistence } from '../services/LocalStoragePersistence';
import { useProgressStore } from '../state/progressStore';
import { useSessionStore } from '../state/sessionStore';
import { useSubjectStore } from '../state/subjectStore';

export function Dashboard() {
  const { subjectId = '' } = useParams();
  const subject = useSubjectStore((s) => s.getSubject(subjectId));
  const selectSubject = useSubjectStore((s) => s.selectSubject);
  const storedProgress = useProgressStore((s) => s.bySubject[subjectId]);
  const progress = storedProgress ?? emptyProgress(subjectId);
  const navigate = useNavigate();
  const [recent, setRecent] = useState<Session[]>([]);
  const [level, setLevel] = useState<LevelId>('beginner');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    selectSubject(subjectId);
    setRecent([]);
    void persistence.getSessions(subjectId).then((all) => {
      if (active) setRecent(all.slice(-5).reverse());
    });
    return () => {
      active = false;
    };
  }, [subjectId, selectSubject]);

  if (!subject)
    return (
      <p>
        Percorso non trovato. <Link to="/">Esplora i percorsi</Link>
      </p>
    );
  const masteries = subject.topics
    .map((topic) => ({ topic, mastery: progress.topicMastery[topic.id] }))
    .filter((x) => x.mastery);
  const strong = masteries.filter((x) => x.mastery!.score >= 61).slice(0, 3);
  const weak = masteries.filter((x) => x.mastery!.score <= 40);
  const recommendations = buildRecommendations(progress, subject);
  const totals = Object.values(progress.topicMastery);
  const accuracy = Math.round(
    (totals.reduce((sum, m) => sum + m.weightedCorrect, 0) /
      Math.max(
        1,
        totals.reduce((sum, m) => sum + m.weightedTotal, 0),
      )) *
      100,
  );
  const visibleTopics = subject.topics.filter((t) => t.levelId === level);
  const practiceWeaknesses = async () => {
    setStarting(true);
    setError('');
    try {
      await useSessionStore.getState().start(subjectId, 'beginner', 'training', true);
      navigate(`/${subjectId}/session`);
    } catch {
      setError('Non è stato possibile preparare la sessione. Riprova.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="dashboard-page page-enter" style={subjectStyle(subject)}>
      <Link className="back-link" to="/">
        <Icon name="back" size={16} />
        Tutti i percorsi
      </Link>
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">IL TUO PERCORSO DI APPRENDIMENTO</span>
          <h1>
            {subject.name}
            <span className="course-title-dot">.</span>
            <br />
            <span className="heading-light">Una scoperta alla volta.</span>
          </h1>
          <p>
            Non devi conoscere tutte le risposte.
            <br />
            Inizia con le domande giuste.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to={`/${subjectId}/setup`}>
              Inizia allenamento
              <Icon name="arrow" size={18} />
            </Link>
            <span>20 esercizi · Feedback immediato</span>
          </div>
        </div>
        <SubjectArtwork subject={subject} compact />
      </section>
      <div className="stats-grid">
        <StatTile icon="bolt" label="Esperienza" value={progress.xp} hint="XP conquistati" />
        <StatTile
          icon="layers"
          label="Livello personale"
          value={String(progress.playerLevel).padStart(2, '0')}
          hint="Ogni tentativo conta"
        />
        <StatTile
          icon="spark"
          label="Costanza"
          value={`${progress.currentStreak} gg`}
          hint={`Il tuo record: ${progress.bestStreak} giorni`}
        />
        <StatTile
          icon="target"
          label="Precisione pesata"
          value={`${accuracy}%`}
          hint="In base alla difficoltà"
        />
      </div>
      <div className="dashboard-columns">
        <section className="curriculum-panel panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LA MAPPA DEL TUO SAPERE</span>
              <h2>Costruisci le basi. E vai oltre.</h2>
            </div>
            <span className="section-counter">{visibleTopics.length} argomenti</span>
          </div>
          <div className="filter-tabs level-tabs" role="group" aria-label="Livello del curriculum">
            {subject.levels.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={level === l.id}
                onClick={() => setLevel(l.id)}
              >
                {l.name}
              </button>
            ))}
          </div>
          {level !== 'beginner' && (
            <p className="curriculum-note">
              Un’anteprima del curriculum: altri argomenti arriveranno nelle prossime versioni.
            </p>
          )}
          <div className="topic-list">
            {visibleTopics.map((t, i) => {
              const mastery = progress.topicMastery[t.id];
              const score = Math.round(mastery?.score ?? 0);
              return (
                <details className="topic-row" key={t.id}>
                  <summary>
                    <span className={`topic-number ${score >= 61 ? 'topic-number--strong' : ''}`}>
                      {score >= 61 ? (
                        <Icon name="check" size={18} />
                      ) : (
                        String(i + 1).padStart(2, '0')
                      )}
                    </span>
                    <span className="topic-name">
                      <strong>{t.name}</strong>
                      <small>{BAND_LABEL[mastery?.band ?? 'unknown']}</small>
                    </span>
                    <span className="topic-meter">
                      <ProgressBar value={score} max={100} label={`Padronanza ${t.name}`} />
                      <span>{score}%</span>
                    </span>
                    <Icon name="chevron" size={16} />
                  </summary>
                  <div className="topic-content">
                    <p>{t.overview}</p>
                    <h3>Cosa imparerai</h3>
                    <ul>
                      {t.learningObjectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
        <aside className="dashboard-aside">
          <section className="recommendation-panel">
            <span className="round-icon">
              <Icon name="spark" size={22} />
            </span>
            <span className="eyebrow">IL PROSSIMO PASSO</span>
            <h2>
              La curiosità ha
              <br />
              una direzione.
            </h2>
            <p>Qualche spunto per scegliere dove concentrare la prossima sessione.</p>
            <div className="recommendation-list">
              {recommendations.slice(0, 3).map((r) => (
                <div key={r.topicId}>
                  <Icon name="arrow" size={16} />
                  <div>
                    <strong>{subject.topics.find((t) => t.id === r.topicId)?.name}</strong>
                    <p>{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            {weak.length > 0 && (
              <Button onClick={() => void practiceWeaknesses()} disabled={starting}>
                {starting ? 'Preparazione…' : 'Allena i punti deboli'}
                <Icon name="target" size={16} />
              </Button>
            )}
            {error && <p role="alert">{error}</p>}
          </section>
          <section className="panel momentum-panel">
            <div className="section-heading">
              <h2>I tuoi segnali</h2>
              <Icon name="chart" size={20} />
            </div>
            <strong className="mini-label">Punti forti</strong>
            <div className="signal-badges">
              {strong.length ? (
                strong.map((x) => (
                  <Badge tone="success" key={x.topic.id}>
                    {x.topic.name}
                  </Badge>
                ))
              ) : (
                <p>Le tue prime competenze emergeranno qui, sessione dopo sessione.</p>
              )}
            </div>
            <strong className="mini-label">Da rinforzare</strong>
            <div className="signal-badges">
              {weak.length ? (
                weak.slice(0, 3).map((x) => <Badge key={x.topic.id}>{x.topic.name}</Badge>)
              ) : (
                <p>Ancora nessuna lacuna rilevata.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
      <section className="panel history-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">IL TUO DIARIO DI PRATICA</span>
            <h2>Piccoli passi, progressi reali.</h2>
          </div>
          <Badge>{progress.totalSessions} sessioni completate</Badge>
        </div>
        {recent.length ? (
          <div className="session-history">
            {recent.map((s) => (
              <div key={s.id}>
                <span className="history-icon">
                  <Icon name="check" size={19} />
                </span>
                <span>
                  <strong>Allenamento completato</strong>
                  <small>
                    {new Date(s.startedAt).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </small>
                </span>
                <span>
                  {s.summary?.correct ?? 0}/{s.questions.length} corrette
                </span>
                <strong>+{s.summary?.xp ?? 0} XP</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            <Icon name="book" size={28} />
            <div>
              <strong>La prima pagina è ancora da scrivere.</strong>
              <p>
                Completa una sessione: qui ritroverai i tuoi progressi, non solo i tuoi punteggi.
              </p>
            </div>
            <Link className="text-link" to={`/${subjectId}/setup`}>
              Cominciamo
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
