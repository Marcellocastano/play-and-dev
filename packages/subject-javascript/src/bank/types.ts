import type { DistributiveOmit, Question } from '@lg/core';

/** Domanda curata della banca, come serializzata in content/<topicId>.json. */
export type BankQuestion = DistributiveOmit<
  Question,
  'templateId' | 'variantKey' | 'deepDiveRef'
> & {
  source: 'ai' | 'manual';
};

export interface BankFile {
  topicId: string;
  questions: BankQuestion[];
}
