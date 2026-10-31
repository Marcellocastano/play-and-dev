import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SubjectContentConfig } from './config.js';

export const aiTemplatesDir = (config: SubjectContentConfig) =>
  join(config.pkgRoot, 'src', 'templates', 'ai');
export const aiIndexPath = (config: SubjectContentConfig) =>
  join(aiTemplatesDir(config), 'index.ts');
export const aiCandidatePath = (config: SubjectContentConfig) =>
  join(aiTemplatesDir(config), '_candidate.ts');

export function listTsTemplateFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('_'))
    .sort();
}
export function listAiTemplateFiles(config: SubjectContentConfig): string[] {
  return listTsTemplateFiles(aiTemplatesDir(config));
}

export function renderAiTemplatesIndex(files: readonly string[]): string {
  const names = files
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('_'))
    .sort();
  const ident = (f: string) =>
    f
      .replace(/\.ts$/, '')
      .replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
      .replace(/^([0-9])/, '_$1');
  const imports = names.map(
    (f) => `import * as ${ident(f)} from './${f.replace(/\.ts$/, '.js')}';`,
  );
  const prefix = 'export const aiTemplates: QuestionTemplate[] = ';
  const inline = `[${names.map((f) => `...${ident(f)}.templates`).join(', ')}]`;
  const body =
    `${prefix}${inline};`.length <= 100
      ? inline
      : `[\n${names.map((f) => `  ...${ident(f)}.templates,`).join('\n')}\n]`;
  return `// GENERATO dagli script content:* (content:template): un import per ogni file in questa cartella.
import type { QuestionTemplate } from '@lg/core';
${imports.length ? imports.join('\n') + '\n' : ''}
${prefix}${body};
`;
}

export function saveAiIndex(config: SubjectContentConfig): void {
  mkdirSync(aiTemplatesDir(config), { recursive: true });
  writeFileSync(aiIndexPath(config), renderAiTemplatesIndex(listAiTemplateFiles(config)));
}

export function prettierRejectReason(err: unknown, rawCode: string): string {
  const e = err as {
    message?: string;
    loc?: { start?: { line?: number; column?: number } };
  };
  const msg = (e.message ?? String(err)).split('\n')[0]!;
  let line = e.loc?.start?.line;
  if (line === undefined) {
    const m = /\((\d+):\d+\)/.exec(msg);
    if (m) line = Number(m[1]);
  }
  const text = line !== undefined ? rawCode.split('\n')[line - 1]?.trim().slice(0, 160) : undefined;
  return `prettier: ${msg}${text ? ` → ${text}` : ''}`;
}
