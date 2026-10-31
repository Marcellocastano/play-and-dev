import { describe, expect, it } from 'vitest';
import type { SubjectDefinition } from '@lg/core';
import { allocateIds, buildPrompts } from '../src/index.js';

const subject: SubjectDefinition = {
  id: 'test',
  name: 'Test',
  kind: 'language',
  description: 'd',
  icon: 'T',
  theme: {
    primary: '',
    secondary: '',
    background: '',
    surface: '',
    accent: '',
    text: '',
    success: '',
    danger: '',
    gradients: { hero: '', card: '', progress: '' },
  },
  status: 'available',
  levels: [],
  topics: [
    {
      id: 'json',
      subjectId: 'test',
      levelId: 'beginner',
      name: 'JSON',
      overview: 'Panoramica',
      subtopics: [{ id: 'json-parse', name: 'parse' }],
      learningObjectives: ['obiettivo'],
      commonMistakes: ['errore'],
      examples: ['esempio'],
      prerequisites: [],
    },
  ],
  templates: [],
  learningObjectives: [],
};

describe('allocateIds', () => {
  it('continua dal massimo id esistente del topic', () => {
    const next = allocateIds('json', 'match', ['json-po-0003', 'json-mt-0007', 'other-zz-0099']);
    expect(next()).toBe('json-mt-0008');
    expect(next()).toBe('json-mt-0009');
  });

  it('parte da 0001 senza id esistenti', () => {
    expect(allocateIds('json', 'true-false', [])()).toBe('json-tf-0001');
  });
});

describe('buildPrompts', () => {
  it('elenca i prompt esistenti da non ripetere', () => {
    const { system, user } = buildPrompts({
      subject,
      system: 'SYSTEM',
      topicId: 'json',
      type: 'match',
      difficulty: 'easy',
      count: 3,
      existingPrompts: ['prompt uno', 'prompt due'],
    });
    expect(system).toBe('SYSTEM');
    expect(user).toContain('Genera 3 domande di tipo "match" e difficoltà "easy"');
    expect(user).toContain('- prompt uno');
    expect(user).toContain('- prompt due');
  });

  it('lancia su topic sconosciuto', () => {
    expect(() =>
      buildPrompts({
        subject,
        system: 'SYSTEM',
        topicId: 'nope',
        type: 'match',
        difficulty: 'easy',
        count: 1,
      }),
    ).toThrow('topic sconosciuto: nope');
  });
});
