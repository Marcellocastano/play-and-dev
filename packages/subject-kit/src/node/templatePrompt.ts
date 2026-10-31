import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { kitRoot } from './bankIO.js';
import type { SubjectContentConfig } from './config.js';

export interface TemplatePromptRequest {
  topicId: string;
  type: string;
  difficulty: string;
}

const templatesDir = (config: SubjectContentConfig) => join(config.pkgRoot, 'src', 'templates');

function readSource(path: string): string | undefined {
  return existsSync(path) ? readFileSync(path, 'utf8').trimEnd() : undefined;
}

function smallestExampleWithType(
  config: SubjectContentConfig,
  topicId: string,
  type: string,
): { name: string; src: string } | undefined {
  const dir = templatesDir(config);
  if (!existsSync(dir)) return undefined;
  let best: { name: string; src: string; size: number } | undefined;
  for (const name of readdirSync(dir).sort()) {
    if (name === topicId || name === 'ai' || name === 'helpers.ts') continue;
    const path = join(dir, name, 'index.ts');
    if (!existsSync(path)) continue;
    const src = readFileSync(path, 'utf8');
    if (!src.includes(`type: '${type}'`)) continue;
    const size = statSync(path).size;
    if (!best || size < best.size) best = { name, src: src.trimEnd(), size };
  }
  return best;
}

export function buildTemplatePrompts(
  config: SubjectContentConfig,
  req: TemplatePromptRequest,
): { system: string; user: string } {
  const topic = config.subject.topics.find((t) => t.id === req.topicId);
  if (!topic) throw new Error(`topic sconosciuto: ${req.topicId}`);
  const tpl = config.template;
  if (!tpl) throw new Error('questo subject non ha authoring di template');

  const existing = config.subject.templates.filter(
    (t) => t.topicId === req.topicId && !t.id.startsWith('bank-'),
  );
  const ownSource = readSource(join(templatesDir(config), req.topicId, 'index.ts'));
  const other = smallestExampleWithType(config, req.topicId, req.type);
  const guide = config.contentGuidePath ? readSource(config.contentGuidePath) : undefined;
  const dslSource = readFileSync(join(kitRoot, 'src', 'dsl.ts'), 'utf8').trimEnd();
  const helpers = readFileSync(tpl.helpersPath, 'utf8').trimEnd();

  const lines = [
    `Richiesta: un template generativo per il topic "${req.topicId}", tipo "${req.type}", difficoltà "${req.difficulty}".`,
    '',
    `Topic: ${topic.name} (${topic.id})`,
    `Overview: ${topic.overview}`,
    '',
    'Subtopic:',
    ...topic.subtopics.map((s) => `- ${s.id}: ${s.name}${s.overview ? ` — ${s.overview}` : ''}`),
    '',
    'Obiettivi di apprendimento:',
    ...topic.learningObjectives.map((o) => `- ${o}`),
    '',
    'Errori comuni degli studenti:',
    ...topic.commonMistakes.map((m) => `- ${m}`),
    '',
    'Esempi:',
    ...topic.examples.map((e) => `- ${e}`),
    '',
    'DSL generico — @lg/subject-kit (src/dsl.ts):',
    '```ts',
    dslSource,
    '```',
    '',
    `Helper specifici del subject — ${tpl.helpersPath}:`,
    '```ts',
    helpers,
    '```',
    '',
    `Template già esistenti per ${req.topicId} (id e concetti da non ripetere):`,
    ...(existing.length
      ? existing.map((t) => `- ${t.id} [${t.type}/${t.difficulty}] subtopic ${t.subtopicId}`)
      : ['- (nessuno)']),
  ];
  if (ownSource) {
    lines.push(
      '',
      `Esempio di template del topic — src/templates/${req.topicId}/index.ts:`,
      '```ts',
      ownSource,
      '```',
    );
  }
  if (other) {
    lines.push(
      '',
      `Altro esempio con un template "${req.type}" — src/templates/${other.name}/index.ts:`,
      '```ts',
      other.src,
      '```',
    );
  }
  if (guide) lines.push('', 'Regole di contenuto — CONTENT_GUIDE.md:', guide);
  lines.push('', 'Scrivi 1 template.');
  return { system: readFileSync(tpl.systemPromptPath, 'utf8'), user: lines.join('\n') };
}

export function correctionMessage(code: string, reasons: string[]): string {
  const numbered = code
    .split('\n')
    .map((l, i) => `${String(i + 1).padStart(4)}| ${l}`)
    .join('\n');
  return [
    'Il file è stato scartato dai controlli automatici.',
    '',
    'File precedente (con numeri di riga):',
    '```ts',
    numbered,
    '```',
    '',
    'Errori:',
    ...reasons.map((r) => `- ${r}`),
    '',
    'Correggi il file e restituiscilo intero SENZA numeri di riga, nello stesso formato JSON.',
  ].join('\n');
}
