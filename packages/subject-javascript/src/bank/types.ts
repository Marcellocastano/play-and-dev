import type { Difficulty, Option, QuestionExplanation } from '@lg/core';

/** Domanda curata della banca, come serializzata in content/<topicId>.json. */
export interface BankQuestion {
  id: string;
  topicId: string;
  subtopicId: string;
  type: string;
  difficulty: Difficulty;
  skills: string[];
  prompt: string;
  code?: string;
  options: Option[];
  correctOptionId: string;
  explanation: QuestionExplanation;
  source: 'ai' | 'manual';
  model?: string;
  createdAt: string;
}

export interface BankFile {
  topicId: string;
  questions: BankQuestion[];
}
