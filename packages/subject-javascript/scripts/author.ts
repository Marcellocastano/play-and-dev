import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import OpenAI from 'openai';
import { qualityIssues, validateAIQuestion, type Question } from '@lg/core';
import { javascriptSubject } from '../src/index.js';
import type { BankQuestion } from '../src/bank/types.js';
import { runCode } from './runCode.js';
import { draftsDir, loadApproved, loadDrafts, pkgRoot, repoRoot, writeDraft } from './bankIO.js';

const TYPE_ABBREV: Record<string, string> = {
  'predict-output': 'po',
  'find-the-bug': 'fb',
  'fill-the-gap': 'fg',
  'multiple-choice': 'mc',
  compare: 'cmp',
  'best-method': 'bm',
};

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

const systemPrompt = readFileSync(join(pkgRoot, 'scripts', 'author.prompt.md'), 'utf8');
const templateId = `bank-${topicId}-${type}-${difficulty}`;

const approved = loadApproved(topicId);
const drafts = loadDrafts(topicId).flatMap((d) => d.file.questions);
const existing = [...approved, ...drafts];
const seenKeys = new Set(existing.map((q) => `${q.prompt}|||${q.code ?? ''}`));

const existingPrompts = existing.map((q) => `- ${q.prompt}`).join('\n');

function buildUserPrompt(missing: number): string {
  const lines = [
    `Topic: ${topic!.name} (${topic!.id})`,
    `Overview: ${topic!.overview}`,
    '',
    'Subtopic:',
    ...topic!.subtopics.map((s) => `- ${s.id}: ${s.name}${s.overview ? ` — ${s.overview}` : ''}`),
    '',
    'Obiettivi di apprendimento:',
    ...topic!.learningObjectives.map((o) => `- ${o}`),
    '',
    'Errori comuni degli studenti:',
    ...topic!.commonMistakes.map((m) => `- ${m}`),
    '',
    'Esempi:',
    ...topic!.examples.map((e) => `- ${e}`),
    '',
    `Genera ${missing} domande di tipo "${type}" e difficoltà "${difficulty}", distribuite sui subtopic.`,
  ];
  if (existingPrompts) {
    lines.push(
      '',
      'Prompt già presenti in banca o in bozza — NON ripeterli né riproporre varianti banali:',
      existingPrompts,
    );
  }
  return lines.join('\n');
}

const openai = new OpenAI({ apiKey });

interface Rejection {
  prompt: string;
  reasons: string[];
}

const accepted: BankQuestion[] = [];
const rejected: Rejection[] = [];

function check(candidate: Record<string, unknown>): { q?: Question; reasons: string[] } {
  const reasons: string[] = [];
  const ex = candidate.explanation as { whyOthersWrong?: Record<string, unknown> } | undefined;
  if (ex?.whyOthersWrong) {
    for (const [k, v] of Object.entries(ex.whyOthersWrong)) {
      if (typeof v !== 'string' || v.trim() === '') delete ex.whyOthersWrong[k];
    }
  }
  const key = `${candidate.prompt}|||${candidate.code ?? ''}`;
  if (seenKeys.has(key)) reasons.push('duplicato di una domanda esistente');
  const result = validateAIQuestion({
    ...candidate,
    templateId,
    topicId,
    type,
    difficulty,
    deepDiveRef: `dd-${topicId}`,
  });
  if (!result.ok || !result.question) {
    reasons.push(...result.errors);
    return { reasons };
  }
  const q = result.question;
  reasons.push(...qualityIssues(q));
  if (q.type === 'predict-output' && q.code) {
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

const abbrev = TYPE_ABBREV[type] ?? type;
const idPattern = new RegExp(`^${topicId}-[a-z]+-(\\d+)$`);
const allKnown = [...existing, ...loadDrafts(topicId, true).flatMap((d) => d.file.questions)];
let nextSeq = Math.max(0, ...allKnown.map((q) => Number(idPattern.exec(q.id)?.[1] ?? 0))) + 1;
const assignId = () => `${topicId}-${abbrev}-${String(nextSeq++).padStart(4, '0')}`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: buildUserPrompt(missing) },
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
    const { q, reasons } = check(c);
    if (q && reasons.length === 0) {
      seenKeys.add(`${q.prompt}|||${q.code ?? ''}`);
      accepted.push({
        id: assignId(),
        topicId,
        subtopicId: q.subtopicId,
        type: q.type,
        difficulty: q.difficulty,
        skills: q.skills,
        prompt: q.prompt,
        code: q.code,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        source: 'ai',
        model,
        createdAt: new Date().toISOString(),
      });
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
