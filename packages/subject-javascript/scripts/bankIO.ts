import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BankFile, BankQuestion } from '../src/bank/types.js';

export const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const repoRoot = join(pkgRoot, '..', '..');
export const contentDir = join(pkgRoot, 'content');
export const draftsDir = join(contentDir, 'drafts');
export const generatedPath = join(pkgRoot, 'src', 'bank', 'data.generated.ts');

export function approvedFilePath(topicId: string): string {
  return join(contentDir, `${topicId}.json`);
}

export function readBankFile(path: string): BankFile {
  return JSON.parse(readFileSync(path, 'utf8')) as BankFile;
}

export function loadApproved(topicId: string): BankQuestion[] {
  const path = approvedFilePath(topicId);
  return existsSync(path) ? readBankFile(path).questions : [];
}

export function saveApproved(topicId: string, questions: BankQuestion[]): void {
  mkdirSync(contentDir, { recursive: true });
  const file: BankFile = { topicId, questions };
  writeFileSync(approvedFilePath(topicId), JSON.stringify(file, null, 2) + '\n');
}

export function loadDrafts(
  topicId?: string,
  includeApproved = false,
): { path: string; file: BankFile }[] {
  const dirs = includeApproved ? [draftsDir, join(draftsDir, 'approved')] : [draftsDir];
  const out: { path: string; file: BankFile }[] = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.json') || (topicId && !f.startsWith(`${topicId}-`))) continue;
      const path = join(dir, f);
      out.push({ path, file: readBankFile(path) });
    }
  }
  return out;
}

export function writeDraft(topicId: string, questions: BankQuestion[]): string {
  mkdirSync(draftsDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const path = join(draftsDir, `${topicId}-${ts}.json`);
  const file: BankFile = { topicId, questions };
  writeFileSync(path, JSON.stringify(file, null, 2) + '\n');
  return path;
}

export function loadAllApproved(): BankQuestion[] {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => readBankFile(join(contentDir, f)).questions);
}

export function regenerateData(questions: BankQuestion[]): void {
  const body = `// GENERATED FILE — non modificare a mano: rigenerato da \`npm run content:approve\`.\nimport type { BankQuestion } from './types.js';\n\nexport const bankQuestions: BankQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
  writeFileSync(generatedPath, body);
}

export function resolveDraftPath(arg: string): string {
  const candidates = [resolve(arg), join(pkgRoot, arg), join(draftsDir, arg)];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(`file bozze non trovato: ${arg}`);
}
