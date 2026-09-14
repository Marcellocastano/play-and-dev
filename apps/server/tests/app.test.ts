import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const appNoKey = createApp({ apiKey: '' });

describe('AI proxy', () => {
  it('senza OPENAI_API_KEY risponde 503 ai_unavailable', async () => {
    for (const ep of ['generate-question', 'explanation', 'analyze-session', 'study-plan']) {
      const bodies: Record<string, object> = {
        'generate-question': { subjectId: 'javascript', topicId: 'variables', difficulty: 'easy' },
        explanation: {
          question: {
            templateId: 't',
            type: 'multiple-choice',
            difficulty: 'easy',
            topicId: 'variables',
            subtopicId: 's',
            skills: [],
            prompt: 'p',
            options: [
              { id: 'a', text: 'x' },
              { id: 'b', text: 'y' },
              { id: 'c', text: 'z' },
              { id: 'd', text: 'w' },
            ],
            correctOptionId: 'a',
            explanation: { short: 's', whyCorrect: 'w', whyOthersWrong: { b: 'x', c: 'y', d: 'z' }, concept: 'c' },
          },
          selectedOptionId: 'a',
        },
        'analyze-session': { session: {}, summary: {} },
        'study-plan': { subjectId: 'javascript', levelId: 'beginner', weakTopics: [] },
      };
      const res = await request(appNoKey).post(`/api/ai/${ep}`).send(bodies[ep]!);
      expect(res.status, ep).toBe(503);
      expect(res.body.error).toBe('ai_unavailable');
    }
  });

  it('body invalido → 400', async () => {
    const res = await request(appNoKey)
      .post('/api/ai/generate-question')
      .send({ subjectId: 42 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_body');
  });

  it('con chat mockata, risposta AI non valida → 422', async () => {
    const app = createApp({ apiKey: 'test', chat: async () => '{"foo": 1}' });
    const res = await request(app)
      .post('/api/ai/generate-question')
      .send({ subjectId: 'javascript', topicId: 'variables', difficulty: 'easy' });
    expect(res.status).toBe(422);
  });
});
