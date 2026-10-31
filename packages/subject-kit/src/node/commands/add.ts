import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { config as loadEnv } from 'dotenv';
import { questionTypeRegistry, type BankQuestion, type Difficulty } from '@lg/core';
import {
  allocateIds,
  authorGroup,
  checkCandidate,
  dedupKey,
  extractJson,
  normalizeCandidate,
  openAIChat,
  toBankQuestion,
} from '@lg/content-pipeline';
import {
  approvedFilePath,
  authorSystemPrompt,
  contentIndexPath,
  loadApproved,
  repoRootOf,
  pkgRel,
  saveApproved,
} from '../bankIO.js';
import type { SubjectContentConfig } from '../config.js';

const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const FORMAT_TYPE: Record<string, string> = {
  categorize: 'categorize',
  match: 'match',
  'true-false': 'true-false',
};

interface Accepted {
  topicId: string;
  type: string;
  difficulty: Difficulty;
  bq: BankQuestion;
}
interface Rejected {
  prompt: string;
  reasons: string[];
}
interface AddResult {
  accepted: Accepted[];
  inputPath?: string;
}

function arg(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}
function required(args: string[], name: string): string {
  const v = arg(args, name);
  if (!v) {
    console.error(`parametro obbligatorio mancante: --${name}`);
    process.exit(1);
  }
  return v;
}

async function addFromFile(config: SubjectContentConfig, args: string[]): Promise<AddResult> {
  const fileArg = args.find((a) => !a.startsWith('--')) ?? 'risposta.json';
  const inputPath = resolve(process.env.INIT_CWD ?? repoRootOf(config), fileArg);
  if (!existsSync(inputPath)) {
    console.error(`file non trovato: ${inputPath}`);
    console.error(
      'incolla la risposta della chat in risposta.json nella root del repo e rilancia.',
    );
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

  const topicId = (top.topicId as string | undefined) ?? arg(args, 'topic');
  const topicOfSubtopic = (id: unknown): string | undefined =>
    config.subject.topics.find((t) => t.subtopics.some((s) => s.id === id))?.id;
  if (!topicId && candidates.some((c) => !c.topicId && !topicOfSubtopic(c.subtopicId))) {
    console.error('topicId mancante: aggiungi "topicId" nel file o passa --topic <id>');
    process.exit(1);
  }
  if (candidates.length === 0) {
    console.error('nessuna domanda nel file: "questions" è vuoto o assente');
    process.exit(1);
  }

  const accepted: Accepted[] = [];
  const rejected: Rejected[] = [];
  const seenByTopic = new Map<string, Set<string>>();
  const allocators = new Map<string, () => string>();

  function seenFor(topic: string): Set<string> {
    let s = seenByTopic.get(topic);
    if (!s) {
      s = new Set(
        loadApproved(config, topic).map((q) => dedupKey(q as unknown as Record<string, unknown>)),
      );
      seenByTopic.set(topic, s);
    }
    return s;
  }
  function allocatorFor(topic: string, type: string): () => string {
    const key = `${topic}:${type}`;
    let a = allocators.get(key);
    if (!a) {
      a = allocateIds(
        topic,
        type,
        loadApproved(config, topic).map((q) => q.id),
      );
      allocators.set(key, a);
    }
    return a;
  }

  for (const raw of candidates) {
    const prompt = String(raw.prompt ?? '(senza prompt)').slice(0, 70);
    const metaReasons: string[] = [];
    const topic = String(raw.topicId ?? topicId ?? topicOfSubtopic(raw.subtopicId));
    if (!config.subject.topics.some((t) => t.id === topic)) {
      metaReasons.push(`topic sconosciuto: ${topic}`);
    }
    const type =
      String(raw.type ?? '') || FORMAT_TYPE[String(raw.format ?? '')] || arg(args, 'type') || '';
    if (!type && raw.format === 'choice') {
      metaReasons.push('type mancante (obbligatorio per format choice)');
    } else if (!type) {
      metaReasons.push('type mancante');
    } else if (!questionTypeRegistry.has(type)) {
      metaReasons.push(`type sconosciuto: ${type}`);
    }
    const difficulty = String(raw.difficulty ?? top.difficulty ?? arg(args, 'difficulty') ?? '');
    if (!DIFFICULTIES.has(difficulty)) {
      metaReasons.push(`difficulty non valida: ${difficulty || '(mancante)'}`);
    }
    const c = normalizeCandidate(raw);
    if (metaReasons.length > 0) {
      rejected.push({ prompt, reasons: metaReasons });
      continue;
    }
    const { q, reasons } = await checkCandidate(c, {
      subject: config.subject,
      runner: config.runner,
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
  return { accepted, inputPath };
}

async function addFromApi(config: SubjectContentConfig, args: string[]): Promise<AddResult> {
  const topicId = required(args, 'topic');
  const type = required(args, 'type');
  const difficulty = required(args, 'difficulty') as Difficulty;
  const count = Number(arg(args, 'count') ?? '6');
  const model = arg(args, 'model') ?? 'gpt-4.1';

  if (!config.subject.topics.some((t) => t.id === topicId)) {
    console.error(`topic sconosciuto: ${topicId}`);
    process.exit(1);
  }
  if (!questionTypeRegistry.has(type)) {
    console.error(`type sconosciuto: ${type}`);
    process.exit(1);
  }
  if (!DIFFICULTIES.has(difficulty)) {
    console.error(`difficulty non valida: ${difficulty}`);
    process.exit(1);
  }

  loadEnv({ path: join(repoRootOf(config), 'apps', 'server', '.env') });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY mancante: configura apps/server/.env');
    process.exit(1);
  }

  const report = await authorGroup({
    subject: config.subject,
    system: authorSystemPrompt(config),
    runner: config.runner,
    topicId,
    type,
    difficulty,
    count,
    existing: loadApproved(config, topicId),
    chat: openAIChat(apiKey, model),
  });
  const accepted = report.accepted.map((bq) => ({ topicId, type, difficulty, bq }));
  const rejected = report.rejected;

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
  return { accepted };
}

function mergeAndVerify(config: SubjectContentConfig, accepted: Accepted[]): void {
  const touchedTopics = [...new Set(accepted.map((a) => a.topicId))];
  const backups = new Map<string, string | null>();
  for (const t of touchedTopics) {
    const path = approvedFilePath(config, t);
    backups.set(path, existsSync(path) ? readFileSync(path, 'utf8') : null);
  }
  backups.set(contentIndexPath(config), readFileSync(contentIndexPath(config), 'utf8'));

  for (const t of touchedTopics) {
    const merged = [
      ...loadApproved(config, t),
      ...accepted.filter((a) => a.topicId === t).map((a) => a.bq),
    ];
    saveApproved(config, t, merged);
  }

  const test = spawnSync('npx', ['vitest', 'run', pkgRel(config)], {
    cwd: repoRootOf(config),
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
}

export async function runAdd(config: SubjectContentConfig, args: string[]): Promise<void> {
  const apiMode = args.includes('--api');
  const { accepted, inputPath } = apiMode
    ? await addFromApi(config, args)
    : await addFromFile(config, args);

  if (accepted.length === 0) {
    process.exit(1);
  }

  mergeAndVerify(config, accepted);
  if (inputPath) {
    writeFileSync(inputPath, '{ "questions": [] }\n');
  }

  const touchedTopics = [...new Set(accepted.map((a) => a.topicId))];
  for (const t of touchedTopics) {
    const groups = new Map<string, number>();
    for (const a of accepted.filter((a) => a.topicId === t)) {
      const k = `${a.type}:${a.difficulty}`;
      groups.set(k, (groups.get(k) ?? 0) + 1);
    }
    for (const [k] of groups) {
      const [type, difficulty] = k.split(':');
      const total = loadApproved(config, t).filter(
        (q) => q.type === type && q.difficulty === difficulty,
      ).length;
      console.log(`${t}:${type}:${difficulty}: ${total} domande in banca`);
    }
  }
  console.log('Test: ok');
  for (const t of touchedTopics) {
    console.log(`Per una rilettura del contenuto: chiedi a Devin "rivedi le domande di ${t}"`);
  }
}
