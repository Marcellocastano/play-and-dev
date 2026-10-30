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
  const ex = q.explanation;
  const why = (id: string) => nl(ex.why[id] ?? '(manca)');
  switch (q.format) {
    case 'choice':
      for (const o of q.options) {
        console.log(`  ${o.id === q.correctOptionId ? '*' : ' '} ${o.id}) ${nl(o.text)}`);
      }
      console.log(`  ✓ ${nl(ex.whyCorrect)}`);
      for (const o of q.options) {
        if (o.id !== q.correctOptionId) console.log(`  ✗ ${o.id}: ${why(o.id)}`);
      }
      break;
    case 'categorize':
      for (const c of q.categories) {
        console.log(`  ▸ ${c.text}`);
        for (const i of q.items.filter((i) => i.categoryId === c.id)) {
          console.log(`      ${i.id}) ${nl(i.text)}\n         → ${why(i.id)}`);
        }
      }
      break;
    case 'match':
      for (const r of q.rows) {
        const choice = q.choices.find((c) => c.id === r.choiceId)?.text ?? '(scelta mancante)';
        console.log(`  ${r.id}) ${nl(r.text)}  ⇒  ${choice}\n      → ${why(r.id)}`);
      }
      console.log(`  scelte: ${q.choices.map((c) => c.text).join(' | ')}`);
      break;
    case 'true-false':
      for (const s of q.statements) {
        console.log(`  ${s.value ? 'V' : 'F'} ${s.id}) ${nl(s.text)}\n      → ${why(s.id)}`);
      }
      break;
    case 'text':
      console.log(`  atteso: ${q.accepted.map(nl).join(' | ')}`);
      break;
  }
  if (q.format !== 'choice') console.log(`  generale: ${nl(ex.whyCorrect)}`);
  if (ex.concept) console.log(`  concetto: ${ex.concept}`);
}

console.log(`\n=== ${all.length} domande in bozza ===`);
