import type { LevelId } from '@lg/core';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { useSessionStore } from '../state/sessionStore';
import { useSubjectStore } from '../state/subjectStore';

const LEVEL_LABEL: Record<LevelId, string> = {
  beginner: 'Le fondamenta',
  intermediate: 'Le connessioni',
  advanced: 'La profondità',
};

export function SessionSetup() {
  const { subjectId = '' } = useParams();
  const subject = useSubjectStore((s) => s.getSubject(subjectId));
  const start = useSessionStore((s) => s.start);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LevelId>('beginner');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  if (!subject) return <p>Percorso non trovato.</p>;
  const choose = async () => {
    setStarting(true);
    setError('');
    try {
      await start(subjectId, selected, 'training');
      navigate(`/${subjectId}/session`);
    } catch {
      setError('Non è stato possibile preparare gli esercizi. Riprova.');
      setStarting(false);
    }
  };

  return (
    <div className="setup-page page-enter">
      <Link className="back-link" to={`/${subjectId}`}>
        <Icon name="back" size={16} />
        Il mio percorso
      </Link>
      <section className="page-intro">
        <div>
          <span className="eyebrow">{subject.name.toUpperCase()} / ALLENAMENTO</span>
          <h1>
            Trova il tuo punto
            <br />
            di partenza.
          </h1>
          <p>
            Una buona sfida ti fa pensare, non ti mette fretta.
            <br />
            Scegli il livello: puoi cambiarlo a ogni sessione.
          </p>
        </div>
        <div className="setup-insignia" aria-hidden="true">
          <Icon name="target" size={56} />
          <span>
            LA PRATICA
            <br />
            FA SPAZIO ALLE IDEE
          </span>
        </div>
      </section>
      <div className="level-selection" role="group" aria-label="Scegli il livello">
        {subject.levels.map((level, i) => {
          const topicCount = subject.topics.filter((t) => level.topicIds.includes(t.id)).length;
          return (
            <button
              type="button"
              key={level.id}
              className={`level-card level-card--${level.id}`}
              aria-pressed={selected === level.id}
              onClick={() => setSelected(level.id)}
              disabled={starting}
            >
              <div className="level-card-top">
                <span>PERCORSO 0{i + 1}</span>
                <span className="selection-indicator">
                  {selected === level.id && <Icon name="check" size={14} />}
                </span>
              </div>
              <div className={`level-sculpture level-sculpture--${i + 1}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="level-kicker">{level.name}</span>
              <h2>{LEVEL_LABEL[level.id]}</h2>
              <p>{level.description}</p>
              <div className="level-card-bottom">
                <span>{topicCount} argomenti disponibili</span>
                {level.id !== 'beginner' ? <span>Anteprima</span> : <Icon name="spark" size={15} />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="session-launch">
        <div>
          <span className="launch-symbol">
            <Icon name="bolt" size={25} />
          </span>
          <span>
            <strong>20 esercizi. Tante nuove connessioni.</strong>
            <small>Domande miste · Spiegazioni a ogni risposta · Nessuna fretta</small>
          </span>
        </div>
        <Button disabled={starting} onClick={() => void choose()}>
          {starting ? 'Prepariamo la tua sessione…' : 'Iniziamo a imparare'}
          <Icon name="arrow" size={19} />
        </Button>
      </div>
      {error && (
        <p role="alert" className="inline-error">
          {error}
        </p>
      )}
      <div className="setup-principles">
        {[
          {
            icon: 'book' as const,
            title: 'Capire, non indovinare',
            text: 'Leggi il codice e prenditi il tempo per ragionare.',
          },
          {
            icon: 'spark' as const,
            title: 'Sbagliare è parte del gioco',
            text: 'Ogni errore ha una spiegazione da portare con te.',
          },
          {
            icon: 'target' as const,
            title: 'Un passo alla volta',
            text: 'Alla fine, scopri su cosa concentrare la tua pratica.',
          },
        ].map((item) => (
          <div key={item.title}>
            <Icon name={item.icon} size={21} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
