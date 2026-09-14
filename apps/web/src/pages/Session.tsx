import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { FeedbackPanel } from '../components/feedback/FeedbackPanel';
import { questionRenderers } from '../components/question/questionRenderers';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Icon } from '../components/ui/Icon';
import { useSessionStore } from '../state/sessionStore';
import { useSubjectStore } from '../state/subjectStore';

export function SessionPage() {
  const { subjectId = '' } = useParams();
  const navigate = useNavigate();
  const subject = useSubjectStore((s) => s.getSubject(subjectId));
  const { session, index, answered, lastXp, answer, next, finishing } = useSessionStore();
  const reducedMotion = useReducedMotion();

  // Nessuna sessione attiva (es. reload a metà): torna al setup.
  useEffect(() => {
    if ((!session || session.subjectId !== subjectId) && subject)
      navigate(`/${subjectId}/setup`, { replace: true });
  }, [session, subject, subjectId, navigate]);

  useEffect(() => {
    if (session?.finishedAt && session.subjectId === subjectId)
      navigate(`/${subjectId}/summary`, { replace: true });
  }, [session?.finishedAt, session?.subjectId, navigate, subjectId]);

  if (!session || session.subjectId !== subjectId) return <p>Reindirizzamento al setup…</p>;
  const q = session.questions[index];
  if (!q) return null;
  const Renderer = questionRenderers[q.type];
  const streak = [...session.attempts].reverse().findIndex((a) => !a.correct);
  const currentStreak = streak === -1 ? session.attempts.length : streak;

  return (
    <div className="study-page">
      <div className="study-heading">
        <Link className="back-link" to={`/${subjectId}`}>
          <Icon name="back" size={16} />
          Torna al percorso
        </Link>
        <span className="focus-label">
          <span className="tiny-dot" />
          SPAZIO DI PRATICA
        </span>
      </div>
      <div className="study-progress">
        <div className="study-progress-top">
          <span>
            {subject?.name}
            <span className="muted"> / Allenamento</span>
          </span>
          <span>
            <strong>{String(index + 1).padStart(2, '0')}</strong> / {session.questions.length}
          </span>
        </div>
        <ProgressBar
          value={index + (answered ? 1 : 0)}
          max={session.questions.length}
          label="Progresso sessione"
        />
        <div className="study-progress-bottom">
          <span>Una domanda alla volta.</span>
          <span className="study-streak">
            <Icon name="bolt" size={14} />
            {currentStreak} risposte corrette di fila
          </span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="question-surface"
            animate={
              answered && !answered.correct && !reducedMotion ? { x: [0, -4, 4, 0] } : { x: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            {Renderer ? (
              <Renderer question={q} answered={answered} onAnswer={answer} />
            ) : (
              <p>Tipo di domanda non supportato: {q.type}</p>
            )}
          </motion.div>
          <FeedbackPanel
            question={q}
            attempt={answered}
            onNext={next}
            nextLabel={
              finishing
                ? 'Salvataggio…'
                : index === session.questions.length - 1
                  ? 'Scopri i tuoi risultati'
                  : 'Prossima domanda'
            }
            busy={finishing}
          />
        </motion.div>
      </AnimatePresence>
      {!answered && (
        <p className="study-reminder">
          <Icon name="spark" size={16} />
          Non c’è fretta: capire vale più che rispondere velocemente.
        </p>
      )}
      <AnimatePresence>
        {answered && lastXp > 0 && (
          <motion.div
            key={`xp-${q.id}`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: reducedMotion ? 0 : -25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, times: [0, 0.15, 0.8, 1] }}
            className="xp-toast"
          >
            <Icon name="bolt" size={17} />+{lastXp} XP<span>Un passo avanti.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
