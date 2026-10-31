import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BankFile, BankQuestion } from '@lg/core';
import { renderContentIndex } from '@lg/content-pipeline';
import type { SubjectContentConfig } from './config.js';

export const kitRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function repoRootOf(config: SubjectContentConfig): string {
  return join(config.pkgRoot, '..', '..');
}
export function pkgRel(config: SubjectContentConfig): string {
  return join('packages', basename(config.pkgRoot));
}
export const contentDir = (config: SubjectContentConfig) =>
  join(config.pkgRoot, 'src', 'bank', 'content');
export const contentIndexPath = (config: SubjectContentConfig) =>
  join(contentDir(config), 'index.ts');
export function approvedFilePath(config: SubjectContentConfig, topicId: string): string {
  return join(contentDir(config), `${topicId}.json`);
}
export function readBankFile(path: string): BankFile {
  return JSON.parse(readFileSync(path, 'utf8')) as BankFile;
}
export function loadApproved(config: SubjectContentConfig, topicId: string): BankQuestion[] {
  const path = approvedFilePath(config, topicId);
  return existsSync(path) ? readBankFile(path).questions : [];
}
export function saveApproved(
  config: SubjectContentConfig,
  topicId: string,
  questions: BankQuestion[],
): void {
  mkdirSync(contentDir(config), { recursive: true });
  const file: BankFile = { topicId, questions };
  writeFileSync(approvedFilePath(config, topicId), JSON.stringify(file, null, 2) + '\n');
  writeFileSync(contentIndexPath(config), renderContentIndex(listContentFiles(config)));
}
export function listContentFiles(config: SubjectContentConfig): string[] {
  const dir = contentDir(config);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}
export function loadAllApproved(config: SubjectContentConfig): BankQuestion[] {
  const dir = contentDir(config);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => readBankFile(join(dir, f)).questions);
}
export function authorSystemPrompt(config: SubjectContentConfig): string {
  const base = readFileSync(join(kitRoot, 'prompts', 'author.base.md'), 'utf8');
  const rules = readFileSync(config.prompts.languageRules, 'utf8');
  const examples = readFileSync(config.prompts.examples, 'utf8');
  return base
    .replaceAll('{{language}}', config.language)
    .replace('{{languageRules}}', rules)
    .replace('{{examples}}', examples);
}
