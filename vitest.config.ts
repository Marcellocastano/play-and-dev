import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@lg/core',
        replacement: fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      },
      {
        find: '@lg/content-pipeline',
        replacement: fileURLToPath(
          new URL('./packages/content-pipeline/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@lg/subject-javascript/runner',
        replacement: fileURLToPath(
          new URL('./packages/subject-javascript/src/runner/index.ts', import.meta.url),
        ),
      },
      {
        find: /^@lg\/subject-javascript$/,
        replacement: fileURLToPath(
          new URL('./packages/subject-javascript/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@lg/subject-kit/node',
        replacement: fileURLToPath(
          new URL('./packages/subject-kit/src/node/index.ts', import.meta.url),
        ),
      },
      {
        find: '@lg/subject-kit/testing',
        replacement: fileURLToPath(
          new URL('./packages/subject-kit/src/testing/index.ts', import.meta.url),
        ),
      },
      {
        find: /^@lg\/subject-kit$/,
        replacement: fileURLToPath(new URL('./packages/subject-kit/src/index.ts', import.meta.url)),
      },
      {
        find: '@lg/subject-placeholders',
        replacement: fileURLToPath(
          new URL('./packages/subject-placeholders/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
});
