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

  it('rejects missing why entries', () => {
    const base = generateQuestion(template, 7);
    const q = {
      ...base,
      explanation: { ...base.explanation, why: {} },
    };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('why');
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
  it('registers the 6 phase-1 types plus the 3 game formats', () => {
    expect(
      questionTypeRegistry
        .list()
        .map((t) => t.id)
        .sort(),
    ).toEqual([
      'best-method',
      'categorize',
      'compare',
      'fill-the-gap',
      'find-the-bug',
      'match',
      'multiple-choice',
      'predict-output',
      'true-false',
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

describe('validateQuestion per format', () => {
  const shared = {
    id: 'q',
    templateId: 't',
    variantKey: 'v',
    type: 'categorize',
    difficulty: 'easy' as const,
    topicId: 't0',
    subtopicId: 's0',
    skills: [],
    prompt: 'D?',
    explanation: {
      short: 's',
      whyCorrect: 'w',
      why: { i1: 'x'.repeat(61), i2: 'x'.repeat(61), i3: 'x'.repeat(61), i4: 'x'.repeat(61) },
    },
  };

  it('accepts a valid categorize question', () => {
    const q = {
      ...shared,
      format: 'categorize' as const,
      categories: [
        { id: 'c1', text: 'Muta' },
        { id: 'c2', text: 'Non muta' },
      ],
      items: [
        { id: 'i1', text: 'push', categoryId: 'c1' },
        { id: 'i2', text: 'pop', categoryId: 'c1' },
        { id: 'i3', text: 'map', categoryId: 'c2' },
        { id: 'i4', text: 'filter', categoryId: 'c2' },
      ],
    };
    expect(validateQuestion(q).ok).toBe(true);
  });

  it('rejects categorize with empty category or missing why', () => {
    const q = {
      ...shared,
      format: 'categorize' as const,
      categories: [
        { id: 'c1', text: 'Muta' },
        { id: 'c2', text: 'Vuota' },
      ],
      items: [
        { id: 'i1', text: 'push', categoryId: 'c1' },
        { id: 'i2', text: 'pop', categoryId: 'c1' },
        { id: 'i3', text: 'splice', categoryId: 'c1' },
        { id: 'i4', text: 'sort', categoryId: 'c1' },
      ],
      explanation: { ...shared.explanation, why: {} },
    };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('category c2 has no items');
    expect(r.errors.join()).toContain('why');
  });

  it('rejects match rows pointing at unknown choices', () => {
    const q = {
      ...shared,
      type: 'match',
      format: 'match' as const,
      choices: [
        { id: 'c1', text: 'numero' },
        { id: 'c2', text: 'stringa' },
      ],
      rows: [
        { id: 'r1', text: '42', choiceId: 'c1' },
        { id: 'r2', text: "'x'", choiceId: 'c2' },
        { id: 'r3', text: 'NaN', choiceId: 'zz' },
      ],
      explanation: {
        ...shared.explanation,
        why: { r1: 'w'.repeat(61), r2: 'w'.repeat(61), r3: 'w'.repeat(61) },
      },
    };
    const r = validateQuestion(q);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('unknown choice');
  });

  it('rejects true-false without both values and text with empty accepted', () => {
    const tf = {
      ...shared,
      type: 'true-false',
      format: 'true-false' as const,
      statements: [1, 2, 3, 4].map((i) => ({ id: `s${i}`, text: `aff ${i}`, value: true })),
      explanation: {
        ...shared.explanation,
        why: { s1: 'w'.repeat(61), s2: 'w'.repeat(61), s3: 'w'.repeat(61), s4: 'w'.repeat(61) },
      },
    };
    const r = validateQuestion(tf);
    expect(r.ok).toBe(false);
    expect(r.errors.join()).toContain('no false statement');
    const text = { ...shared, format: 'text' as const, accepted: [] };
    expect(validateQuestion(text).ok).toBe(false);
  });
});
