import type {
  Difficulty,
  GeneratedQuestion,
  LevelId,
  QuestionTemplate,
  SubjectDefinition,
  Theme,
  Topic,
} from '../src/index.js';
import { shuffle, uniqueDistractors } from '../src/index.js';

export const TEST_THEME: Theme = {
  primary: '#f0db4f',
  secondary: '#323330',
  background: '#ffffff',
  surface: '#f7f7f7',
  accent: '#f0db4f',
  text: '#111111',
  success: '#2e7d32',
  danger: '#c62828',
  gradients: { hero: 'h', card: 'c', progress: 'p' },
};

const REQUIRES_CODE = new Set(['predict-output', 'find-the-bug', 'fill-the-gap']);

export function makeTemplate(
  id: string,
  topicId: string,
  difficulty: Difficulty,
  type = 'multiple-choice',
): QuestionTemplate {
  return {
    id,
    topicId,
    subtopicId: `${topicId}-sub`,
    type,
    difficulty,
    skills: ['skill-1'],
    tags: ['test'],
    generate(rng): GeneratedQuestion {
      const n = Math.floor(rng() * 10000);
      const correct = `valore-${n}`;
      const distractors = uniqueDistractors(correct, [
        `valore-${n + 1}`,
        `valore-${n + 2}`,
        `valore-${n + 3}`,
        `valore-${n - 1}`,
        `valore-${n + 4}`,
      ], 3);
      const texts = shuffle([correct, ...distractors], rng);
      const options = texts.map((text, i) => ({ id: `o${i}`, text }));
      const correctOptionId = options.find((o) => o.text === correct)!.id;
      const whyOthersWrong: Record<string, string> = {};
      for (const o of options) {
        if (o.id !== correctOptionId) whyOthersWrong[o.id] = `${o.text} è errato.`;
      }
      return {
        templateId: id,
        type,
        difficulty,
        topicId,
        subtopicId: `${topicId}-sub`,
        skills: ['skill-1'],
        prompt: `Domanda ${n}?`,
        code: REQUIRES_CODE.has(type) ? `const x = ${n};` : undefined,
        options,
        correctOptionId,
        explanation: {
          short: 'Spiegazione breve.',
          whyCorrect: `${correct} è la risposta corretta.`,
          whyOthersWrong,
          concept: 'Concetto di test',
        },
      };
    },
  };
}

export function makeTopic(id: string, levelId: LevelId): Topic {
  return {
    id,
    subjectId: 'test-subject',
    levelId,
    name: `Topic ${id}`,
    overview: 'Overview',
    subtopics: [{ id: `${id}-sub`, name: 'Sub' }],
    learningObjectives: ['obj'],
    commonMistakes: ['mistake'],
    examples: ['example'],
    prerequisites: [],
  };
}

export interface SubjectSpec {
  topics: number;
  easy: number;
  medium: number;
  hard: number;
  levelId?: LevelId;
}

/** Builds a subject whose templates are spread round-robin over topics. */
export function makeSubject(spec: SubjectSpec): SubjectDefinition {
  const levelId = spec.levelId ?? 'beginner';
  const topics = Array.from({ length: spec.topics }, (_, i) => makeTopic(`t${i}`, levelId));
  const templates: QuestionTemplate[] = [];
  const add = (difficulty: Difficulty, count: number) => {
    for (let i = 0; i < count; i++) {
      const topicId = topics[i % topics.length]!.id;
      templates.push(makeTemplate(`${difficulty}-${i}`, topicId, difficulty));
    }
  };
  add('easy', spec.easy);
  add('medium', spec.medium);
  add('hard', spec.hard);
  return {
    id: 'test-subject',
    name: 'Test Subject',
    kind: 'language',
    description: 'Fixture',
    icon: 'icon',
    theme: TEST_THEME,
    status: 'available',
    levels: [
      { id: levelId, name: levelId, description: '', topicIds: topics.map((t) => t.id) },
    ],
    topics,
    templates,
    learningObjectives: [],
  };
}
