import { writeFileSync } from 'node:fs';
import {
  loadAllApproved,
  loadApproved,
  readBankFile,
  regenerateData,
  resolveDraftPath,
  saveApproved,
} from './bankIO.js';

const [flagOrDraft, ...rest] = process.argv.slice(2);
const isReject = flagOrDraft === '--reject';
const [draftArg, ...ids] = isReject ? rest : [flagOrDraft, ...rest];
if (!draftArg) {
  console.error(
    'uso: npm run content:approve -w @lg/subject-javascript -- [--reject] content/drafts/<file>.json [id ...]',
  );
  process.exit(1);
}

const draftPath = resolveDraftPath(draftArg!);
const draft = readBankFile(draftPath);

if (isReject) {
  const remove = new Set(ids);
  for (const id of remove) {
    if (!draft.questions.some((q) => q.id === id)) {
      throw new Error(`id non trovato nella bozza: ${id}`);
    }
  }
  draft.questions = draft.questions.filter((q) => !remove.has(q.id));
  writeFileSync(draftPath, JSON.stringify(draft, null, 2) + '\n');
  console.log(
    `Rimosse ${remove.size} domande da ${draftPath} (restano ${draft.questions.length}).`,
  );
  process.exit(0);
}

const selected = ids.length
  ? ids.map((id) => {
      const q = draft.questions.find((x) => x.id === id);
      if (!q) throw new Error(`id non trovato nella bozza: ${id}`);
      return q;
    })
  : draft.questions;

const approved = loadApproved(draft.topicId);
const byId = new Map(approved.map((q) => [q.id, q]));
for (const q of selected) byId.set(q.id, q);
const merged = [...byId.values()];
saveApproved(draft.topicId, merged);

regenerateData(loadAllApproved());

console.log(`Approvate ${selected.length} domande da ${draftPath} → ${draft.topicId}.json`);
console.log(`Banca totale: ${merged.length} domande per ${draft.topicId}`);
console.log('Rigenerato src/bank/data.generated.ts');
