import { MotionConfig } from 'motion/react';
import { useEffect, type ReactNode } from 'react';
import { useProgressStore } from '../state/progressStore';
import { useSubjectStore } from '../state/subjectStore';
import { ThemeProvider } from '../theme/ThemeProvider';

export function Providers({ children }: { children: ReactNode }) {
  const loadAll = useProgressStore((s) => s.loadAll);
  const subjects = useSubjectStore((s) => s.subjects);

  useEffect(() => {
    void loadAll(subjects.map((s) => s.id));
  }, [loadAll, subjects]);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>{children}</ThemeProvider>
    </MotionConfig>
  );
}
