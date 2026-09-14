import type {
  LearningRecommendation,
  SubjectDefinition,
  Topic,
  UserProgress,
} from '../models/index.js';

/**
 * 2-4 motivated recommendations: weak topics first, then unexplored,
 * then topics worth consolidating.
 */
export function buildRecommendations(
  progress: UserProgress,
  subject: SubjectDefinition,
): LearningRecommendation[] {
  const topics = subject.topics.filter((t) => t.subjectId === subject.id);
  const byKind: Record<LearningRecommendation['kind'], LearningRecommendation[]> = {
    weak: [],
    unexplored: [],
    consolidate: [],
  };

  const score = (t: Topic) => progress.topicMastery[t.id]?.score ?? 0;
  const practiced = (t: Topic) => (progress.topicMastery[t.id]?.attempts ?? 0) > 0;

  for (const t of topics.slice().sort((a, b) => score(a) - score(b))) {
    if (!practiced(t)) {
      byKind.unexplored.push({
        topicId: t.id,
        kind: 'unexplored',
        reason: `Non hai ancora esplorato "${t.name}".`,
      });
    } else if (score(t) <= 40) {
      byKind.weak.push({
        topicId: t.id,
        kind: 'weak',
        reason: `Mastery bassa (${Math.round(score(t))}%) su "${t.name}": conviene rinforzarlo.`,
      });
    } else if (score(t) <= 80) {
      byKind.consolidate.push({
        topicId: t.id,
        kind: 'consolidate',
        reason: `"${t.name}" è a ${Math.round(score(t))}%: ancora poca strada per consolidarlo.`,
      });
    }
  }

  const out: LearningRecommendation[] = [];
  for (const kind of ['weak', 'unexplored', 'consolidate'] as const) {
    for (const rec of byKind[kind]) {
      if (out.length >= 4) break;
      out.push(rec);
    }
    if (out.length >= 2 && kind === 'weak') continue;
  }
  return out.slice(0, Math.max(2, Math.min(4, out.length)));
}
