import type { BankQuestion } from '../src/bank/types.js';
import { loadDrafts } from './bankIO.js';

const nl = (s: string) => s.replace(/\n/g, '⏎');

const all: BankQuestion[] = loadDrafts()
  .flatMap((d) => d.file.questions)
  .sort((a, b) =>
    `${a.topicId}|${a.type}|${a.difficulty}|${a.id}`.localeCompare(
      `${b.topicId}|${b.type}|${b.difficulty}|${b.id}`,
    ),
  );

for (const q of all) {
  console.log(`\n### ${q.id}  [${q.subtopicId}] ${q.type}/${q.difficulty}`);
  console.log(`P: ${nl(q.prompt)}`);
  if (q.code) console.log(q.code);
  for (const o of q.options) {
    console.log(`  ${o.id === q.correctOptionId ? '*' : ' '} ${o.id}) ${nl(o.text)}`);
  }
  const ex = q.explanation;
  console.log(`  ✓ ${nl(ex.whyCorrect)}`);
  for (const o of q.options) {
    if (o.id === q.correctOptionId) continue;
    console.log(`  ✗ ${o.id}: ${nl(ex.whyOthersWrong[o.id] ?? '(manca)')}`);
  }
  console.log(`  concetto: ${ex.concept}`);
}

console.log(`\n=== ${all.length} domande in bozza ===`);
