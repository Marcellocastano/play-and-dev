import { buildRecommendations, emptyProgress } from '@lg/core';
import { motion } from 'motion/react';
import { useState, type CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { StatTile } from '../components/ui/StatTile';
import { useProgressStore } from '../state/progressStore';
import { useSessionStore } from '../state/sessionStore';
import { useSubjectStore } from '../state/subjectStore';

export function Summary() {
  const { subjectId = '' } = useParams();
  const navigate = useNavigate();
  const subject = useSubjectStore((s) => s.getSubject(subjectId));
  const session = useSessionStore((s) => s.session);
  const storedProgress = useProgressStore((s) => s.bySubject[subjectId]);
  const progress = storedProgress ?? emptyProgress(subjectId);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  if (!session?.summary || !subject || session.subjectId !== subjectId)
    return (
      <div className="panel empty-summary">
        <Icon name="book" size={35} />
        <h1>La tua prossima scoperta ti aspetta.</h1>
        <p>Completa un allenamento per esplorare i tuoi risultati.</p>
        <Link className="button button--primary" to={`/${subjectId}`}>
          Torna al percorso
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    );
  const sum = session.summary;
  const topicName = (id: string) => subject.topics.find((t) => t.id === id)?.name ?? id;
  const recommendations = buildRecommendations(progress, subject);
  const hasWeak = Object.values(progress.topicMastery).some((m) => m.score <= 40 && m.attempts > 0);
  const newBadges = progress.achievements.filter(
    (a) => a.unlockedAt !== undefined && a.unlockedAt >= (session.finishedAt ?? 0) - 5000,
  );
  const restart = async (weighted: boolean) => {
    setStarting(true);
    setError('');
    try {
      await useSessionStore.getState().start(subjectId, session.levelId, 'training', weighted);
      navigate(`/${subjectId}/session`);
    } catch {
      setError('Non è stato possibile preparare la sessione. Riprova.');
      setStarting(false);
    }
  };

  return (
    <div className="summary-page page-enter">
      <Link className="back-link" to={`/${subjectId}`}>
        <Icon name="back" size={16} />
        Il mio percorso
      </Link>
      <section className="summary-hero">
        <div
          className="result-orbit"
          style={{ '--result-angle': `${sum.accuracy * 3.6}deg` } as CSSProperties}
        >
          <div>
            <Icon name="trophy" size={25} />
            <strong>
              {sum.correct}
              <span>/{session.questions.length}</span>
            </strong>
            <small>RISPOSTE CORRETTE</small>
          </div>
          <span className="result-spark">
            <Icon name="spark" size={29} />
          </span>
        </div>
        <div>
          <span className="eyebrow">SESSIONE COMPLETATA / {subject.name.toUpperCase()}</span>
          <h1>
            Non sei più
            <br />
            al punto di partenza.
          </h1>
          <p>
            {sum.incorrect === 0
              ? 'Una sessione perfetta. Ora prova a trasferire quello che sai in una nuova sfida.'
              : 'Ogni risposta ti ha insegnato qualcosa. Anche quelle che non erano giuste.'}
          </p>
          <span className="summary-xp">
            <Icon name="bolt" size={16} />+{sum.xp} XP<span>Un altro passo nel tuo percorso</span>
          </span>
        </div>
      </section>
      <div className="stats-grid">
        <StatTile
          icon="target"
          label="Precisione"
          value={`${sum.accuracy}%`}
          hint={`${sum.correct} corrette · ${sum.incorrect} da rivedere`}
        />
        <StatTile
          icon="bolt"
          label="Punteggio"
          value={sum.score}
          hint="Un risultato da cui ripartire"
        />
        <StatTile
          icon="spark"
          label="Migliore serie"
          value={sum.maxStreak}
          hint="Risposte corrette consecutive"
        />
        <StatTile
          icon="clock"
          label="Tempo medio"
          value={`${(sum.avgTimeMs / 1000).toFixed(1)}s`}
          hint="Il tuo ritmo di ragionamento"
        />
      </div>
      {newBadges.length > 0 && (
        <motion.div
          className="achievement-banner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Icon name="trophy" size={26} />
          <div>
            <strong>Una nuova tappa raggiunta</strong>
            <div>
              {newBadges.map((badge) => (
                <Badge key={badge.id} tone="accent">
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      <div className="summary-columns">
        <section className="panel session-insights">
          <span className="eyebrow">PORTA CON TE QUELLO CHE HAI IMPARATO</span>
          <h2>Il tuo allenamento, in breve.</h2>
          <div className="insight-group">
            <span className="round-icon">
              <Icon name="check" size={20} />
            </span>
            <div>
              <h3>Le connessioni più forti</h3>
              <div className="signal-badges">
                {sum.bestTopics.map((t) => (
                  <Badge key={t} tone="success">
                    {topicName(t)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="insight-group">
            <span className="round-icon">
              <Icon name="target" size={20} />
            </span>
            <div>
              <h3>Dove tornare a esplorare</h3>
              <div className="signal-badges">
                {sum.incorrect ? (
                  sum.worstTopics.map((t) => <Badge key={t}>{topicName(t)}</Badge>)
                ) : (
                  <p>Nessun errore in questa sessione. Continua a consolidare le tue competenze.</p>
                )}
              </div>
            </div>
          </div>
          <details className="answer-review">
            <summary>
              Riguarda le tue risposte
              <Icon name="chevron" size={16} />
            </summary>
            <ol>
              {session.attempts.map((attempt, i) => {
                const q = session.questions.find((question) => question.id === attempt.questionId);
                return (
                  <li key={attempt.questionId}>
                    <span className={`review-dot ${attempt.correct ? 'review-dot--correct' : ''}`}>
                      <Icon name={attempt.correct ? 'check' : 'close'} size={14} />
                    </span>
                    <div>
                      <strong>
                        {i + 1}. {q?.prompt}
                      </strong>
                      <p>{q?.explanation.short}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </details>
        </section>
        <section className="recommendation-panel">
          <span className="eyebrow">E ADESSO?</span>
          <h2>
            Segui la prossima
            <br />
            connessione.
          </h2>
          <div className="recommendation-list">
            {recommendations.map((r) => (
              <div key={r.topicId}>
                <Icon name="arrow" size={16} />
                <div>
                  <strong>{topicName(r.topicId)}</strong>
                  <p>{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <Button disabled={starting} onClick={() => void restart(hasWeak)}>
            {starting ? 'Preparazione…' : hasWeak ? 'Allena i punti deboli' : 'Un’altra sessione'}
            <Icon name="arrow" size={17} />
          </Button>
          <Link className="summary-return text-link" to={`/${subjectId}`}>
            Per oggi va bene così. Torna al percorso.
          </Link>
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
