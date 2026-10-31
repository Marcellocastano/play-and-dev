import type { SubjectDefinition } from '@lg/core';

export interface PromptRequest {
  subject: SubjectDefinition;
  /** Subject-specific authoring rules (system prompt). */
  system: string;
  topicId: string;
  type: string;
  difficulty: string;
  count: number;
  /** Prompts already in the bank, listed so the model does not repeat them. */
  existingPrompts?: readonly string[];
}

export function buildPrompts(req: PromptRequest): { system: string; user: string } {
  const topic = req.subject.topics.find((t) => t.id === req.topicId);
  if (!topic) throw new Error(`topic sconosciuto: ${req.topicId}`);

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
    `Genera ${req.count} domande di tipo "${req.type}" e difficoltà "${req.difficulty}", distribuite sui subtopic.`,
  ];
  if (req.existingPrompts?.length) {
    lines.push(
      '',
      'Prompt già presenti in banca o in bozza — NON ripeterli né riproporre varianti banali:',
      ...req.existingPrompts.map((p) => `- ${p}`),
    );
  }
  return { system: req.system, user: lines.join('\n') };
}
