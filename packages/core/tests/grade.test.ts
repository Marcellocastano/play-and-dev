import { describe, expect, it } from 'vitest';
import {
  computeVariantKey,
  generateQuestion,
  gradeAnswer,
  normalizeOutput,
  stableHash,
  toTextFormat,
  type Question,
} from '../src/index.js';
import { makeSubject } from './fixtures.js';

function base(over: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    templateId: 't1',
    variantKey: 'vk',
    type: 'multiple-choice',
    difficulty: 'easy',
    topicId: 'topic',
    subtopicId: 'sub',
    skills: [],
    prompt: 'Domanda?',
    explanation: { short: 's', whyCorrect: 'w', why: {} },
    format: 'choice',
    options: [
      { id: 'a', text: 'giusta' },
      { id: 'b', text: 'no1' },
      { id: 'c', text: 'no2' },
      { id: 'd', text: 'no3' },
    ],
    correctOptionId: 'a',
    ...over,
  } as Question;
}

describe('normalizeOutput', () => {
  it('normalizes spacing inside brackets', () => {
    expect(normalizeOutput('[ 1, 2 ]')).toBe(normalizeOutput('[1,2]'));
    expect(normalizeOutput('{ a: 1 }')).toBe(normalizeOutput('{a:1}'));
  });

  it('normalizes quotes and trailing newlines', () => {
    expect(normalizeOutput('"x"\n\n')).toBe("'x'");
    expect(normalizeOutput('a\r\nb')).toBe('a\nb');
  });

  it('is case-sensitive', () => {
    expect(normalizeOutput('Foo')).not.toBe(normalizeOutput('foo'));
  });
});

describe('gradeAnswer', () => {
  it('choice: 1 correct, 0 wrong', () => {
    const q = base();
    expect(gradeAnswer(q, { format: 'choice', optionId: 'a' })).toMatchObject({
      score: 1,
      correct: true,
    });
    expect(gradeAnswer(q, { format: 'choice', optionId: 'b' }).score).toBe(0);
  });

  it('categorize: partial credit per item', () => {
    const q = base({
      format: 'categorize',
      categories: [
        { id: 'c1', text: 'Muta' },
        { id: 'c2', text: 'Non muta' },
      ],
      items: [
        { id: 'i1', text: 'push', categoryId: 'c1' },
        { id: 'i2', text: 'map', categoryId: 'c2' },
        { id: 'i3', text: 'pop', categoryId: 'c1' },
        { id: 'i4', text: 'filter', categoryId: 'c2' },
      ],
    } as Partial<Question>);
    const r = gradeAnswer(q, {
      format: 'categorize',
      placement: { i1: 'c1', i2: 'c2', i3: 'c2', i4: 'c2' },
    });
    expect(r.score).toBe(0.75);
    expect(r.correct).toBe(false);
    expect(r.perItem).toEqual({ i1: true, i2: true, i3: false, i4: true });
  });

  it('match: partial credit per row', () => {
    const q = base({
      format: 'match',
      choices: [
        { id: 'c1', text: 'numero' },
        { id: 'c2', text: 'stringa' },
      ],
      rows: [
        { id: 'r1', text: '42', choiceId: 'c1' },
        { id: 'r2', text: "'x'", choiceId: 'c2' },
        { id: 'r3', text: 'NaN', choiceId: 'c1' },
      ],
    } as Partial<Question>);
    const r = gradeAnswer(q, {
      format: 'match',
      selection: { r1: 'c1', r2: 'c1', r3: 'c1' },
    });
    expect(r.score).toBeCloseTo(2 / 3);
    expect(r.perItem.r2).toBe(false);
  });

  it('true-false: perfect and zero', () => {
    const q = base({
      format: 'true-false',
      statements: [
        { id: 's1', text: 'a', value: true },
        { id: 's2', text: 'b', value: false },
        { id: 's3', text: 'c', value: true },
        { id: 's4', text: 'd', value: false },
      ],
    } as Partial<Question>);
    const all = gradeAnswer(q, {
      format: 'true-false',
      values: { s1: true, s2: false, s3: true, s4: false },
    });
    expect(all.correct).toBe(true);
    const none = gradeAnswer(q, {
      format: 'true-false',
      values: { s1: false, s2: true, s3: false, s4: true },
    });
    expect(none.score).toBe(0);
  });

  it('text: compares after normalizeOutput', () => {
    const q = base({ format: 'text', accepted: ['[ 1, 2 ]'] } as Partial<Question>);
    expect(gradeAnswer(q, { format: 'text', text: '[1,2]' }).correct).toBe(true);
    expect(gradeAnswer(q, { format: 'text', text: '[1,3]' }).correct).toBe(false);
  });

  it('throws when response format mismatches', () => {
    expect(() => gradeAnswer(base(), { format: 'text', text: 'x' })).toThrow();
  });
});

describe('toTextFormat', () => {
  it('preserves id/variantKey and uses the correct option text as accepted', () => {
    const template = makeSubject({ topics: 1, easy: 1, medium: 0, hard: 0 }).templates[0]!;
    const q = generateQuestion(template, 42);
    expect(q.format).toBe('choice');
    const t = toTextFormat(q as Question & { format: 'choice' });
    expect(t.id).toBe(q.id);
    expect(t.variantKey).toBe(q.variantKey);
    const correctText =
      q.format === 'choice' ? q.options.find((o) => o.id === q.correctOptionId)!.text : '';
    expect(t.accepted).toEqual([correctText]);
    expect(t.explanation.why).toEqual({});
  });
});

describe('computeVariantKey', () => {
  it('keeps the legacy key for choice questions', () => {
    const template = makeSubject({ topics: 1, easy: 1, medium: 0, hard: 0 }).templates[0]!;
    const q = generateQuestion(template, 7);
    if (q.format !== 'choice') throw new Error('expected choice');
    const legacy = stableHash(
      `${q.templateId}::${q.prompt}::${q.code ?? ''}::${q.options
        .map((o) => o.text)
        .slice()
        .sort()
        .join('|')}`,
    );
    expect(computeVariantKey(q.templateId, q)).toBe(legacy);
    expect(q.variantKey).toBe(legacy);
  });
});
