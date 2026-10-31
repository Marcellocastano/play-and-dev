export * from '@lg/subject-kit';
import type { Rng } from '@lg/subject-kit';

export const VAR_NAMES = [
  'x',
  'y',
  'n',
  'totale',
  'contatore',
  'punteggio',
  'prezzo',
  'quantita',
  'risultato',
  'valore',
] as const;

export const PERSON_NAMES = ['Ada', 'Marco', 'Lucia', 'Sara', 'Paolo', 'Elena'] as const;

export function pickName(rng: Rng, names: readonly string[] = VAR_NAMES): string {
  return names[Math.floor(rng() * names.length)]!;
}

export function fmt(value: unknown, nested = false): string {
  if (typeof value === 'string') return nested ? `'${value}'` : value;
  if (typeof value === 'number') return Number.isNaN(value) ? 'NaN' : String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[ ${value.map((v) => fmt(v, true)).join(', ')} ]`;
  if (typeof value === 'function') return '[Function]';
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([k, v]) => `${k}: ${fmt(v, true)}`,
    );
    return `{ ${entries.join(', ')} }`;
  }
  return String(value);
}
