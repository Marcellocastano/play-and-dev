import { generateQuestion } from '@lg/core';
import { printQuestion } from '../printQuestion.js';
import type { SubjectContentConfig } from '../config.js';

export function runDump(config: SubjectContentConfig, args: string[]): void {
  const whyMode = args.includes('--why');
  const seed = Number(args.find((a) => a !== '--why') ?? 7);
  for (const t of config.subject.templates) {
    printQuestion(generateQuestion(t, seed), whyMode);
  }
}
