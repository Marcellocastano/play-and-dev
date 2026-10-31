import { GAME_QUESTION_TYPES, PHASE1_QUESTION_TYPES } from '@lg/core';
import { buildPrompts } from '@lg/content-pipeline';
import { authorSystemPrompt, loadAllApproved, loadApproved } from '../bankIO.js';
import type { SubjectContentConfig } from '../config.js';

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const DIFFICULTY_LABEL = { easy: 'Fondamenti', medium: 'Un passo in più', hard: 'Sfida' };
const TYPES = [...GAME_QUESTION_TYPES, ...PHASE1_QUESTION_TYPES];

function arg(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

function printHelp(config: SubjectContentConfig): void {
  const bank = loadAllApproved(config);
  const count = (topicId: string, type: string, difficulty: string) =>
    bank.filter((q) => q.topicId === topicId && q.type === type && q.difficulty === difficulty)
      .length;
  const cell = (n: number) => String(n).padStart(3);

  console.log(
    'uso: npm run content -- prompt --subject <id> --topic <topic> --type <type> --difficulty <difficulty> [--count N] | pbcopy\n',
  );
  console.log('--type');
  for (const t of TYPES) console.log(`  ${t.id.padEnd(16)} ${t.label}`);
  console.log('\n--difficulty');
  for (const d of DIFFICULTIES) console.log(`  ${d.padEnd(16)} ${DIFFICULTY_LABEL[d]}`);
  console.log('\n--count (default 6): chiedine 7–8, ogni domanda approvata entra subito in gioco');
  console.log('\n--topic — domande in banca per i giochi (easy/medium/hard)');
  const games = GAME_QUESTION_TYPES.map((t) => t.id);
  console.log(`  ${''.padEnd(26)}${games.map((g) => g.padEnd(16)).join('')}`);
  for (const level of config.subject.levels) {
    console.log(`  ${level.name}`);
    for (const topicId of level.topicIds.filter((id) =>
      config.subject.topics.some((t) => t.id === id),
    )) {
      const cells = games.map((g) =>
        DIFFICULTIES.map((d) => cell(count(topicId, g, d)))
          .join(' ')
          .padEnd(16),
      );
      console.log(`    ${topicId.padEnd(24)}${cells.join('')}`);
    }
  }
}

export function runPrompt(config: SubjectContentConfig, args: string[]): void {
  const topicId = arg(args, 'topic');
  const type = arg(args, 'type');
  const difficulty = arg(args, 'difficulty');
  const errors: string[] = [];
  if (!topicId || !type || !difficulty) errors.push('servono --topic, --type e --difficulty');
  if (topicId && !config.subject.topics.some((t) => t.id === topicId))
    errors.push(`topic sconosciuto: ${topicId}`);
  if (type && !TYPES.some((t) => t.id === type)) errors.push(`type sconosciuto: ${type}`);
  if (difficulty && !(DIFFICULTIES as readonly string[]).includes(difficulty))
    errors.push(`difficulty sconosciuta: ${difficulty}`);

  if (args.includes('--help') || errors.length > 0) {
    for (const e of errors) if (!args.includes('--help')) console.error(`✗ ${e}`);
    printHelp(config);
    process.exit(args.includes('--help') ? 0 : 1);
  }

  const count = Number(arg(args, 'count') ?? '6');
  const { system, user } = buildPrompts({
    subject: config.subject,
    system: authorSystemPrompt(config),
    topicId: topicId!,
    type: type!,
    difficulty: difficulty!,
    count,
    existingPrompts: loadApproved(config, topicId!).map((q) => q.prompt),
  });

  console.log(system);
  console.log('---');
  console.log(user);
  console.log('---');
  console.log('Rispondi SOLO con un blocco JSON, senza testo prima o dopo:');
  console.log(
    `{ "topicId": "${topicId}", "questions": [ { "type": "${type}", "difficulty": "${difficulty}", ... } ] }`,
  );
  console.log('Metti sempre il codice e le espressioni tra backtick nei testi.');
}
