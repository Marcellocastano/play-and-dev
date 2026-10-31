import { describe, expect, it } from 'vitest';
import {
  composeSession,
  GAME_QUESTION_TYPES,
  PHASE1_QUESTION_TYPES,
  normalizeOutput,
} from '@lg/core';
import { describeSubjectContent } from '@lg/subject-kit/testing';
import { deepDives, javascriptSubject } from '../src/index.js';
import { javascriptRunner } from '../src/runner/index.js';
import { COMPARISON_FACTS } from '../src/templates/comparisons/index.js';
import { TYPEOF_ROWS } from '../src/templates/primitive-types/index.js';
import { STRING_CALLS } from '../src/templates/strings/index.js';
import { contentDir } from './helpers.js';

describeSubjectContent({
  subject: javascriptSubject,
  runner: javascriptRunner,
  deepDiveIds: new Set(deepDives.map((d) => d.id)),
  bankContentDir: contentDir,
});

describe('counts', () => {
  it('has at least 60 beginner templates', () => {
    const beginnerTopicIds = new Set(
      javascriptSubject.levels.find((l) => l.id === 'beginner')!.topicIds,
    );
    const count = javascriptSubject.templates.filter((t) => beginnerTopicIds.has(t.topicId)).length;
    expect(count).toBeGreaterThanOrEqual(60);
  });

  it('has at least 8 templates per question type', () => {
    const counts = new Map<string, number>();
    for (const t of javascriptSubject.templates) {
      counts.set(t.type, (counts.get(t.type) ?? 0) + 1);
    }
    for (const def of PHASE1_QUESTION_TYPES) {
      expect(counts.get(def.id) ?? 0, `type ${def.id}`).toBeGreaterThanOrEqual(8);
    }
  });

  it('deepDive refs cover every beginner topic', () => {
    const ddTopicIds = new Set(deepDives.map((d) => d.topicId));
    for (const t of javascriptSubject.topics) {
      expect(ddTopicIds.has(t.id), `missing deep dive for ${t.id}`).toBe(true);
    }
  });
});

describe('composeSession mix', () => {
  it('beginner session has the 12/6/2 mix and no repeated generative template', () => {
    const s = composeSession({
      subject: javascriptSubject,
      levelId: 'beginner',
      mode: 'training',
      seed: 7,
    });
    const by = { easy: 0, medium: 0, hard: 0 };
    for (const q of s.questions) by[q.difficulty]++;
    expect(by).toEqual({ easy: 12, medium: 6, hard: 2 });
    const generative = s.questions.filter((q) => !q.templateId.startsWith('bank-'));
    const templateIds = generative.map((q) => q.templateId);
    expect(new Set(templateIds).size).toBe(templateIds.length);
  });
});

describe('game formats', () => {
  it('every game question type has at least one template', () => {
    for (const def of GAME_QUESTION_TYPES) {
      expect(
        javascriptSubject.templates.some((t) => t.type === def.id),
        `missing template for ${def.id}`,
      ).toBe(true);
    }
  });

  it('comparison facts evaluate to the declared value', async () => {
    for (const f of COMPARISON_FACTS) {
      expect(await javascriptRunner.run(`console.log(${f.expr})`), f.expr).toBe(String(f.value));
    }
  });

  it('typeof rows evaluate to the declared result', async () => {
    for (const r of TYPEOF_ROWS) {
      expect(await javascriptRunner.run(`console.log(${r.expr})`), r.expr).toBe(r.result);
    }
  });

  it('string calls evaluate to the declared result', async () => {
    for (const r of STRING_CALLS) {
      const actual = await javascriptRunner.run(`console.log(JSON.stringify(${r.expr}))`);
      expect(normalizeOutput(actual), r.expr).toBe(normalizeOutput(r.result));
    }
  });
});
