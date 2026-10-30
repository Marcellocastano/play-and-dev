import { generateQuestion } from '@lg/core';
import { javascriptSubject } from '../src/index.js';

const args = process.argv.slice(2);
const whyMode = args.includes('--why');
const seed = Number(args.find((a) => a !== '--why') ?? 7);

const nl = (s: string) => s.replace(/\n/g, ' ⏎ ');

for (const t of javascriptSubject.templates) {
  const q = generateQuestion(t, seed);
  console.log(`\n### ${t.id} [${t.type}/${t.difficulty}]`);
  console.log(q.prompt);
  if (!whyMode && q.code) console.log(q.code);
  const why = q.explanation.why;
  const whyLine = (id: string) => (whyMode && why[id] ? ` → ${why[id]}` : '');
  switch (q.format) {
    case 'choice': {
      if (whyMode) {
        const correct = q.options.find((o) => o.id === q.correctOptionId);
        console.log(`* ${nl(correct?.text ?? '')}`);
        for (const [id, w] of Object.entries(why)) {
          const opt = q.options.find((o) => o.id === id);
          console.log(`  ${nl(opt?.text ?? '')} → ${w}`);
        }
      } else {
        for (const o of q.options) {
          const mark = o.id === q.correctOptionId ? '*' : ' ';
          console.log(`${mark} ${nl(o.text)}`);
        }
      }
      break;
    }
    case 'categorize': {
      for (const c of q.categories) {
        console.log(`▸ ${nl(c.text)}`);
        for (const it of q.items.filter((i) => i.categoryId === c.id)) {
          console.log(`    ${nl(it.text)}${whyLine(it.id)}`);
        }
      }
      break;
    }
    case 'match': {
      for (const r of q.rows) {
        const choice = q.choices.find((c) => c.id === r.choiceId);
        console.log(`  ${nl(r.text)} → ${nl(choice?.text ?? '')}${whyLine(r.id)}`);
      }
      break;
    }
    case 'true-false': {
      for (const s of q.statements) {
        console.log(`  ${s.value ? 'V' : 'F'} ${nl(s.text)}${whyLine(s.id)}`);
      }
      break;
    }
    case 'text': {
      console.log(`  atteso: ${nl(q.accepted[0] ?? '')}`);
      break;
    }
  }
}
