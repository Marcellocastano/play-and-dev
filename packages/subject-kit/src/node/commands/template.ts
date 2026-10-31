import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ESLint } from 'eslint';
import { format, resolveConfig } from 'prettier';
import { config as loadEnv } from 'dotenv';
import {
  generateQuestion,
  questionTypeRegistry,
  type Difficulty,
  type QuestionTemplate,
} from '@lg/core';
import {
  checkTemplate,
  extractJson,
  openAIChatMessages,
  type ChatMessage,
} from '@lg/content-pipeline';
import { pkgRel, repoRootOf } from '../bankIO.js';
import { buildTemplatePrompts, correctionMessage } from '../templatePrompt.js';
import { printQuestion } from '../printQuestion.js';
import {
  aiCandidatePath,
  aiIndexPath,
  aiTemplatesDir,
  prettierRejectReason,
  saveAiIndex,
} from '../templateIO.js';
import type { SubjectContentConfig } from '../config.js';

const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const ALLOWED_IMPORTS = new Set(['../helpers.js', '@lg/core', '@lg/subject-kit']);
const BANNED: [RegExp, string][] = [
  [/\beval\b/, 'eval'],
  [/new Function/, 'new Function'],
  [/\brequire\s*\(/, 'require('],
  [/\bimport\s*\(/, 'import('],
  [/\bprocess\./, 'process.'],
  [/\bnode:/, 'node:'],
];

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

function extractCode(text: string): string {
  try {
    const parsed = extractJson(text);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const code = (parsed as { code?: unknown }).code;
      if (typeof code === 'string') return code;
    }
  } catch {
    // non è JSON: prova a togliere il fence
  }
  const fence = /```(?:ts|typescript)?\s*\n([\s\S]*?)```/.exec(text);
  return (fence ? fence[1]! : text).trim();
}

function staticReasons(code: string): string[] {
  const reasons: string[] = [];
  for (const [re, label] of BANNED) {
    if (re.test(code)) reasons.push(`codice vietato: ${label}`);
  }
  const importRe = /import[^'"]*from\s+['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(code))) {
    const spec = m[1] ?? m[2];
    if (spec && !ALLOWED_IMPORTS.has(spec)) reasons.push(`import non consentito: ${spec}`);
  }
  return reasons;
}

type LineContext = (line?: number) => string;
interface Req {
  topicId: string;
  type: string;
  difficulty: Difficulty;
}

function typecheckReasons(config: SubjectContentConfig, lineAt: LineContext): string[] {
  const tsc = spawnSync('npx', ['tsc', '--noEmit', '-p', join(config.pkgRoot, 'tsconfig.json')], {
    cwd: repoRootOf(config),
    encoding: 'utf8',
  });
  if (tsc.status === 0) return [];
  const out = `${tsc.stdout ?? ''}\n${tsc.stderr ?? ''}`;
  return out
    .split('\n')
    .filter((l) => l.includes('ai/_candidate.ts'))
    .map((l) => `tsc: ${l.trim()}${lineAt(Number(/\((\d+),\d+\)/.exec(l)?.[1]))}`);
}

async function eslintReasons(config: SubjectContentConfig, lineAt: LineContext): Promise<string[]> {
  const eslint = new ESLint({ cwd: repoRootOf(config) });
  const reasons: string[] = [];
  for (const result of await eslint.lintFiles([aiCandidatePath(config)])) {
    for (const msg of result.messages) {
      if (msg.severity !== 2) continue;
      reasons.push(
        `eslint ${msg.line}:${msg.column} ${msg.ruleId}: ${msg.message}${lineAt(msg.line)}`,
      );
    }
  }
  return reasons;
}

interface CandidateResult {
  reasons: string[];
  accepted: QuestionTemplate[];
  code: string;
}

async function validateCandidate(
  config: SubjectContentConfig,
  req: Req,
  rawCode: string,
): Promise<CandidateResult> {
  const candidatePath = aiCandidatePath(config);
  const prettierConfig = await resolveConfig(candidatePath);
  let code: string;
  try {
    code = await format(rawCode, { ...prettierConfig, filepath: candidatePath });
  } catch (err) {
    return { reasons: [prettierRejectReason(err, rawCode)], accepted: [], code: rawCode };
  }
  const srcLines = code.split('\n');
  const lineAt: LineContext = (line) => {
    if (!line) return '';
    const text = srcLines[line - 1]?.trim().slice(0, 160);
    return text ? ` → ${text}` : '';
  };

  writeFileSync(candidatePath, code);
  const reasons = staticReasons(code);
  if (reasons.length) return { reasons, accepted: [], code };

  let templates: unknown;
  try {
    const mod = (await import(`${pathToFileURL(candidatePath).href}?v=${Date.now()}`)) as {
      templates?: unknown;
    };
    templates = mod.templates;
  } catch (err) {
    return {
      reasons: [`import fallito: ${(err as Error).message.split('\n')[0]}`],
      accepted: [],
      code,
    };
  }
  if (!Array.isArray(templates) || templates.length === 0) {
    return {
      reasons: ['il file non esporta un array `templates` non vuoto'],
      accepted: [],
      code,
    };
  }

  const usedIds = new Set(config.subject.templates.map((t) => t.id));
  for (const t of templates as QuestionTemplate[]) {
    if (t.topicId !== req.topicId)
      reasons.push(`${t.id}: topicId "${t.topicId}" ≠ richiesto "${req.topicId}"`);
    if (t.type !== req.type) reasons.push(`${t.id}: type "${t.type}" ≠ richiesto "${req.type}"`);
    if (t.difficulty !== req.difficulty)
      reasons.push(`${t.id}: difficulty "${t.difficulty}" ≠ richiesta "${req.difficulty}"`);
    if (usedIds.has(t.id)) reasons.push(`${t.id}: id già usato da un template esistente`);
    for (const r of await checkTemplate(t, {
      subject: config.subject,
      runner: config.runner,
      ...(req.type === 'predict-output' || req.type === 'fill-the-gap'
        ? { minDistinctAnswers: 3 }
        : {}),
    })) {
      reasons.push(`${t.id}: ${r}`);
    }
  }
  reasons.push(...typecheckReasons(config, lineAt));
  reasons.push(...(await eslintReasons(config, lineAt)));
  const unique = [...new Set(reasons)];
  return {
    reasons: unique,
    accepted: unique.length ? [] : (templates as QuestionTemplate[]),
    code,
  };
}

export async function runTemplate(config: SubjectContentConfig, args: string[]): Promise<void> {
  if (!config.template) {
    console.error(`il subject "${config.subject.id}" non ha authoring di template`);
    process.exit(1);
  }
  const topicId = required(args, 'topic');
  const type = required(args, 'type');
  const difficulty = required(args, 'difficulty') as Difficulty;
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
  const req: Req = { topicId, type, difficulty };

  const printPrompt = args.includes('--print-prompt');
  const fromFile = arg(args, 'from');
  if (args.includes('--from') && !fromFile) {
    console.error('manca il valore di --from <file>');
    process.exit(1);
  }
  if (printPrompt && fromFile) {
    console.error('usa uno solo tra --print-prompt e --from');
    process.exit(1);
  }

  const prompts = buildTemplatePrompts(config, req);
  if (printPrompt) {
    console.log(prompts.system);
    console.log('---');
    console.log(prompts.user);
    return;
  }

  const rounds = Number(arg(args, 'rounds') ?? '3');
  let accepted: QuestionTemplate[] = [];
  let lastReasons: string[] = [];

  if (fromFile) {
    if (!existsSync(fromFile)) {
      console.error(`file non trovato: ${fromFile}`);
      process.exit(1);
    }
    const result = await validateCandidate(
      config,
      req,
      extractCode(readFileSync(fromFile, 'utf8')),
    );
    lastReasons = result.reasons;
    accepted = result.accepted;
  } else {
    loadEnv({ path: join(repoRootOf(config), 'apps', 'server', '.env') });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY mancante: configura apps/server/.env');
      process.exit(1);
    }
    const chat = openAIChatMessages(apiKey, arg(args, 'model') ?? 'gpt-4.1', 0.4);
    const messages: ChatMessage[] = [
      { role: 'system', content: prompts.system },
      { role: 'user', content: prompts.user },
    ];
    for (let round = 1; round <= rounds; round++) {
      const reply = await chat(messages);
      const result = await validateCandidate(config, req, extractCode(reply));
      if (result.reasons.length === 0) {
        accepted = result.accepted;
        break;
      }
      lastReasons = result.reasons;
      console.error(`round ${round}/${rounds}: ${result.reasons.length} errori`);
      messages.push({ role: 'assistant', content: reply });
      messages.push({ role: 'user', content: correctionMessage(result.code, result.reasons) });
    }
  }

  const candidatePath = aiCandidatePath(config);
  try {
    if (accepted.length === 0) {
      console.error('\nTemplate scartato:');
      for (const r of lastReasons) console.error(`  ✗ ${r}`);
      process.exitCode = 1;
      return;
    }
    const first = accepted[0]!;
    const destPath = join(aiTemplatesDir(config), `${req.topicId}-${first.id}.ts`);
    renameSync(candidatePath, destPath);
    const prevIndex = readFileSync(aiIndexPath(config), 'utf8');
    saveAiIndex(config);
    const test = spawnSync('npx', ['vitest', 'run', pkgRel(config)], {
      cwd: repoRootOf(config),
      encoding: 'utf8',
    });
    const tsc = spawnSync('npx', ['tsc', '-b', pkgRel(config)], {
      cwd: repoRootOf(config),
      encoding: 'utf8',
    });
    if (test.status !== 0 || tsc.status !== 0) {
      rmSync(destPath);
      writeFileSync(aiIndexPath(config), prevIndex);
      console.error('\nTemplate annullato: test o typecheck falliti dopo la scrittura.');
      console.error(
        `${test.stdout ?? ''}${test.stderr ?? ''}${tsc.stdout ?? ''}${tsc.stderr ?? ''}`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(`\nTemplate accettato: ${req.topicId}-${first.id}.ts`);
    for (const seed of [1, 2, 3]) {
      printQuestion(generateQuestion(first, seed), true);
    }
    console.log(
      '\nRevisione umana obbligatoria prima del commit: leggi il file e le varianti qui sopra.',
    );
  } finally {
    if (existsSync(candidatePath)) rmSync(candidatePath);
  }
}
