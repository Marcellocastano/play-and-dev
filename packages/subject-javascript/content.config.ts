import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SubjectContentConfig } from '@lg/subject-kit/node';
import { javascriptSubject } from './src/index.js';
import { javascriptRunner } from './src/runner/index.js';

const pkgRoot = fileURLToPath(new URL('.', import.meta.url));

export default {
  subject: javascriptSubject,
  language: 'JavaScript',
  pkgRoot,
  runner: javascriptRunner,
  prompts: {
    languageRules: join(pkgRoot, 'prompts', 'author.language.md'),
    examples: join(pkgRoot, 'prompts', 'author.examples.md'),
  },
  contentGuidePath: join(pkgRoot, 'CONTENT_GUIDE.md'),
  template: {
    systemPromptPath: join(pkgRoot, 'prompts', 'template.md'),
    helpersPath: join(pkgRoot, 'src', 'templates', 'helpers.ts'),
  },
} satisfies SubjectContentConfig;
