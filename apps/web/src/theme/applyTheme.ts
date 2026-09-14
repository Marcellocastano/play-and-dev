import type { Theme } from '@lg/core';

const VARS: Record<string, keyof Theme | undefined> = {
  '--subject-primary': 'primary',
  '--subject-secondary': 'secondary',
  '--subject-background': 'background',
  '--subject-surface': 'surface',
  '--subject-accent': 'accent',
  '--subject-text': 'text',
  '--subject-success': 'success',
  '--subject-danger': 'danger',
};

/** Scrive le CSS vars del tema su :root; la transizione è gestita in index.css. */
export function applyTheme(theme: Theme, target: HTMLElement = document.documentElement): void {
  for (const [cssVar, key] of Object.entries(VARS)) {
    if (key) target.style.setProperty(cssVar, String(theme[key]));
  }
  target.style.setProperty('--gradient-hero', theme.gradients.hero);
  target.style.setProperty('--gradient-card', theme.gradients.card);
  target.style.setProperty('--gradient-progress', theme.gradients.progress);
}

export function resetTheme(target: HTMLElement = document.documentElement): void {
  for (const cssVar of Object.keys(VARS)) target.style.removeProperty(cssVar);
  target.style.removeProperty('--gradient-hero');
  target.style.removeProperty('--gradient-card');
  target.style.removeProperty('--gradient-progress');
}
