import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import OpenAI from 'openai';
import { javascriptSubject } from '../src/index.js';
import type { BankQuestion } from '../src/bank/types.js';
import { buildPrompts } from './buildPrompt.js';
import { allocateIds, checkCandidate, dedupKey, toBankQuestion } from './checkCandidate.js';
import { draftsDir, loadApproved, loadDrafts, repoRoot, writeDraft } from './bankIO.js';

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

const topicId = required('topic');
const type = required('type');
const difficulty = required('difficulty') as 'easy' | 'medium' | 'hard';
const count = Number(arg('count') ?? '6');

loadEnv({ path: join(repoRoot, 'apps', 'server', '.env') });
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY mancante: configura apps/server/.env');
  process.exit(1);
}
const model = arg('model') ?? 'gpt-4.1';

const topic = javascriptSubject.topics.find((t) => t.id === topicId);
if (!topic) {
  console.error(`topic sconosciuto: ${topicId}`);
  process.exit(1);
}

const existing = [
  ...loadApproved(topicId),
  ...loadDrafts(topicId).flatMap((d) => d.file.questions),
];
const seenKeys = new Set(existing.map((q) => dedupKey(q as unknown as Record<string, unknown>)));

const { system } = buildPrompts({ topicId, type, difficulty, count });
const nextId = allocateIds(topicId, type);
const openai = new OpenAI({ apiKey });

interface Rejection {
  prompt: string;
  reasons: string[];
}

const accepted: BankQuestion[] = [];
const rejected: Rejection[] = [];

for (let round = 1; round <= 3 && accepted.length < count; round++) {
  const missing = count - accepted.length;
  let res;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      res = await openai.chat.completions.create({
        model,
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: buildPrompts({ topicId, type, difficulty, count: missing }).user,
          },
        ],
      });
      break;
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 429 || (status !== undefined && status >= 500)) {
        const wait = Math.min(60, 5 * attempt * attempt);
        console.error(`round ${round}: HTTP ${status}, riprovo tra ${wait}s`);
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      throw err;
    }
  }
  if (!res) {
    console.error(`round ${round}: API non raggiungibile dopo 5 tentativi, interrompo`);
    break;
  }
  const raw = res.choices[0]?.message.content ?? '{}';
  let questions: Record<string, unknown>[];
  try {
    const parsed = JSON.parse(raw) as { questions?: Record<string, unknown>[] };
    questions = parsed.questions ?? [];
  } catch {
    console.error(`round ${round}: JSON non valido nella risposta del modello`);
    continue;
  }
  for (const c of questions) {
    const { q, reasons } = checkCandidate(c, { topicId, type, difficulty, seenKeys });
    if (q && reasons.length === 0) {
      seenKeys.add(dedupKey(c));
      accepted.push(toBankQuestion(q, nextId(), 'ai'));
    } else {
      rejected.push({ prompt: String(c.prompt ?? '(senza prompt)').slice(0, 80), reasons });
    }
  }
}

const reasonCounts = new Map<string, number>();
for (const r of rejected) {
  for (const reason of r.reasons) {
    const label = reason.split(':')[0] ?? reason;
    reasonCounts.set(label, (reasonCounts.get(label) ?? 0) + 1);
  }
}

console.log(`\n=== Report authoring ${topicId} / ${type} / ${difficulty} ===`);
console.log(`Modello: ${model}`);
console.log(`Accettate: ${accepted.length}/${count} richieste`);
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
