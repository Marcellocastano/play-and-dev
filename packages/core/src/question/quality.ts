import type { Question } from '../models/index.js';

/**
 * Controlli di qualità didattica, oltre alla validità strutturale di
 * validateQuestion(). Individuano domande "indovinabili" senza conoscere
 * l'argomento (bias di lunghezza, indizi nel testo, distrattori assoluti).
 * Usati come gate nei test dei contenuti; non bloccano a runtime.
 */

/** Tolleranza sulla lunghezza: la corretta può scostarsi dalla mediana dei distrattori al massimo di max(8 caratteri, 40%). */
const LENGTH_ABS_TOLERANCE = 8;
const LENGTH_REL_TOLERANCE = 0.4;

/** Aperture che rendono un'opzione riconoscibile come distrattore "di riempimento". */
const ABSOLUTE_OPENERS = /^(solo|soltanto|nessun[ao]?|tutt[ei]|sempre|mai|entramb[ei])\b/i;

/** Le motivazioni devono spiegare l'errore, non classificare chi lo commette. */
const WHY_MIN_LENGTH = 60;
const LABELLING_OPENERS = /^(chi|quando)\b/i;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function qualityIssues(q: Question): string[] {
  const issues: string[] = [];
  const correct = q.options.find((o) => o.id === q.correctOptionId);
  if (!correct) return ['correct option not found'];
  const distractors = q.options.filter((o) => o.id !== q.correctOptionId);

  const med = median(distractors.map((o) => o.text.length));
  const tolerance = Math.max(LENGTH_ABS_TOLERANCE, med * LENGTH_REL_TOLERANCE);
  if (Math.abs(correct.text.length - med) > tolerance) {
    issues.push(
      `length bias: correct option is ${correct.text.length} chars, distractors median ${med} (tolerance ${tolerance.toFixed(0)})`,
    );
  }

  for (const o of q.options) {
    if (ABSOLUTE_OPENERS.test(o.text.trim())) issues.push(`absolute opener in option: "${o.text}"`);
    if (o.text.includes('//')) issues.push(`comment in option leaks a hint: "${o.text}"`);
  }

  for (const [id, why] of Object.entries(q.explanation.whyOthersWrong)) {
    if (why.trim().length < WHY_MIN_LENGTH) issues.push(`why for ${id} is too short: "${why}"`);
    if (LABELLING_OPENERS.test(why.trim())) issues.push(`why for ${id} labels the learner instead of explaining: "${why}"`);
  }

  const answer = correct.text.trim();
  if (answer.length >= 4 && q.prompt.includes(answer)) {
    issues.push(`prompt contains the correct answer verbatim: "${answer}"`);
  }

  return issues;
}
