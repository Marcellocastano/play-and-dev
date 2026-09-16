import { shuffle, type Option } from '@lg/core';

export { shuffle };

export type Rng = () => number;

/** Nomi di variabili/plurali usati nei contesti generati. */
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

export function pickInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pickInts(rng: Rng, n: number, min: number, max: number, unique = false): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  let guard = 0;
  while (out.length < n && guard++ < 1000) {
    const v = pickInt(rng, min, max);
    if (unique && seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  if (out.length < n) throw new Error('pickInts: range troppo piccolo');
  return out;
}

export function pickOf<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

/**
 * Formatta un valore come farebbe console.log:
 * stringhe senza virgolette al top level (con virgolette dentro array/oggetti),
 * array come `[ 1, 2 ]`, oggetti `{ a: 1 }`, undefined/NaN letterali.
 */
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

export interface Distractor {
  text: string;
  why: string;
}

export interface BuiltOptions {
  options: Option[];
  correctOptionId: string;
  whyOthersWrong: Record<string, string>;
}

/**
 * Costruisce le 4 opzioni: la corretta + 3 distrattori con motivazione.
 * Lancia se i distrattori non sono abbastanza distinti (duplicati o uguali
 * alla risposta corretta). Mischia con rng.
 */
export function makeOptions(
  rng: Rng,
  correct: Distractor,
  distractors: readonly Distractor[],
): BuiltOptions {
  const byText = new Map<string, Distractor>();
  for (const d of distractors) {
    if (d.text !== correct.text && !byText.has(d.text)) byText.set(d.text, d);
  }
  const finalDistractors = [...byText.values()].slice(0, 3);
  if (finalDistractors.length < 3) {
    throw new Error('makeOptions: distrattori insufficienti o duplicati');
  }
  const all = shuffle([correct, ...finalDistractors], rng);
  const options = all.map((d, i) => ({ id: `opt${i}`, text: d.text }));
  const correctOptionId = options[all.indexOf(correct)]!.id;
  const whyOthersWrong: Record<string, string> = {};
  for (const o of options) {
    if (o.id === correctOptionId) continue;
    const src = all.find((d) => d.text === o.text)!;
    whyOthersWrong[o.id] = src.why;
  }
  return { options, correctOptionId, whyOthersWrong };
}

/**
 * Rigenera i dati finché fn non produce un risultato senza lanciare
 * (es. distrattori che collassano). Dopo `limit` tentativi lancia.
 */
export function retry<T>(fn: () => T, limit = 60): T {
  let lastError: unknown;
  for (let i = 0; i < limit; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
