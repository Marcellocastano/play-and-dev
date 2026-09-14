import type { Question } from '@lg/core';
import { getDeepDive } from '@lg/subject-javascript';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CodeBlock } from '../ui/CodeBlock';
import { Icon } from '../ui/Icon';

export function DeepDiveDrawer({
  question,
  open,
  onClose,
}: {
  question: Question;
  open: boolean;
  onClose(): void;
}) {
  const dive = question.deepDiveRef ? getDeepDive(question.deepDiveRef) : undefined;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="deep-dive-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="deep-dive-inner">
        <div className="deep-dive-header">
          <div>
            <span className="eyebrow">FERMATI. ESPLORA. COMPRENDI.</span>
            <h2 id={titleId}>{dive?.title ?? 'Approfondimento'}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Chiudi approfondimento"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="deep-dive-lead">
          Un po’ di contesto per collegare quello che hai appena imparato.
        </p>
        {dive ? (
          <div className="deep-dive-sections">
            {dive.sections.map((section, i) => (
              <section key={section.heading}>
                <span className="eyebrow">
                  {String(i + 1).padStart(2, '0')} / ESPLORA IL CONCETTO
                </span>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
                {section.code && <CodeBlock code={section.code} />}
              </section>
            ))}
          </div>
        ) : (
          <p>Nessun approfondimento disponibile per questa domanda.</p>
        )}
        <button type="button" className="button button--primary" onClick={onClose}>
          Torna all’esercizio
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
