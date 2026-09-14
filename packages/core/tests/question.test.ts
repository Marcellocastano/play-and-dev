import { describe, expect, it } from 'vitest';
import {
  generateQuestion,
  questionTypeRegistry,
  seededRandom,
  uniqueDistractors,
  validateQuestion,
} from '../src/index.js';
import { makeSubject, makeTemplate } from './fixtures.js';

const subject = makeSubject({ topics: 2, easy: 4, medium: 0, hard: 0 });
const template = subject.templates[0]!;

describe('generateQuestion', () => {
  it('is deterministic for the same seed', () => {
    const a = generateQuestion(template, 42);
    const b = generateQuestion(template, 42);
    expect(a.variantKey).toBe(b.variantKey);
    expect(a).toEqual(b);
  });

  it('produces different variantKeys for different seeds', () => {
    const keys = new Set(
      Array.from({ length: 20 }, (_, i) => generateQuestion(template, i).variantKey),
    );
    expect(keys.size).toBeGreaterThan(1);
  });

  it('assigns id and templateId', () => {
    const q = generateQuestion(template, 1);
    expect(q.id).toBeTruthy();
    expect(q.templateId).toBe(template.id);
  });
});

describe('validateQuestion', () => {
  it('accepts a generated question', () => {
    expect(validateQuestion(generateQuestion(template, 7)).ok).toBe(true);
  });

  it('rejects when no option matches correctOptionId', () => {
    const q = { ...generateQuestion(template, 7), correctOptionId: 'nope' };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('correctOptionId');
  });

  it('rejects duplicate option texts', () => {
    const base = generateQuestion(template, 7);
    const q = {
      ...base,
      options: base.options.map((o, i) => (i === 1 ? { ...o, text: base.options[0]!.text } : o)),
    };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('distinct');
  });

  it('rejects empty options and wrong count', () => {
    const base = generateQuestion(template, 7);
    const r = validateQuestion({ ...base, options: base.options.slice(0, 3) });
    expect(r.ok).toBe(false);
    const r2 = validateQuestion({
      ...base,
      options: base.options.map((o, i) => (i === 2 ? { ...o, text: '  ' } : o)),
    });
    expect(r2.ok).toBe(false);
  });

  it('rejects missing whyOthersWrong entries', () => {
    const base = generateQuestion(template, 7);
    const q = {
      ...base,
      explanation: { ...base.explanation, whyOthersWrong: {} },
    };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('whyOthersWrong');
  });

  it('rejects missing code for types that require it', () => {
    const t = makeTemplate('code-t', 't0', 'easy', 'predict-output');
    const q = generateQuestion(t, 3);
    expect(validateQuestion(q).ok).toBe(true);
    const noCode = { ...q, code: undefined };
    const r = validateQuestion(noCode);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('requires code');
  });

  it('rejects unknown question types', () => {
    const q = { ...generateQuestion(template, 7), type: 'does-not-exist' };
    expect(validateQuestion(q).ok).toBe(false);
  });
});

describe('questionTypeRegistry', () => {
  it('has the 6 phase-1 types', () => {
    expect(questionTypeRegistry.list().map((t) => t.id).sort()).toEqual([
      'best-method',
      'compare',
      'fill-the-gap',
      'find-the-bug',
      'multiple-choice',
      'predict-output',
    ]);
  });
});

describe('uniqueDistractors', () => {
  it('filters duplicates and the correct value', () => {
    const rng = seededRandom(1);
    void rng;
    expect(uniqueDistractors('a', ['a', 'b', 'b', 'c', 'd'], 3)).toEqual(['b', 'c', 'd']);
  });

  it('throws when not enough distinct candidates', () => {
    expect(() => uniqueDistractors('a', ['a', 'b'], 3)).toThrow();
  });
});
