export type GameMode = 'training' | 'weaknesses' | 'review' | 'speed' | 'boss' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type LevelId = 'beginner' | 'intermediate' | 'advanced';
export type SubjectKind = 'language' | 'framework' | 'runtime';
export type SubjectStatus = 'available' | 'coming-soon';

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  success: string;
  danger: string;
  gradients: {
    hero: string;
    card: string;
    progress: string;
  };
  decor?: string;
}

export interface LevelDefinition {
  id: LevelId;
  name: string;
  description: string;
  topicIds: string[];
}

export interface Subtopic {
  id: string;
  name: string;
  overview?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  levelId: LevelId;
  name: string;
  overview: string;
  subtopics: Subtopic[];
  learningObjectives: string[];
  commonMistakes: string[];
  examples: string[];
  prerequisites: string[];
}

export interface Option {
  id: string;
  text: string;
}

export type QuestionFormat = 'choice' | 'categorize' | 'match' | 'true-false' | 'text';

export type QuestionBody =
  | { format: 'choice'; options: Option[]; correctOptionId: string }
  | {
      format: 'categorize';
      categories: Option[];
      items: { id: string; text: string; categoryId: string }[];
    }
  | { format: 'match'; choices: Option[]; rows: { id: string; text: string; choiceId: string }[] }
  | { format: 'true-false'; statements: { id: string; text: string; value: boolean }[] }
  | { format: 'text'; accepted: string[] };

export interface QuestionExplanation {
  short: string;
  whyCorrect: string;
  /** key = option id (choice: distractors only) / item / row / statement. */
  why: Record<string, string>;
  concept?: string;
  commonMistake?: string;
  example?: string;
}

interface QuestionBase {
  id: string;
  templateId: string;
  variantKey: string;
  type: string;
  difficulty: Difficulty;
  topicId: string;
  subtopicId: string;
  skills: string[];
  prompt: string;
  code?: string;
  explanation: QuestionExplanation;
  deepDiveRef?: string;
}

export type Question = QuestionBase & QuestionBody;

export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/** A Question before engine-level fields (id, variantKey) are assigned. */
export type GeneratedQuestion = DistributiveOmit<Question, 'id' | 'variantKey'>;

/** A curated/stored question (bank JSON, DB): a Question without engine-level fields. */
export type BankQuestion = DistributiveOmit<Question, 'templateId' | 'variantKey' | 'deepDiveRef'> & {
  source: 'ai' | 'manual';
};

export interface BankFile {
  topicId: string;
  questions: BankQuestion[];
}

export type AnswerResponse =
  | { format: 'choice'; optionId: string }
  | { format: 'categorize'; placement: Record<string, string> }
  | { format: 'match'; selection: Record<string, string> }
  | { format: 'true-false'; values: Record<string, boolean> }
  | { format: 'text'; text: string };

export interface QuestionTemplate {
  id: string;
  topicId: string;
  subtopicId: string;
  type: string;
  difficulty: Difficulty;
  skills: string[];
  tags: string[];
  /** Max distinct questions this template may contribute to one session (default 1). */
  capacity?: number;
  generate(rng: () => number): GeneratedQuestion;
}

export interface QuestionAttempt {
  questionId: string;
  templateId: string;
  topicId: string;
  subtopicId: string;
  type: string;
  difficulty: Difficulty;
  correct: boolean;
  response: AnswerResponse;
  score: number;
  /** Legacy field of pre-format attempts; kept so old persisted data stays readable. */
  selectedOptionId?: string;
  timeMs: number;
  attempt: number;
  answeredAt: number;
}

export interface SessionSummary {
  score: number;
  accuracy: number;
  xp: number;
  correct: number;
  incorrect: number;
  maxStreak: number;
  avgTimeMs: number;
  bestTopics: string[];
  worstTopics: string[];
}

export interface Session {
  id: string;
  subjectId: string;
  levelId: LevelId;
  mode: GameMode;
  questions: Question[];
  attempts: QuestionAttempt[];
  startedAt: number;
  finishedAt?: number;
  summary?: SessionSummary;
}

export type MasteryBand = 'unknown' | 'weak' | 'learning' | 'good' | 'strong' | 'mastered';

export interface TopicMastery {
  topicId: string;
  score: number;
  band: MasteryBand;
  attempts: number;
  weightedCorrect: number;
  weightedTotal: number;
  lastPracticedAt?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
}

export interface UserProgress {
  subjectId: string;
  xp: number;
  playerLevel: number;
  totalSessions: number;
  currentStreak: number;
  bestStreak: number;
  lastSessionAt?: number;
  topicMastery: Record<string, TopicMastery>;
  achievements: Achievement[];
}

export interface LearningRecommendation {
  topicId: string;
  reason: string;
  kind: 'weak' | 'unexplored' | 'consolidate';
}

export interface SubjectDefinition {
  id: string;
  name: string;
  kind: SubjectKind;
  description: string;
  icon: string;
  theme: Theme;
  status: SubjectStatus;
  levels: LevelDefinition[];
  topics: Topic[];
  templates: QuestionTemplate[];
  learningObjectives: string[];
}
