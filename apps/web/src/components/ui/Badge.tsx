import type { MasteryBand } from '@lg/core';
import type { ReactNode } from 'react';

export const BAND_LABEL: Record<MasteryBand, string> = {
  unknown: 'Da scoprire',
  weak: 'Da rinforzare',
  learning: 'In apprendimento',
  good: 'Buona',
  strong: 'Forte',
  mastered: 'Padronanza',
};

const KIND_LABEL: Record<string, string> = {
  language: 'Linguaggio',
  framework: 'Framework',
  runtime: 'Runtime',
};

export function kindLabel(kind: string): string {
  return KIND_LABEL[kind] ?? kind;
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'danger' | 'accent';
}) {
  const tones: Record<string, string> = {
    neutral: 'badge--neutral',
    success: 'badge--success',
    danger: 'badge--danger',
    accent: 'badge--accent',
  };
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}
