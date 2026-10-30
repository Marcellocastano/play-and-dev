import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { javascriptSubject } from '../src/index.js';
import { loadApproved, loadDrafts, pkgRoot } from './bankIO.js';

export interface PromptRequest {
  topicId: string;
  type: string;
  difficulty: string;
  count: number;
}

export function buildPrompts({ topicId, type, difficulty, count }: PromptRequest): {
  system: string;
  user: string;
} {
  const topic = javascriptSubject.topics.find((t) => t.id === topicId);
  if (!topic) throw new Error(`topic sconosciuto: ${topicId}`);

  const system = readFileSync(join(pkgRoot, 'scripts', 'author.prompt.md'), 'utf8');

  const existing = [
    ...loadApproved(topicId),
    ...loadDrafts(topicId).flatMap((d) => d.file.questions),
  ];
  const existingPrompts = existing.map((q) => `- ${q.prompt}`).join('\n');

  const lines = [
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
    `Genera ${count} domande di tipo "${type}" e difficoltà "${difficulty}", distribuite sui subtopic.`,
  ];
  if (existingPrompts) {
    lines.push(
      '',
      'Prompt già presenti in banca o in bozza — NON ripeterli né riproporre varianti banali:',
      existingPrompts,
    );
  }
  return { system, user: lines.join('\n') };
}
