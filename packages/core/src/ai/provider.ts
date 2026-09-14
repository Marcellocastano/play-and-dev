import type {
  GeneratedQuestion,
  LearningRecommendation,
  Question,
  Session,
  SessionSummary,
} from '../models/index.js';

export interface GenerateQuestionRequest {
  subjectId: string;
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type?: string;
}

export interface GenerateExplanationRequest {
  question: Question;
  selectedOptionId: string;
}

export interface AnalyzeSessionRequest {
  session: Session;
  summary: SessionSummary;
}

export interface GenerateStudyPlanRequest {
  subjectId: string;
  levelId: string;
  weakTopics: string[];
}

export interface AIProvider {
  generateQuestion(req: GenerateQuestionRequest): Promise<GeneratedQuestion>;
  generateExplanation(req: GenerateExplanationRequest): Promise<string>;
  analyzeSession(req: AnalyzeSessionRequest): Promise<string>;
  generateStudyPlan(req: GenerateStudyPlanRequest): Promise<LearningRecommendation[]>;
}
