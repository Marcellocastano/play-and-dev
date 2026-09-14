import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@lg/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@lg/subject-javascript': fileURLToPath(
        new URL('./packages/subject-javascript/src/index.ts', import.meta.url),
      ),
      '@lg/subject-placeholders': fileURLToPath(
        new URL('./packages/subject-placeholders/src/index.ts', import.meta.url),
      ),
    },
  },
});
