import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  composeSession,
  generateQuestion,
  qualityIssues,
  questionTypeRegistry,
  similarityKey,
  validateQuestion,
  MAX_SIMILAR_PER_SESSION,
  type BankFile,
  type SubjectDefinition,
} from '@lg/core';
import { renderContentIndex, type CodeRunner } from '@lg/content-pipeline';
import { buildBankTemplates, MIN_BANK_SIZE } from '../bank.js';
import { listTsTemplateFiles, renderAiTemplatesIndex } from '../node/templateIO.js';

const SEEDS = Array.from({ length: 25 }, (_, i) => i * 97 + 13);

function correctText(q: Parameters<typeof validateQuestion>[0]): string {
  if (q.format === 'text') return q.accepted[0]!;
  if (q.format !== 'choice') throw new Error(`unexpected format ${q.format}`);
  const opt = q.options.find((o) => o.id === q.correctOptionId);
  if (!opt) throw new Error('no correct option');
  return opt.text;
}

export interface SubjectContentSuite {
  subject: SubjectDefinition;
  runner?: CodeRunner;
  /** Set di deepDiveRef validi (es. `dd-<topicId>`). */
  deepDiveIds: ReadonlySet<string>;
  /** <pkg>/src/bank/content — abilita i controlli su banca e indici. */
  bankContentDir?: string;
}

/**
 * Controlli di contenuto generici per un subject: validità dei template sui seed,
 * esecuzione predict-output, deep dive, indici banca/ai, sessioni e similarità.
 */
export function describeSubjectContent(suite: SubjectContentSuite): void {
  const { subject, runner, deepDiveIds, bankContentDir } = suite;
  const topicIds = new Set(subject.topics.map((t) => t.id));
  const subtopicIds = new Set(subject.topics.flatMap((t) => t.subtopics.map((s) => s.id)));
  const bankQuestions =
    bankContentDir && existsSync(bankContentDir)
      ? readdirSync(bankContentDir)
          .filter((f) => f.endsWith('.json'))
          .flatMap(
            (f) =>
              (JSON.parse(readFileSync(join(bankContentDir, f), 'utf8')) as BankFile).questions,
          )
      : [];

  describe('validità template (25 seed ciascuno)', () => {
    for (const template of subject.templates) {
      it(`${template.id} produce domande valide, varie e senza problemi`, () => {
        const variantKeys = new Set<string>();
        for (const seed of SEEDS) {
          const q = generateQuestion(template, seed);
          const result = validateQuestion(q);
          expect(result.errors, `${template.id} seed ${seed}: ${result.errors.join('; ')}`).toEqual(
            [],
          );
          expect(qualityIssues(q), `${template.id} seed ${seed}`).toEqual([]);
          expect(result.ok).toBe(true);
          expect(questionTypeRegistry.has(q.type), q.type).toBe(true);
          expect(topicIds.has(q.topicId), q.topicId).toBe(true);
          expect(subtopicIds.has(q.subtopicId), q.subtopicId).toBe(true);
          if (q.deepDiveRef) expect(deepDiveIds.has(q.deepDiveRef), q.deepDiveRef).toBe(true);
          variantKeys.add(q.variantKey);
        }
        expect(variantKeys.size).toBeGreaterThanOrEqual(Math.min(5, template.capacity ?? 5));
      });
    }
  });

  if (runner) {
    describe('predict-output: output eseguito = risposta', () => {
      const poTemplates = subject.templates.filter((t) => t.type === 'predict-output');
      for (const template of poTemplates) {
        it(template.id, async () => {
          for (const seed of SEEDS) {
            const q = generateQuestion(template, seed);
            expect(q.code, `${template.id} missing code`).toBeTruthy();
            const out = await runner.run(q.code!);
            expect(
              out,
              `${template.id} seed ${seed}: codice stampa "${out.replace(/\n/g, '|')}", risposta dichiarata "${correctText(q).replace(/\n/g, '|')}"`,
            ).toBe(correctText(q));
          }
        });
      }
    });
  }

  describe('deep dive', () => {
    it('ogni topic ha una scheda approfondimento', () => {
      for (const t of subject.topics) {
        expect(deepDiveIds.has(`dd-${t.id}`), t.id).toBe(true);
      }
    });
  });

  if (bankContentDir) {
    describe('banca approvata', () => {
      it('index.ts allineato ai file json presenti', () => {
        const files = readdirSync(bankContentDir)
          .filter((f) => f.endsWith('.json'))
          .sort();
        const expected = renderContentIndex(files);
        const actual = readFileSync(join(bankContentDir, 'index.ts'), 'utf8');
        expect(actual).toBe(expected);
        expect(files.length).toBeGreaterThan(0);
      });

      for (const bq of bankQuestions) {
        it(`${bq.id} produce domande valide (anche sotto soglia)`, async () => {
          const template = buildBankTemplates([bq], 1)[0]!;
          for (const seed of SEEDS.slice(0, 5)) {
            const q = generateQuestion(template, seed);
            const result = validateQuestion(q);
            expect(result.errors, `${bq.id} seed ${seed}`).toEqual([]);
            expect(qualityIssues(q), `${bq.id} seed ${seed}`).toEqual([]);
            expect(questionTypeRegistry.has(q.type)).toBe(true);
            expect(topicIds.has(q.topicId)).toBe(true);
            expect(subtopicIds.has(q.subtopicId)).toBe(true);
            if (runner && q.type === 'predict-output' && q.format === 'choice' && q.code) {
              const actual = await runner.run(q.code);
              expect(
                actual,
                `${bq.id} seed ${seed}: codice stampa "${actual.replace(/\n/g, '|')}", risposta dichiarata "${correctText(q).replace(/\n/g, '|')}"`,
              ).toBe(correctText(q));
            }
          }
        });
      }

      it(`ogni template bank- è appoggiato a un gruppo di almeno ${MIN_BANK_SIZE} domande`, () => {
        const groups = new Map<string, number>();
        for (const q of bankQuestions) {
          const k = `${q.topicId}:${q.type}:${q.difficulty}`;
          groups.set(k, (groups.get(k) ?? 0) + 1);
        }
        for (const t of subject.templates.filter((t) => t.id.startsWith('bank-'))) {
          const n = groups.get(`${t.topicId}:${t.type}:${t.difficulty}`) ?? 0;
          expect(n, `${t.id}: ${n} domande`).toBeGreaterThanOrEqual(MIN_BANK_SIZE);
        }
      });
    });

    const aiDir = join(bankContentDir, '..', '..', 'templates', 'ai');
    describe('template AI (src/templates/ai)', () => {
      it('index.ts allineato ai file presenti', () => {
        const expected = renderAiTemplatesIndex(listTsTemplateFiles(aiDir));
        const actual = readFileSync(join(aiDir, 'index.ts'), 'utf8');
        expect(actual).toBe(expected);
      });
    });
  }

  const levelsWithTemplates = subject.levels.filter((l) =>
    l.topicIds.some((id) => subject.templates.some((t) => t.topicId === id)),
  );

  describe('sessioni composeSession', () => {
    for (const level of levelsWithTemplates) {
      it(`livello ${level.id}: 20 domande valide e uniche`, () => {
        const questions = composeSession({
          subject,
          levelId: level.id,
          mode: 'training',
          seed: 42,
        }).questions;
        expect(questions).toHaveLength(20);
        for (const q of questions) expect(validateQuestion(q).errors).toEqual([]);
        expect(new Set(questions.map((q) => q.variantKey)).size).toBe(20);
      });
    }
  });

  const similarityFeasible = (levelId: string): boolean => {
    const combos = new Set(subject.templates.map((t) => `${t.topicId}:${t.subtopicId}:${t.type}`));
    const levelTopicIds = new Set(subject.levels.find((l) => l.id === levelId)?.topicIds ?? []);
    const available = [...combos].filter((c) => levelTopicIds.has(c.split(':')[0]!)).length;
    return available >= Math.ceil(20 / MAX_SIMILAR_PER_SESSION);
  };
  const similarityLevels = levelsWithTemplates.filter((l) => similarityFeasible(l.id));

  describe('similarità fra domande di una sessione', () => {
    for (const level of similarityLevels) {
      it(`livello ${level.id}: mai più di ${MAX_SIMILAR_PER_SESSION} simili su 25 seed`, () => {
        for (const seed of SEEDS) {
          const { questions } = composeSession({
            subject,
            levelId: level.id,
            mode: 'training',
            seed,
          });
          const counts = new Map<string, number>();
          for (const q of questions) {
            const key = similarityKey(q);
            counts.set(key, (counts.get(key) ?? 0) + 1);
          }
          for (const [k, n] of counts) {
            expect(n, `seed ${seed}: ${k} × ${n}`).toBeLessThanOrEqual(MAX_SIMILAR_PER_SESSION);
          }
        }
      });
    }
  });
}
