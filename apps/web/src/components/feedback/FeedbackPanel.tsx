import type { Question, QuestionAttempt } from '@lg/core';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { aiClient } from '../../services/aiClient';
import { Button } from '../ui/Button';
import { CodeBlock } from '../ui/CodeBlock';
import { Icon } from '../ui/Icon';
import { DeepDiveDrawer } from './DeepDiveDrawer';

interface FeedbackPanelProps {
  question: Question;
  attempt: QuestionAttempt | null;
  onNext(): void;
  nextLabel?: string;
  busy?: boolean;
}

export function FeedbackPanel({
  question,
  attempt,
  onNext,
  nextLabel = 'Prossima domanda',
  busy = false,
}: FeedbackPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [diveOpen, setDiveOpen] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const requestVersion = useRef(0);
  const explanationId = useId();

  useEffect(() => {
    setExpanded(false);
    setDiveOpen(false);
    setAiText(null);
    setAiState('idle');
    const requests = requestVersion;
    return () => {
      requests.current++;
    };
  }, [question.id]);

  useEffect(() => {
    if (!attempt || diveOpen || busy) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest(
            'button, a, input, textarea, select, summary, [contenteditable="true"], dialog',
          ))
      )
        return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [attempt, onNext, diveOpen, busy]);

  if (!attempt) return null;
  const correct = attempt.correct;
  const ex = question.explanation;
  const askAi = async () => {
    const version = ++requestVersion.current;
    setAiState('loading');
    try {
      const text = await aiClient.generateExplanation({
        question,
        selectedOptionId: attempt.selectedOptionId,
      });
      if (version === requestVersion.current) {
        setAiText(text);
        setAiState('idle');
      }
    } catch {
      if (version === requestVersion.current) {
        setAiText(
          'Il tutor AI non è disponibile al momento. Puoi continuare con la spiegazione e l’approfondimento del percorso.',
        );
        setAiState('error');
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`feedback-panel ${correct ? 'feedback-panel--correct' : 'feedback-panel--incorrect'}`}
    >
      <div className="feedback-verdict" role="status">
        <span className="verdict-icon">
          <Icon name={correct ? 'check' : 'spark'} size={24} />
        </span>
        <div>
          <span className="eyebrow">
            {correct ? 'CONNESSIONE RIUSCITA' : 'UN’OCCASIONE PER CAPIRE'}
          </span>
          <h3>{correct ? 'Esatto. Hai colto il punto.' : 'Non proprio. Scopriamo perché.'}</h3>
          <p>{ex.short}</p>
          {!correct && (
            <p className="correct-answer-caption">
              <strong>Risposta corretta: </strong>
              {question.options.find((o) => o.id === question.correctOptionId)?.text}
            </p>
          )}
        </div>
      </div>
      <div className="feedback-actions">
        <Button
          variant="ghost"
          aria-expanded={expanded}
          aria-controls={explanationId}
          onClick={() => setExpanded((v) => !v)}
        >
          <Icon name="book" size={16} />
          {expanded ? 'Chiudi spiegazione' : 'Capisci il perché'}
        </Button>
        {question.deepDiveRef && (
          <Button variant="ghost" onClick={() => setDiveOpen(true)}>
            Approfondisci
            <Icon name="arrow" size={15} />
          </Button>
        )}
        <Button className="feedback-next" onClick={onNext} disabled={busy}>
          {nextLabel}
          <Icon name="arrow" size={16} />
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={explanationId}
            key="explanation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="expanded-explanation"
          >
            <div className="explanation-section">
              <span className="explanation-index">01</span>
              <div>
                <h4>Perché è corretta</h4>
                <p>{ex.whyCorrect}</p>
              </div>
            </div>
            <div className="explanation-section">
              <span className="explanation-index">02</span>
              <div>
                <h4>Le altre possibilità</h4>
                <ul>
                  {Object.entries(ex.whyOthersWrong).map(([id, why]) => (
                    <li key={id}>
                      <strong>{question.options.find((o) => o.id === id)?.text}</strong>
                      <p>{why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="concept-note">
              <Icon name="spark" size={20} />
              <div>
                <strong>{ex.concept}</strong>
                {ex.commonMistake && <p>{ex.commonMistake}</p>}
              </div>
            </div>
            {ex.example && <CodeBlock code={ex.example} />}
            <Button variant="ghost" onClick={() => void askAi()} disabled={aiState === 'loading'}>
              <Icon name="spark" size={16} />
              {aiState === 'loading' ? 'Il tutor sta riflettendo…' : 'Chiedi una spiegazione AI'}
            </Button>
            {aiText && (
              <p className="ai-message" role="status">
                {aiText}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <DeepDiveDrawer question={question} open={diveOpen} onClose={() => setDiveOpen(false)} />
    </motion.section>
  );
}
