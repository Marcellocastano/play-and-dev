import type { GeneratedQuestion, LearningRecommendation } from '../models/index.js';
import type {
  AIProvider,
  AnalyzeSessionRequest,
  GenerateExplanationRequest,
  GenerateQuestionRequest,
  GenerateStudyPlanRequest,
} from './provider.js';

const MOCK_QUESTION: GeneratedQuestion = {
  templateId: 'mock-template',
  type: 'multiple-choice',
  difficulty: 'easy',
  topicId: 'mock-topic',
  subtopicId: 'mock-subtopic',
  skills: ['mock'],
  prompt: 'Quale di queste è una parola chiave per dichiarare una variabile?',
  options: [
    { id: 'a', text: 'let' },
    { id: 'b', text: 'vroom' },
    { id: 'c', text: 'blarg' },
    { id: 'd', text: 'zorp' },
  ],
  correctOptionId: 'a',
  explanation: {
    short: '`let` dichiara una variabile.',
    whyCorrect: '`let` è una parola chiave del linguaggio per le variabili riscrivibili.',
    whyOthersWrong: {
      b: '"vroom" non è una parola chiave.',
      c: '"blarg" non è una parola chiave.',
      d: '"zorp" non è una parola chiave.',
    },
    concept: 'Dichiarazione di variabili',
  },
};

/** Deterministic provider for tests and offline development. */
export class MockAIProvider implements AIProvider {
  async generateQuestion(req: GenerateQuestionRequest): Promise<GeneratedQuestion> {
    return { ...MOCK_QUESTION, topicId: req.topicId, difficulty: req.difficulty };
  }

  async generateExplanation(_req: GenerateExplanationRequest): Promise<string> {
    return 'Spiegazione di esempio: controlla il concetto indicato nella domanda.';
  }

  async analyzeSession(_req: AnalyzeSessionRequest): Promise<string> {
    return 'Analisi di esempio: continua ad allenarti sui topic con accuratezza più bassa.';
  }

  async generateStudyPlan(req: GenerateStudyPlanRequest): Promise<LearningRecommendation[]> {
    return req.weakTopics.slice(0, 4).map((topicId) => ({
      topicId,
      kind: 'weak' as const,
      reason: `Suggerimento mock: ripassa "${topicId}".`,
    }));
  }
}
