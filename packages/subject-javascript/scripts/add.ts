import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { questionTypeRegistry, type Difficulty } from '@lg/core';
import { javascriptSubject } from '../src/index.js';
import { MIN_BANK_SIZE } from '../src/bank/index.js';
import type { BankFile, BankQuestion } from '../src/bank/types.js';
import {
  allocateIds,
  checkCandidate,
  dedupKey,
  extractJson,
  normalizeCandidate,
  toBankQuestion,
} from './checkCandidate.js';
import {
  approvedFilePath,
  contentIndexPath,
  draftsDir,
  loadApproved,
  loadDrafts,
  repoRoot,
  saveApproved,
} from './bankIO.js';

const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const FORMAT_TYPE: Record<string, string> = {
  categorize: 'categorize',
  match: 'match',
  'true-false': 'true-false',
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const fileArg = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'risposta.json';
const inputPath = resolve(process.env.INIT_CWD ?? repoRoot, fileArg);
if (!existsSync(inputPath)) {
  console.error(`file non trovato: ${inputPath}`);
  console.error('incolla la risposta della chat in risposta.json nella root del repo e rilancia.');
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = extractJson(readFileSync(inputPath, 'utf8'));
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
const top = (Array.isArray(parsed) ? {} : parsed) as Record<string, unknown>;
const candidates: Record<string, unknown>[] = (
  Array.isArray(parsed) ? parsed : ((top.questions as Record<string, unknown>[]) ?? [])
).filter((c): c is Record<string, unknown> => c !== null && typeof c === 'object');

const topicId = (top.topicId as string | undefined) ?? arg('topic');
const topicOfSubtopic = (id: unknown): string | undefined =>
  javascriptSubject.topics.find((t) => t.subtopics.some((s) => s.id === id))?.id;
if (!topicId && candidates.some((c) => !c.topicId && !topicOfSubtopic(c.subtopicId))) {
  console.error('topicId mancante: aggiungi "topicId" nel file o passa --topic <id>');
  process.exit(1);
}
if (candidates.length === 0) {
  console.error('nessuna domanda nel file: "questions" è vuoto o assente');
  process.exit(1);
}

const accepted: { topicId: string; type: string; difficulty: Difficulty; bq: BankQuestion }[] = [];
const rejected: { prompt: string; reasons: string[] }[] = [];
const seenByTopic = new Map<string, Set<string>>();
const allocators = new Map<string, () => string>();

function seenFor(topic: string): Set<string> {
  let s = seenByTopic.get(topic);
  if (!s) {
    const existing = [
      ...loadApproved(topic),
      ...loadDrafts(topic).flatMap((d) => d.file.questions),
    ];
    s = new Set(existing.map((q) => dedupKey(q as unknown as Record<string, unknown>)));
    seenByTopic.set(topic, s);
  }
  return s;
}
function allocatorFor(topic: string, type: string): () => string {
  const key = `${topic}:${type}`;
  let a = allocators.get(key);
  if (!a) {
    a = allocateIds(topic, type);
    allocators.set(key, a);
  }
  return a;
}

for (const raw of candidates) {
  const prompt = String(raw.prompt ?? '(senza prompt)').slice(0, 70);
  const metaReasons: string[] = [];
  const topic = String(raw.topicId ?? topicId ?? topicOfSubtopic(raw.subtopicId));
  if (!javascriptSubject.topics.some((t) => t.id === topic)) {
    metaReasons.push(`topic sconosciuto: ${topic}`);
  }
  const type = String(raw.type ?? '') || FORMAT_TYPE[String(raw.format ?? '')] || arg('type') || '';
  if (!type && raw.format === 'choice') {
    metaReasons.push('type mancante (obbligatorio per format choice)');
  } else if (!type) {
    metaReasons.push('type mancante');
  } else if (!questionTypeRegistry.has(type)) {
    metaReasons.push(`type sconosciuto: ${type}`);
  }
  const difficulty = String(raw.difficulty ?? top.difficulty ?? arg('difficulty') ?? '');
  if (!DIFFICULTIES.has(difficulty)) {
    metaReasons.push(`difficulty non valida: ${difficulty || '(mancante)'}`);
  }
  const c = normalizeCandidate(raw);
  if (metaReasons.length > 0) {
    rejected.push({ prompt, reasons: metaReasons });
    continue;
  }
  const { q, reasons } = checkCandidate(c, {
    topicId: topic,
    type,
    difficulty: difficulty as Difficulty,
    seenKeys: seenFor(topic),
  });
  if (q && reasons.length === 0) {
    seenFor(topic).add(dedupKey(c));
    accepted.push({
      topicId: topic,
      type,
      difficulty: difficulty as Difficulty,
      bq: toBankQuestion(q, allocatorFor(topic, type)(), 'ai'),
    });
  } else {
    rejected.push({ prompt, reasons });
  }
}

console.log(`\nApprovate ${accepted.length} · Scartate ${rejected.length}`);
for (const r of rejected) {
  console.log(`  ✗ ${r.prompt} — ${r.reasons.join('; ')}`);
}

if (accepted.length === 0) {
  process.exit(1);
}

const touchedTopics = [...new Set(accepted.map((a) => a.topicId))];
const backups = new Map<string, string | null>();
for (const t of touchedTopics) {
  const path = approvedFilePath(t);
  backups.set(path, existsSync(path) ? readFileSync(path, 'utf8') : null);
}
backups.set(contentIndexPath, readFileSync(contentIndexPath, 'utf8'));

for (const t of touchedTopics) {
  const merged = [...loadApproved(t), ...accepted.filter((a) => a.topicId === t).map((a) => a.bq)];
  saveApproved(t, merged);
}

const test = spawnSync('npx', ['vitest', 'run', 'packages/subject-javascript'], {
  cwd: repoRoot,
  encoding: 'utf8',
});
if (test.status !== 0) {
  for (const [path, content] of backups) {
    if (content === null) {
      rmSync(path);
    } else {
      writeFileSync(path, content, 'utf8');
    }
  }
  const out = `${test.stdout ?? ''}\n${test.stderr ?? ''}`;
  console.error('\nNessuna modifica applicata: i test falliscono con queste domande.');
  const lines = out.split('\n').filter((l) => l.trim() !== '');
  console.error(lines.slice(-60).join('\n'));
  process.exit(1);
}

const approvedDir = join(draftsDir, 'approved');
mkdirSync(approvedDir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '-');
for (const t of touchedTopics) {
  const file: BankFile = {
    topicId: t,
    questions: accepted.filter((a) => a.topicId === t).map((a) => a.bq),
  };
  writeFileSync(join(approvedDir, `${t}-${ts}.json`), JSON.stringify(file, null, 2) + '\n');
}
writeFileSync(inputPath, '{ "questions": [] }\n');

for (const t of touchedTopics) {
  const groups = new Map<string, number>();
  for (const a of accepted.filter((a) => a.topicId === t)) {
    const k = `${a.type}:${a.difficulty}`;
    groups.set(k, (groups.get(k) ?? 0) + 1);
  }
  for (const [k] of groups) {
    const [type, difficulty] = k.split(':');
    const total = loadApproved(t).filter(
      (q) => q.type === type && q.difficulty === difficulty,
    ).length;
    const label = `${t}:${type}:${difficulty}`;
    if (total < MIN_BANK_SIZE) {
      console.log(
        `${label}: ${total} domande in banca — non ancora attivo: servono altre ${MIN_BANK_SIZE - total} domande`,
      );
    } else {
      console.log(`${label}: ${total} domande in banca — attivo`);
    }
  }
}
console.log('Test: ok');
for (const t of touchedTopics) {
  console.log(`Per una rilettura del contenuto: chiedi a Devin "rivedi le domande di ${t}"`);
}
