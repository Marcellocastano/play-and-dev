import { describe, expect, it } from 'vitest';
import {
  HttpAIProvider,
  MockAIProvider,
  validateAIQuestion,
  type AIQuestionInput,
} from '../src/index.js';

const validAIJson: AIQuestionInput = {
  templateId: 'ai-t',
  type: 'multiple-choice',
  difficulty: 'easy',
  topicId: 'topic',
  subtopicId: 'sub',
  skills: [],
  prompt: 'Domanda?',
  options: [
    { id: 'a', text: 'giusta' },
    { id: 'b', text: 'sbagliata 1' },
    { id: 'c', text: 'sbagliata 2' },
    { id: 'd', text: 'sbagliata 3' },
  ],
  correctOptionId: 'a',
  explanation: {
    short: 'breve',
    whyCorrect: 'perché giusta',
    whyOthersWrong: { b: 'no', c: 'no', d: 'no' },
    concept: 'concetto',
  },
};

describe('validateAIQuestion', () => {
  it('accepts a valid payload and assigns id/variantKey', () => {
    const r = validateAIQuestion(validAIJson);
    expect(r.ok).toBe(true);
    expect(r.question!.id).toBeTruthy();
    expect(r.question!.variantKey).toBeTruthy();
  });

  it('rejects when no option is correct (correctOptionId mismatch)', () => {
    const r = validateAIQuestion({ ...validAIJson, correctOptionId: 'zzz' });
    expect(r.ok).toBe(false);
  });

  it('rejects duplicate options', () => {
    const r = validateAIQuestion({
      ...validAIJson,
      options: validAIJson.options.map((o, i) => (i === 1 ? { ...o, text: 'giusta' } : o)),
    });
    expect(r.ok).toBe(false);
  });

  it('rejects non-4 options and malformed payloads', () => {
    expect(validateAIQuestion({ ...validAIJson, options: validAIJson.options.slice(0, 3) }).ok).toBe(false);
    expect(validateAIQuestion(null).ok).toBe(false);
    expect(validateAIQuestion('nope').ok).toBe(false);
  });

  it('rejects code-requiring types without code', () => {
    const r = validateAIQuestion({ ...validAIJson, type: 'predict-output' });
    expect(r.ok).toBe(false);
    const r2 = validateAIQuestion({ ...validAIJson, type: 'predict-output', code: 'x = 1' });
    expect(r2.ok).toBe(true);
  });
});

describe('MockAIProvider', () => {
  it('returns deterministic valid data', async () => {
    const mock = new MockAIProvider();
    const q = await mock.generateQuestion({ subjectId: 'js', topicId: 't', difficulty: 'easy' });
    expect(validateAIQuestion(q).ok).toBe(true);
    const q2 = await mock.generateQuestion({ subjectId: 'js', topicId: 't', difficulty: 'easy' });
    expect(q).toEqual(q2);
    expect(await mock.generateExplanation({ question: {} as never, selectedOptionId: 'a' })).toBeTruthy();
    expect(await mock.analyzeSession({ session: {} as never, summary: {} as never })).toBeTruthy();
    const plan = await mock.generateStudyPlan({ subjectId: 'js', levelId: 'beginner', weakTopics: ['a', 'b'] });
    expect(plan).toHaveLength(2);
  });
});

describe('HttpAIProvider', () => {
  it('POSTs to {baseUrl}/api/ai/<endpoint> and validates the question response', async () => {
    const calls: { url: string; body: unknown }[] = [];
    const fetchImpl = async (url: string, init?: RequestInit): Promise<Response> => {
      calls.push({ url, body: JSON.parse(String(init?.body)) });
      if (url.endsWith('generate-question')) {
        return new Response(JSON.stringify(validAIJson), { status: 200 });
      }
      if (url.endsWith('explanation')) {
        return new Response(JSON.stringify({ explanation: 'spiegazione' }), { status: 200 });
      }
      return new Response('not found', { status: 404 });
    };
    const provider = new HttpAIProvider('http://localhost:3001', fetchImpl);
    const q = await provider.generateQuestion({ subjectId: 'js', topicId: 't', difficulty: 'easy' });
    expect(calls[0]!.url).toBe('http://localhost:3001/api/ai/generate-question');
    expect(q.prompt).toBe('Domanda?');
    const exp = await provider.generateExplanation({ question: {} as never, selectedOptionId: 'a' });
    expect(exp).toBe('spiegazione');
    await expect(
      provider.analyzeSession({ session: {} as never, summary: {} as never }),
    ).rejects.toThrow('404');
  });

  it('rejects invalid AI question payloads', async () => {
    const fetchImpl = async (): Promise<Response> =>
      new Response(JSON.stringify({ ...validAIJson, correctOptionId: 'nope' }), { status: 200 });
    const provider = new HttpAIProvider('http://x', fetchImpl);
    await expect(
      provider.generateQuestion({ subjectId: 'js', topicId: 't', difficulty: 'easy' }),
    ).rejects.toThrow('Invalid AI question');
  });
});
