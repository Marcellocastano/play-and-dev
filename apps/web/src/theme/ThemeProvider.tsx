import { useEffect, type ReactNode } from 'react';
import { useSubjectStore } from '../state/subjectStore';
import { applyTheme, resetTheme } from './applyTheme';

/** Applica il tema del subject corrente a :root; senza subject resta il neutro. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const subjectId = useSubjectStore((s) => s.currentSubjectId);
  const subjects = useSubjectStore((s) => s.subjects);

  useEffect(() => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) applyTheme(subject.theme);
    else resetTheme();
  }, [subjectId, subjects]);

  return <>{children}</>;
}

/** Anteprima temporanea del tema (hover sulle card "Prossimamente"). */
export function previewSubjectTheme(subjectId: string): () => void {
  const store = useSubjectStore.getState();
  const subject = store.subjects.find((s) => s.id === subjectId);
  if (subject) applyTheme(subject.theme);
  return () => {
    const current = store.subjects.find((s) => s.id === store.currentSubjectId);
    if (current) applyTheme(current.theme);
    else resetTheme();
  };
}
