import type { BankQuestion } from '@lg/core';
import { buildBankTemplates } from '@lg/subject-kit';
import { bankQuestions as bankQuestionsRaw } from './content/index.js';

export type { BankFile, BankQuestion } from '@lg/core';
export { MIN_BANK_SIZE, buildBankTemplates } from '@lg/subject-kit';

/** Domande approvate una a una durante le PR del content pipeline. */
export const bankQuestions: BankQuestion[] = bankQuestionsRaw;
export const bankTemplates = buildBankTemplates(bankQuestions);
