import { AIQuestionSchema, validateAIQuestion } from '@lg/core';
import express, { type Express, type Request, type Response } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

const GenerateQuestionBody = z.object({
  subjectId: z.string().min(1),
  topicId: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.string().optional(),
});

const ExplanationBody = z.object({
  question: AIQuestionSchema.extend({
    id: z.string().optional(),
    variantKey: z.string().optional(),
  }),
  selectedOptionId: z.string().min(1),
});

const AnalyzeSessionBody = z.object({
  session: z.record(z.string(), z.unknown()),
  summary: z.record(z.string(), z.unknown()),
});

const StudyPlanBody = z.object({
  subjectId: z.string().min(1),
  levelId: z.string().min(1),
  weakTopics: z.array(z.string()),
});

const QUESTION_JSON_SPEC = `Rispondi SOLO con un oggetto JSON conforme a questo schema:
{
  "templateId": string, "type": string (uno tra multiple-choice|predict-output|find-the-bug|fill-the-gap|compare|best-method),
  "difficulty": "easy"|"medium"|"hard", "topicId": string, "subtopicId": string,
  "skills": string[], "prompt": string (italiano), "code"?: string,
  "options": [{ "id": string, "text": string }] (esattamente 4, distinte),
  "correctOptionId": string (id di una delle opzioni),
  "explanation": { "short": string, "whyCorrect": string, "whyOthersWrong": { "<optionId>": string per OGNI distrattore }, "concept": string, "commonMistake"?: string, "example"?: string },
  "deepDiveRef"?: string
}`;

type ChatFn = (system: string, user: string) => Promise<string>;

function makeChat(openai: OpenAI, model: string): ChatFn {
  return async (system, user) => {
    const res = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    });
    return res.choices[0]?.message?.content ?? '{}';
  };
}

export interface AppOptions {
  /** Override per i test: se assente si usa process.env. */
  apiKey?: string;
  model?: string;
  chat?: ChatFn;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();
  app.use(express.json());

  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const model = options.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  const chat: ChatFn | undefined = options.chat ?? (apiKey ? makeChat(new OpenAI({ apiKey }), model) : undefined);

  // CORS: solo l'origin Vite di sviluppo.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin === 'http://localhost:5173') {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  const aiUnavailable = (res: Response) => res.status(503).json({ error: 'ai_unavailable' });
  const badRequest = (res: Response, issues: unknown) =>
    res.status(400).json({ error: 'invalid_body', issues });

  app.post('/api/ai/generate-question', async (req: Request, res: Response) => {
    const body = GenerateQuestionBody.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error.issues);
    if (!chat) return aiUnavailable(res);
    const user = `Genera una domanda di ${body.data.difficulty} per il subject "${body.data.subjectId}", topic "${body.data.topicId}"${body.data.type ? `, tipo "${body.data.type}"` : ''}. Lingua: italiano. Il codice è JavaScript standard (console.log per l'output).`;
    const content = await chat(QUESTION_JSON_SPEC, user);
    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      return res.status(422).json({ error: 'invalid_ai_output', issues: ['not valid JSON'] });
    }
    const result = validateAIQuestion(json);
    if (!result.ok || !result.question) {
      return res.status(422).json({ error: 'invalid_ai_output', issues: result.errors });
    }
    const { id: _id, variantKey: _vk, ...generated } = result.question;
    return res.json(generated);
  });

  app.post('/api/ai/explanation', async (req: Request, res: Response) => {
    const body = ExplanationBody.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error.issues);
    if (!chat) return aiUnavailable(res);
    const user = `Spiega in italiano perché la risposta selezionata (${body.data.selectedOptionId}) è ${body.data.selectedOptionId === body.data.question.correctOptionId ? 'corretta' : 'sbagliata'} per questa domanda:\n${JSON.stringify(body.data.question)}`;
    const content = await chat(
      'Rispondi SOLO con JSON { "explanation": string } in italiano.',
      user,
    );
    try {
      const parsed = z.object({ explanation: z.string() }).parse(JSON.parse(content));
      return res.json(parsed);
    } catch {
      return res.status(422).json({ error: 'invalid_ai_output' });
    }
  });

  app.post('/api/ai/analyze-session', async (req: Request, res: Response) => {
    const body = AnalyzeSessionBody.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error.issues);
    if (!chat) return aiUnavailable(res);
    const content = await chat(
      'Rispondi SOLO con JSON { "analysis": string } in italiano.',
      `Analizza questa sessione di allenamento e dai un feedback sintetico:\n${JSON.stringify(body.data)}`,
    );
    try {
      const parsed = z.object({ analysis: z.string() }).parse(JSON.parse(content));
      return res.json(parsed);
    } catch {
      return res.status(422).json({ error: 'invalid_ai_output' });
    }
  });

  app.post('/api/ai/study-plan', async (req: Request, res: Response) => {
    const body = StudyPlanBody.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error.issues);
    if (!chat) return aiUnavailable(res);
    const content = await chat(
      'Rispondi SOLO con JSON { "recommendations": [{ "topicId": string, "reason": string, "kind": "weak"|"unexplored"|"consolidate" }] } in italiano.',
      `Suggerisci 2-4 argomenti per il subject "${body.data.subjectId}" livello "${body.data.levelId}", topic deboli: ${body.data.weakTopics.join(', ') || 'nessuno'}.`,
    );
    try {
      const parsed = z
        .object({
          recommendations: z.array(
            z.object({
              topicId: z.string(),
              reason: z.string(),
              kind: z.enum(['weak', 'unexplored', 'consolidate']),
            }),
          ),
        })
        .parse(JSON.parse(content));
      return res.json(parsed);
    } catch {
      return res.status(422).json({ error: 'invalid_ai_output' });
    }
  });

  return app;
}
