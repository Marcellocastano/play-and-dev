import { useMemo, useState } from 'react';
import {
  generateQuestion,
  toTextFormat,
  type Difficulty,
  type Question,
  type QuestionAttempt,
} from '@lg/core';
import { FeedbackPanel } from '../components/feedback/FeedbackPanel';
import { questionRenderers } from '../components/question/questionRenderers';
import { Button } from '../components/ui/Button';
import { makeAttempt } from '../state/sessionStore';
import { useSubjectStore } from '../state/subjectStore';

type FormatFilter = 'categorize' | 'match' | 'true-false' | 'text' | 'choice';

const FORMAT_FILTERS: { id: FormatFilter; label: string }[] = [
  { id: 'categorize', label: 'Classifica' },
  { id: 'match', label: 'Abbina' },
  { id: 'true-false', label: 'Vero o falso' },
  { id: 'text', label: "Scrivi l'output" },
  { id: 'choice', label: 'Scelta multipla' },
];

const DIFFICULTIES: { id: Difficulty | 'all'; label: string }[] = [
  { id: 'all', label: 'Tutte' },
  { id: 'easy', label: 'Facile' },
  { id: 'medium', label: 'Media' },
  { id: 'hard', label: 'Difficile' },
];

const PROBE_SEED = 4242;

function pickRandom<T>(arr: readonly T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function Playground() {
  const subjects = useSubjectStore((s) => s.subjects);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '');
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];

  const [format, setFormat] = useState<FormatFilter>('categorize');
  const [topicId, setTopicId] = useState('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState<QuestionAttempt | null>(null);
  const [round, setRound] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());

  const pool = useMemo(() => {
    if (!subject) return [];
    return subject.templates
      .filter((t) => topicId === 'all' || t.topicId === topicId)
      .filter((t) => difficulty === 'all' || t.difficulty === difficulty)
      .map((t) => {
        const sample = generateQuestion(t, PROBE_SEED);
        const isTextable = t.type === 'predict-output' && sample.format === 'choice';
        return { template: t, format: sample.format, isTextable };
      })
      .filter((e) =>
        format === 'text'
          ? e.isTextable
          : format === 'choice'
            ? e.format === 'choice'
            : e.format === format,
      );
  }, [subject, topicId, difficulty, format]);

  function newQuestion() {
    const entry = pickRandom(pool);
    if (!entry) return;
    let q = generateQuestion(entry.template, Math.floor(Math.random() * 1_000_000));
    if (format === 'text' && q.format === 'choice' && q.type === 'predict-output') {
      q = toTextFormat(q);
    }
    setQuestion(q);
    setAnswered(null);
    setStartedAt(Date.now());
    setRound((r) => r + 1);
  }

  function retry() {
    setAnswered(null);
    setStartedAt(Date.now());
    setRound((r) => r + 1);
  }

  const Renderer = question ? questionRenderers[question.format] : null;

  return (
    <section className="playground">
      <h1>Prova i formati</h1>
      <p className="muted">
        Genera una domanda a caso dai template del subject, senza salvare nulla.
      </p>

      {subjects.length > 1 && (
        <label className="playground-field">
          Subject{' '}
          <select value={subject?.id} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="filter-tabs" role="group" aria-label="Formato">
        {FORMAT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={format === f.id}
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filter-tabs" role="group" aria-label="Argomento">
        <button type="button" aria-pressed={topicId === 'all'} onClick={() => setTopicId('all')}>
          Tutti
        </button>
        {subject?.topics.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={topicId === t.id}
            onClick={() => setTopicId(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="filter-tabs" role="group" aria-label="Difficoltà">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            type="button"
            aria-pressed={difficulty === d.id}
            onClick={() => setDifficulty(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="muted">
        {pool.length === 0
          ? 'Nessun template corrisponde ai filtri.'
          : `${pool.length} template corrispondono ai filtri.`}
      </p>

      <div className="playground-actions">
        <Button onClick={newQuestion} disabled={pool.length === 0}>
          Altra domanda
        </Button>
        {question && (
          <Button variant="ghost" onClick={retry}>
            Riprova
          </Button>
        )}
      </div>

      {question && Renderer && (
        <>
          <div className="question-surface">
            <Renderer
              key={`${question.id}-${round}`}
              question={question}
              answered={answered}
              onAnswer={(response) => setAnswered(makeAttempt(question, response, startedAt))}
            />
          </div>
          <FeedbackPanel
            question={question}
            attempt={answered}
            onNext={newQuestion}
            nextLabel="Altra domanda"
          />
          <p className="muted playground-meta">
            {question.templateId} · {question.id}
          </p>
        </>
      )}
    </section>
  );
}
