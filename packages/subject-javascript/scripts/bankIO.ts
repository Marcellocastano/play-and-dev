import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BankFile, BankQuestion } from '../src/bank/types.js';

export const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const repoRoot = join(pkgRoot, '..', '..');
export const contentDir = join(pkgRoot, 'src', 'bank', 'content');
export const draftsDir = join(pkgRoot, 'content', 'drafts');

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
  writeFileSync(contentIndexPath, renderContentIndex(listContentFiles()));
}

export const contentIndexPath = join(contentDir, 'index.ts');

export function listContentFiles(): string[] {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}

/** `src/bank/content/index.ts`: un import per ogni JSON della banca, rigenerato da saveApproved. */
export function renderContentIndex(files: string[]): string {
  const ident = (f: string) =>
    f
      .replace(/\.json$/, '')
      .replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
      .replace(/^([0-9])/, '_$1');
  const imports = files.map((f) => `import ${ident(f)} from './${f}';`).join('\n');
  const list = files.map((f) => `  ${ident(f)},`).join('\n');
  return `// GENERATO da scripts/bankIO.ts (saveApproved): un import per ogni JSON in questa cartella.
import type { BankFile, BankQuestion } from '../types.js';
${imports}

const files = [
${list}
] as unknown as BankFile[];

export const bankQuestions: BankQuestion[] = files.flatMap((f) => f.questions);
`;
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

export function resolveDraftPath(arg: string): string {
  const candidates = [resolve(arg), join(pkgRoot, arg), join(draftsDir, arg)];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(`file bozze non trovato: ${arg}`);
}
