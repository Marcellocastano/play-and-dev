import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { SubjectContentConfig } from './node/config.js';
import { runAdd } from './node/commands/add.js';
import { runPrompt } from './node/commands/prompt.js';
import { runDump } from './node/commands/dump.js';
import { runTemplate } from './node/commands/template.js';

const kitRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(kitRoot, '..', '..');
const COMMANDS = ['add', 'prompt', 'template', 'dump'] as const;

function availableSubjects(): string[] {
  const dir = join(repoRoot, 'packages');
  return readdirSync(dir)
    .filter(
      (name) => name.startsWith('subject-') && existsSync(join(dir, name, 'content.config.ts')),
    )
    .map((name) => name.slice('subject-'.length));
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || !(COMMANDS as readonly string[]).includes(command)) {
    console.error(`uso: npm run content -- <${COMMANDS.join('|')}> --subject <id> [...flag]`);
    process.exit(1);
  }
  const si = rest.indexOf('--subject');
  const subjectId = si >= 0 ? rest[si + 1] : 'javascript';
  const args = rest.filter((a, i) => a !== '--subject' && rest[i - 1] !== '--subject');

  const configPath = join(repoRoot, 'packages', `subject-${subjectId}`, 'content.config.ts');
  if (!existsSync(configPath)) {
    const available = availableSubjects();
    console.error(`subject sconosciuto: ${subjectId}`);
    console.error(
      available.length
        ? `disponibili: ${available.join(', ')}`
        : 'nessun subject con content.config.ts',
    );
    process.exit(1);
  }
  const config = (
    (await import(pathToFileURL(configPath).href)) as { default: SubjectContentConfig }
  ).default;

  switch (command) {
    case 'add':
      await runAdd(config, args);
      break;
    case 'prompt':
      runPrompt(config, args);
      break;
    case 'dump':
      runDump(config, args);
      break;
    case 'template':
      await runTemplate(config, args);
      break;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
