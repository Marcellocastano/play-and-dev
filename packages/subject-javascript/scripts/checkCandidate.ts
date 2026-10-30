import {
  normalizeOutput,
  qualityIssues,
  validateAIQuestion,
  type Difficulty,
  type Question,
} from '@lg/core';
import type { BankQuestion } from '../src/bank/types.js';
import { javascriptSubject } from '../src/index.js';
import { runCode } from './runCode.js';
import { loadApproved, loadDrafts } from './bankIO.js';

const TYPE_ABBREV: Record<string, string> = {
  'predict-output': 'po',
  'find-the-bug': 'fb',
  'fill-the-gap': 'fg',
  'multiple-choice': 'mc',
  compare: 'cmp',
  'best-method': 'bm',
  categorize: 'cg',
  match: 'mt',
  'true-false': 'tf',
};

export function extractJson(text: string): unknown {
  const fence = /```(?:json)?\s*\n([\s\S]*?)```/.exec(text);
  const body = fence ? fence[1]! : text;
  try {
    return JSON.parse(body);
  } catch {
    const start = body.indexOf('{');
    const end = body.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(body.slice(start, end + 1));
    const aStart = body.indexOf('[');
    const aEnd = body.lastIndexOf(']');
    if (aStart >= 0 && aEnd > aStart) return JSON.parse(body.slice(aStart, aEnd + 1));
    throw new Error('nessun JSON trovato nel file');
  }
}

export function wrapCodeText(text: string): string {
  if (text.includes('`')) return text;
  const t = text.trim();
  const looksCode =
    t.includes('=>') || /^[\w$.[\]'"]+\(.*\)$/.test(t) || (/^[[{]/.test(t) && /[\]}]$/.test(t));
  return looksCode ? `\`${t}\`` : text;
}

export function normalizeCandidate(c: Record<string, unknown>): Record<string, unknown> {
  const q = { ...c };
  for (const field of ['prompt', 'code'] as const) {
    if (typeof q[field] === 'string') q[field] = (q[field] as string).trim();
  }
  const lists: [string, string][] = [
    ['categories', 'c'],
    ['choices', 'c'],
    ['items', 'i'],
    ['rows', 'r'],
    ['statements', 's'],
  ];
  for (const [field, prefix] of lists) {
    const list = q[field];
    if (!Array.isArray(list)) continue;
    q[field] = list.map((e: Record<string, unknown>, i: number) => {
      const el = { ...e };
      for (const key of ['text', 'categoryId', 'choiceId', 'id'] as const) {
        if (typeof el[key] === 'string') el[key] = (el[key] as string).trim();
      }
      if (typeof el.id !== 'string' || el.id === '') el.id = `${prefix}${i}`;
      if (['items', 'rows', 'choices'].includes(field) && typeof el.text === 'string') {
        el.text = wrapCodeText(el.text as string);
      }
      return el;
    });
  }
  delete q.type;
  delete q.difficulty;
  delete q.topicId;
  return q;
}

export function dedupKey(candidate: Record<string, unknown>): string {
  const parts = [String(candidate.prompt ?? ''), String(candidate.code ?? '')];
  for (const field of ['items', 'rows', 'statements'] as const) {
    const list = candidate[field];
    if (Array.isArray(list)) {
      parts.push(list.map((e) => String((e as { text?: string }).text ?? '')).join('|'));
    }
  }
  return parts.join('|||');
}

export interface CheckContext {
  topicId: string;
  type: string;
  difficulty: Difficulty;
  seenKeys: Set<string>;
}

export function checkCandidate(
  candidate: Record<string, unknown>,
  ctx: CheckContext,
): { q?: Question; reasons: string[] } {
  const reasons: string[] = [];
  const topic = javascriptSubject.topics.find((t) => t.id === ctx.topicId);
  if (!topic) {
    return { reasons: [`topic sconosciuto: ${ctx.topicId}`] };
  }
  const subtopicId = String(candidate.subtopicId ?? '');
  if (!topic.subtopics.some((s) => s.id === subtopicId)) {
    reasons.push(
      `subtopicId sconosciuto per ${ctx.topicId}: ${subtopicId || '(mancante)'} (validi: ${topic.subtopics.map((s) => s.id).join(', ')})`,
    );
  }
  const ex = candidate.explanation as { why?: Record<string, unknown> } | undefined;
  if (ex?.why) {
    for (const [k, v] of Object.entries(ex.why)) {
      if (typeof v !== 'string' || v.trim() === '') delete ex.why[k];
    }
  }
  const key = dedupKey(candidate);
  if (ctx.seenKeys.has(key)) reasons.push('duplicato di una domanda esistente');
  const result = validateAIQuestion({
    format: 'choice',
    ...candidate,
    templateId: `bank-${ctx.topicId}-${ctx.type}-${ctx.difficulty}`,
    topicId: ctx.topicId,
    type: ctx.type,
    difficulty: ctx.difficulty,
    deepDiveRef: `dd-${ctx.topicId}`,
  });
  if (!result.ok || !result.question) {
    reasons.push(...result.errors);
    return { reasons };
  }
  const q = result.question;
  reasons.push(...qualityIssues(q));
  if (q.format === 'match') reasons.push(...checkExecutableMatch(q));
  if (q.format === 'true-false') reasons.push(...checkExecutableTrueFalse(q));
  if (q.type === 'predict-output' && q.format === 'choice' && q.code) {
    let actual: string;
    try {
      actual = runCode(q.code);
    } catch (err) {
      reasons.push(`codice non valido: ${(err as Error).message.split('\n')[0]}`);
      return { q, reasons };
    }
    const correct = q.options.find((o) => o.id === q.correctOptionId)?.text;
    if (actual !== correct) {
      reasons.push(
        `predict-output: eseguito "${actual.replace(/\n/g, '|')}", dichiarato "${correct}"`,
      );
    }
  }
  return { q, reasons };
}

const JS_ERROR_NAMES = new Set(['SyntaxError', 'ReferenceError']);

function stripCode(t: string): string {
  return t.replace(/`/g, '').trim();
}

function tryEval(expr: string): string | null {
  try {
    const out = runCode(`console.log(${expr})`);
    return JS_ERROR_NAMES.has(out) ? null : out;
  } catch {
    return null;
  }
}

function checkExecutableMatch(q: Extract<Question, { format: 'match' }>): string[] {
  const reasons: string[] = [];
  const rowOuts = new Map<string, string>();
  for (const r of q.rows) {
    const out = tryEval(stripCode(r.text));
    if (out === null) return [];
    rowOuts.set(r.id, normalizeOutput(out));
  }
  const choiceOuts = new Map<string, string>();
  for (const c of q.choices) {
    const out = tryEval(stripCode(c.text));
    if (out === null) return [];
    choiceOuts.set(c.id, normalizeOutput(out));
  }
  for (const r of q.rows) {
    const declared = choiceOuts.get(r.choiceId) ?? '?';
    if (rowOuts.get(r.id) !== declared) {
      reasons.push(`match: ${r.text} produce "${rowOuts.get(r.id)}", dichiarato "${declared}"`);
    }
  }
  return reasons;
}

function checkExecutableTrueFalse(q: Extract<Question, { format: 'true-false' }>): string[] {
  const reasons: string[] = [];
  for (const s of q.statements) {
    const m = /^`([^`]+)`\s+(?:restituisce|vale|è)\s+`?([^`]+?)`?\s*\.?$/.exec(s.text.trim());
    if (!m) continue;
    const actual = tryEval(m[1]!);
    const claimed = tryEval(stripCode(m[2]!));
    if (actual === null || claimed === null) continue;
    const real = normalizeOutput(actual) === normalizeOutput(claimed);
    if (real !== s.value) {
      reasons.push(
        `true-false: "${s.text}" dichiarato ${s.value}, ma \`${m[1]}\` produce "${normalizeOutput(actual)}"`,
      );
    }
  }
  return reasons;
}

export function allocateIds(topicId: string, type: string): () => string {
  const abbrev = TYPE_ABBREV[type] ?? type;
  const idPattern = new RegExp(`^${topicId}-[a-z]+-(\\d+)$`);
  const allKnown = [
    ...loadApproved(topicId),
    ...loadDrafts(topicId, true).flatMap((d) => d.file.questions),
  ];
  let nextSeq = Math.max(0, ...allKnown.map((q) => Number(idPattern.exec(q.id)?.[1] ?? 0))) + 1;
  return () => `${topicId}-${abbrev}-${String(nextSeq++).padStart(4, '0')}`;
}

export function toBankQuestion(
  q: Question,
  id: string,
  source: BankQuestion['source'],
): BankQuestion {
  const { id: _id, templateId: _t, variantKey: _v, deepDiveRef: _d, ...rest } = q;
  return { ...rest, id, source };
}
