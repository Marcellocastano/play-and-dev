import OpenAI from 'openai';
import type { BankQuestion, Difficulty, SubjectDefinition } from '@lg/core';
import { allocateIds, checkCandidate, dedupKey, toBankQuestion } from './checkCandidate.js';
import { buildPrompts } from './prompts.js';
import type { CodeRunner } from './runner.js';

export type ChatFn = (system: string, user: string) => Promise<string>;
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export type MessagesChatFn = (messages: ChatMessage[]) => Promise<string>;

/** OpenAI chat su una conversazione completa, JSON output e backoff su 429/5xx. */
export function openAIChatMessages(
  apiKey: string,
  model: string,
  temperature = 0.8,
): MessagesChatFn {
  const openai = new OpenAI({ apiKey });
  return async (messages) => {
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const res = await openai.chat.completions.create({
          model,
          temperature,
          response_format: { type: 'json_object' },
          messages,
        });
        return res.choices[0]?.message.content ?? '{}';
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status !== 429 && (status === undefined || status < 500)) throw err;
        const wait = Math.min(60, 5 * attempt * attempt);
        console.error(`HTTP ${status}, riprovo tra ${wait}s`);
        await new Promise((r) => setTimeout(r, wait * 1000));
      }
    }
    throw new Error('API non raggiungibile dopo 5 tentativi');
  };
}

/** OpenAI chat with JSON output and backoff on 429/5xx. */
export function openAIChat(apiKey: string, model: string, temperature = 0.8): ChatFn {
  const chat = openAIChatMessages(apiKey, model, temperature);
  return (system, user) =>
    chat([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]);
}

export interface AuthorRequest {
  subject: SubjectDefinition;
  system: string;
  runner?: CodeRunner;
  topicId: string;
  type: string;
  difficulty: Difficulty;
  count: number;
  existing: readonly BankQuestion[];
  chat: ChatFn;
  maxRounds?: number;
}

export interface AuthorReport {
  accepted: BankQuestion[];
  rejected: { prompt: string; reasons: string[] }[];
}

/**
 * Asks the model for `count` questions of one group, validating each candidate with
 * `checkCandidate`, until `count` are accepted or `maxRounds` is reached.
 */
export async function authorGroup(req: AuthorRequest): Promise<AuthorReport> {
  const { subject, system, runner, topicId, type, difficulty, count, existing, chat } = req;
  const seenKeys = new Set(existing.map((q) => dedupKey(q as unknown as Record<string, unknown>)));
  const nextId = allocateIds(
    topicId,
    type,
    existing.map((q) => q.id),
  );
  const existingPrompts = existing.map((q) => q.prompt);
  const accepted: BankQuestion[] = [];
  const rejected: AuthorReport['rejected'] = [];

  for (let round = 1; round <= (req.maxRounds ?? 3) && accepted.length < count; round++) {
    const { user } = buildPrompts({
      subject,
      system,
      topicId,
      type,
      difficulty,
      count: count - accepted.length,
      existingPrompts: [...existingPrompts, ...accepted.map((q) => q.prompt)],
    });
    let questions: Record<string, unknown>[];
    try {
      const parsed = JSON.parse(await chat(system, user)) as {
        questions?: Record<string, unknown>[];
      };
      questions = parsed.questions ?? [];
    } catch {
      console.error(`round ${round}: JSON non valido nella risposta del modello`);
      continue;
    }
    for (const c of questions) {
      const { q, reasons } = await checkCandidate(c, {
        subject,
        runner,
        topicId,
        type,
        difficulty,
        seenKeys,
      });
      if (q && reasons.length === 0) {
        seenKeys.add(dedupKey(c));
        accepted.push(toBankQuestion(q, nextId(), 'ai'));
      } else {
        rejected.push({ prompt: String(c.prompt ?? '(senza prompt)').slice(0, 80), reasons });
      }
    }
  }
  return { accepted, rejected };
}
