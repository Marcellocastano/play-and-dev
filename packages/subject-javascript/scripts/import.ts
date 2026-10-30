import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Difficulty } from '@lg/core';
import type { BankQuestion } from '../src/bank/types.js';
import {
  allocateIds,
  checkCandidate,
  dedupKey,
  extractJson,
  toBankQuestion,
} from './checkCandidate.js';
import { draftsDir, loadApproved, loadDrafts, writeDraft } from './bankIO.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function required(name: string): string {
  const v = arg(name);
  if (!v) {
    console.error(`parametro obbligatorio mancante: --${name}`);
    process.exit(1);
  }
  return v;
}

const file = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!file) {
  console.error('uso: npm run content:import -- <file.json> --topic X --type Y --difficulty Z');
  process.exit(1);
}
const topicId = required('topic');
const type = required('type');
const difficulty = required('difficulty') as Difficulty;

const raw = readFileSync(resolve(process.env.INIT_CWD ?? process.cwd(), file), 'utf8');

const parsed = extractJson(raw);
const candidates: Record<string, unknown>[] = Array.isArray(parsed)
  ? parsed
  : ((parsed as { questions?: Record<string, unknown>[] }).questions ?? []);
if (candidates.length === 0) {
  console.error('nessuna domanda nel file');
  process.exit(1);
}

const existing = [
  ...loadApproved(topicId),
  ...loadDrafts(topicId).flatMap((d) => d.file.questions),
];
const seenKeys = new Set(existing.map((q) => dedupKey(q as unknown as Record<string, unknown>)));
const nextId = allocateIds(topicId, type);

const accepted: BankQuestion[] = [];
const rejected: { prompt: string; reasons: string[] }[] = [];

for (const c of candidates) {
  const { q, reasons } = checkCandidate(c, { topicId, type, difficulty, seenKeys });
  if (q && reasons.length === 0) {
    seenKeys.add(dedupKey(c));
    accepted.push(toBankQuestion(q, nextId(), 'ai'));
  } else {
    rejected.push({ prompt: String(c.prompt ?? '(senza prompt)').slice(0, 80), reasons });
  }
}

const reasonCounts = new Map<string, number>();
for (const r of rejected) {
  for (const reason of r.reasons) {
    const label = reason.split(':')[0] ?? reason;
    reasonCounts.set(label, (reasonCounts.get(label) ?? 0) + 1);
  }
}

console.log(`\n=== Report import ${topicId} / ${type} / ${difficulty} ===`);
console.log(`Accettate: ${accepted.length}/${candidates.length}`);
console.log(`Rifiutate: ${rejected.length}`);
for (const [reason, n] of [...reasonCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n}× ${reason}`);
}
for (const r of rejected) {
  console.log(`  ✗ ${r.prompt} — ${r.reasons.join('; ')}`);
}

if (accepted.length > 0) {
  const path = writeDraft(topicId, accepted);
  console.log(`Bozza scritta: ${path}`);
  console.log(`(bozze in ${draftsDir}: approvazione manuale con npm run content:approve)`);
} else {
  console.log('Nessuna domanda accettata: nessuna bozza scritta.');
}
