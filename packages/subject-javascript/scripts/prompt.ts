import { GAME_QUESTION_TYPES, PHASE1_QUESTION_TYPES } from '@lg/core';
import { bankQuestions } from '../src/bank/index.js';
import { javascriptSubject } from '../src/index.js';
import { buildPrompts } from './buildPrompt.js';

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const DIFFICULTY_LABEL = { easy: 'Fondamenti', medium: 'Un passo in più', hard: 'Sfida' };
const TYPES = [...GAME_QUESTION_TYPES, ...PHASE1_QUESTION_TYPES];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function printHelp(): void {
  const count = (topicId: string, type: string, difficulty: string) =>
    bankQuestions.filter(
      (q) => q.topicId === topicId && q.type === type && q.difficulty === difficulty,
    ).length;
  const cell = (n: number) => String(n).padStart(3);

  console.log(
    'uso: npm run content:prompt -w @lg/subject-javascript -- --topic <topic> --type <type> --difficulty <difficulty> [--count N] | pbcopy\n',
  );
  console.log('--type');
  for (const t of TYPES) console.log(`  ${t.id.padEnd(16)} ${t.label}`);
  console.log('\n--difficulty');
  for (const d of DIFFICULTIES) console.log(`  ${d.padEnd(16)} ${DIFFICULTY_LABEL[d]}`);
  console.log('\n--count (default 6): chiedine 7–8, ogni domanda approvata entra subito in gioco');
  console.log('\n--topic — domande in banca per i giochi (easy/medium/hard)');
  const games = GAME_QUESTION_TYPES.map((t) => t.id);
  console.log(`  ${''.padEnd(26)}${games.map((g) => g.padEnd(16)).join('')}`);
  for (const level of javascriptSubject.levels) {
    console.log(`  ${level.name}`);
    for (const topicId of level.topicIds.filter((id) =>
      javascriptSubject.topics.some((t) => t.id === id),
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

const topicId = arg('topic');
const type = arg('type');
const difficulty = arg('difficulty');
const errors: string[] = [];
if (!topicId || !type || !difficulty) errors.push('servono --topic, --type e --difficulty');
if (topicId && !javascriptSubject.topics.some((t) => t.id === topicId))
  errors.push(`topic sconosciuto: ${topicId}`);
if (type && !TYPES.some((t) => t.id === type)) errors.push(`type sconosciuto: ${type}`);
if (difficulty && !(DIFFICULTIES as readonly string[]).includes(difficulty))
  errors.push(`difficulty sconosciuta: ${difficulty}`);

if (process.argv.includes('--help') || errors.length > 0) {
  for (const e of errors) if (!process.argv.includes('--help')) console.error(`✗ ${e}`);
  printHelp();
  process.exit(process.argv.includes('--help') ? 0 : 1);
}

const count = Number(arg('count') ?? '6');
const { system, user } = buildPrompts({
  topicId: topicId!,
  type: type!,
  difficulty: difficulty!,
  count,
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
