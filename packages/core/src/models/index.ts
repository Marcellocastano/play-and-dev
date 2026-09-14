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

export interface QuestionExplanation {
  short: string;
  whyCorrect: string;
  whyOthersWrong: Record<string, string>;
  concept: string;
  commonMistake?: string;
  example?: string;
}

export interface Question {
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
  options: Option[];
  correctOptionId: string;
  explanation: QuestionExplanation;
  deepDiveRef?: string;
}

/** A Question before engine-level fields (id, variantKey) are assigned. */
export type GeneratedQuestion = Omit<Question, 'id' | 'variantKey'>;

export interface QuestionTemplate {
  id: string;
  topicId: string;
  subtopicId: string;
  type: string;
  difficulty: Difficulty;
  skills: string[];
  tags: string[];
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
  selectedOptionId: string;
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
