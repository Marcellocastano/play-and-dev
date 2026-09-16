import { generateQuestion } from '@lg/core';
import { javascriptSubject } from '../src/index.js';

const args = process.argv.slice(2);
const whyMode = args.includes('--why');
const seed = Number(args.find((a) => a !== '--why') ?? 7);

for (const t of javascriptSubject.templates) {
  const q = generateQuestion(t, seed);
  console.log(`\n### ${t.id} [${t.type}/${t.difficulty}]`);
  console.log(q.prompt);
  if (!whyMode && q.code) console.log(q.code);
  if (whyMode) {
    const correct = q.options.find((o) => o.id === q.correctOptionId);
    console.log(`* ${correct?.text.replace(/\n/g, ' ⏎ ')}`);
    for (const [id, why] of Object.entries(q.explanation.whyOthersWrong)) {
      const opt = q.options.find((o) => o.id === id);
      console.log(`  ${opt?.text.replace(/\n/g, ' ⏎ ')} → ${why}`);
    }
  } else {
    for (const o of q.options) {
      const mark = o.id === q.correctOptionId ? '*' : ' ';
      console.log(`${mark} ${o.text.replace(/\n/g, ' ⏎ ')}`);
    }
  }
}
