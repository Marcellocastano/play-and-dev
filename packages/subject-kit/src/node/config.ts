import type { SubjectDefinition } from '@lg/core';
import type { CodeRunner } from '@lg/content-pipeline';

export interface SubjectContentConfig {
  subject: SubjectDefinition;
  language: string;
  pkgRoot: string;
  runner?: CodeRunner;
  prompts: { languageRules: string; examples: string };
  contentGuidePath?: string;
  template?: { systemPromptPath: string; helpersPath: string };
}
