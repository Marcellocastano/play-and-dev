import { describe, expect, it } from 'vitest';
import {
  composeSession,
  GAME_QUESTION_TYPES,
  generateQuestion,
  MAX_SIMILAR_PER_SESSION,
  normalizeOutput,
  similarityKey,
  PHASE1_QUESTION_TYPES,
  qualityIssues,
  questionTypeRegistry,
  validateQuestion,
  type Question,
} from '@lg/core';
import { deepDives, getDeepDive, javascriptSubject } from '../src/index.js';
import {
  bankQuestions,
  bankTemplates,
  buildBankTemplates,
  MIN_BANK_SIZE,
} from '../src/bank/index.js';
import { COMPARISON_FACTS } from '../src/templates/comparisons/index.js';
import { TYPEOF_ROWS } from '../src/templates/primitive-types/index.js';
import { STRING_CALLS } from '../src/templates/strings/index.js';
import { runCode } from '../scripts/runCode.js';
import {
  contentDir,
  contentIndexPath,
  listContentFiles,
  readBankFile,
  renderContentIndex,
} from '../scripts/bankIO.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SEEDS = Array.from({ length: 25 }, (_, i) => i * 97 + 13);

const topicIds = new Set(javascriptSubject.topics.map((t) => t.id));
const subtopicIds = new Set(javascriptSubject.topics.flatMap((t) => t.subtopics.map((s) => s.id)));

function correctText(q: Question): string {
  if (q.format === 'text') return q.accepted[0]!;
  if (q.format !== 'choice') throw new Error(`unexpected format ${q.format} in ${q.id}`);
  const opt = q.options.find((o) => o.id === q.correctOptionId);
  if (!opt) throw new Error(`no correct option in ${q.id}`);
  return opt.text;
}

describe('template validity (25 seeds each)', () => {
  for (const template of javascriptSubject.templates) {
    it(`${template.id} produces valid questions`, () => {
      const variantKeys = new Set<string>();
      for (const seed of SEEDS) {
        const q = generateQuestion(template, seed);
        const result = validateQuestion(q);
        expect(result.errors, `${template.id} seed ${seed}: ${result.errors.join('; ')}`).toEqual(
          [],
        );
        const quality = qualityIssues(q);
        expect(quality, `${template.id} seed ${seed}: ${quality.join('; ')}`).toEqual([]);
        expect(result.ok).toBe(true);
        expect(questionTypeRegistry.has(q.type)).toBe(true);
        expect(topicIds.has(q.topicId)).toBe(true);
        expect(subtopicIds.has(q.subtopicId)).toBe(true);
        if (q.deepDiveRef) expect(getDeepDive(q.deepDiveRef)).toBeDefined();
        variantKeys.add(q.variantKey);
      }
      expect(variantKeys.size, `${template.id}: varietà insufficiente`).toBeGreaterThanOrEqual(5);
    });
  }
});

describe('every bank question (also inactive groups)', () => {
  const smallSeeds = SEEDS.slice(0, 5);
  for (const bq of bankQuestions) {
    it(`${bq.id} produces valid questions`, () => {
      const [template] = buildBankTemplates([bq], 1);
      expect(template, `no template for ${bq.id}`).toBeDefined();
      for (const seed of smallSeeds) {
        const q = generateQuestion(template!, seed);
        const result = validateQuestion(q);
        expect(result.errors, `${bq.id} seed ${seed}: ${result.errors.join('; ')}`).toEqual([]);
        const quality = qualityIssues(q);
        expect(quality, `${bq.id} seed ${seed}: ${quality.join('; ')}`).toEqual([]);
        expect(questionTypeRegistry.has(q.type)).toBe(true);
        expect(topicIds.has(q.topicId)).toBe(true);
        expect(subtopicIds.has(q.subtopicId)).toBe(true);
        if (q.type === 'predict-output' && q.format === 'choice') {
          const actual = runCode(q.code!);
          expect(
            actual,
            `${bq.id} seed ${seed}: codice stampa "${actual.replace(/\n/g, '|')}", risposta dichiarata "${correctText(q).replace(/\n/g, '|')}"`,
          ).toBe(correctText(q));
        }
      }
    });
  }
});

describe('predict-output execution check', () => {
  const poTemplates = javascriptSubject.templates.filter((t) => t.type === 'predict-output');
  for (const template of poTemplates) {
    it(`${template.id}: executed output matches the declared answer`, () => {
      for (const seed of SEEDS) {
        const q = generateQuestion(template, seed);
        expect(q.code, `${template.id} missing code`).toBeTruthy();
        const actual = runCode(q.code!);
        expect(
          actual,
          `${template.id} seed ${seed}: codice stampa "${actual.replace(/\n/g, '|')}", risposta dichiarata "${correctText(q).replace(/\n/g, '|')}"`,
        ).toBe(correctText(q));
      }
    });
  }
});

describe('counts', () => {
  it('has at least 60 beginner templates', () => {
    const beginnerTopicIds = new Set(
      javascriptSubject.levels.find((l) => l.id === 'beginner')!.topicIds,
    );
    const beginnerTemplates = javascriptSubject.templates.filter((t) =>
      beginnerTopicIds.has(t.topicId),
    );
    expect(beginnerTemplates.length).toBeGreaterThanOrEqual(60);
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

describe('curated bank', () => {
  it('content/index.ts imports every JSON file in the bank folder', () => {
    const files = listContentFiles();
    expect(readFileSync(contentIndexPath, 'utf8')).toBe(renderContentIndex(files));
    const ids = new Set(bankQuestions.map((q) => q.id));
    for (const f of files) {
      for (const q of readBankFile(join(contentDir, f)).questions) {
        expect(ids.has(q.id), `${f}: ${q.id} not loaded at runtime`).toBe(true);
      }
    }
  });

  it('every bank template is backed by at least MIN_BANK_SIZE questions', () => {
    const groups = new Map<string, number>();
    for (const q of bankQuestions) {
      const key = `${q.topicId}:${q.type}:${q.difficulty}`;
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    for (const t of bankTemplates) {
      const key = `${t.topicId}:${t.type}:${t.difficulty}`;
      expect(
        groups.get(key) ?? 0,
        `bank group ${key} has fewer than ${MIN_BANK_SIZE} questions`,
      ).toBeGreaterThanOrEqual(MIN_BANK_SIZE);
    }
  });
});

describe('composeSession with real content', () => {
  for (const levelId of ['beginner', 'intermediate', 'advanced'] as const) {
    it(`composes a valid 20-question ${levelId} session`, () => {
      const s = composeSession({
        subject: javascriptSubject,
        levelId,
        mode: 'training',
        seed: 42,
      });
      expect(s.questions).toHaveLength(20);
      for (const q of s.questions) {
        expect(validateQuestion(q).ok).toBe(true);
      }
      expect(new Set(s.questions.map((q) => q.variantKey)).size).toBe(20);
    });
  }

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

  for (const levelId of ['beginner', 'intermediate'] as const) {
    it(`${levelId} sessions respect the similarity cap across seeds`, () => {
      for (const seed of SEEDS) {
        const s = composeSession({ subject: javascriptSubject, levelId, mode: 'training', seed });
        const counts = new Map<string, number>();
        for (const q of s.questions) {
          counts.set(similarityKey(q), (counts.get(similarityKey(q)) ?? 0) + 1);
        }
        for (const [key, n] of counts) {
          expect(n, `${levelId} seed ${seed}: ${key}`).toBeLessThanOrEqual(MAX_SIMILAR_PER_SESSION);
        }
      }
    });
  }
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

  it('comparison facts evaluate to the declared value', () => {
    for (const f of COMPARISON_FACTS) {
      expect(runCode(`console.log(${f.expr})`), f.expr).toBe(String(f.value));
    }
  });

  it('typeof rows evaluate to the declared result', () => {
    for (const r of TYPEOF_ROWS) {
      expect(runCode(`console.log(${r.expr})`), r.expr).toBe(r.result);
    }
  });

  it('string calls evaluate to the declared result', () => {
    for (const r of STRING_CALLS) {
      const actual = runCode(`console.log(JSON.stringify(${r.expr}))`);
      expect(normalizeOutput(actual), r.expr).toBe(normalizeOutput(r.result));
    }
  });
});
