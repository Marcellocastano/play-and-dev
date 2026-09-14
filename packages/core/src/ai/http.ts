import type { GeneratedQuestion, LearningRecommendation } from '../models/index.js';
import { validateAIQuestion } from './schemas.js';
import type {
  AIProvider,
  AnalyzeSessionRequest,
  GenerateExplanationRequest,
  GenerateQuestionRequest,
  GenerateStudyPlanRequest,
} from './provider.js';

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

/** Client for the apps/server AI proxy: POST {baseUrl}/api/ai/<endpoint>. */
export class HttpAIProvider implements AIProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}/api/ai/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`AI request failed: ${res.status} ${await res.text()}`);
    }
    return (await res.json()) as T;
  }

  async generateQuestion(req: GenerateQuestionRequest): Promise<GeneratedQuestion> {
    const json = await this.post<unknown>('generate-question', req);
    const result = validateAIQuestion(json);
    if (!result.ok || !result.question) {
      throw new Error(`Invalid AI question: ${result.errors.join('; ')}`);
    }
    const { id: _id, variantKey: _vk, ...generated } = result.question;
    return generated;
  }

  async generateExplanation(req: GenerateExplanationRequest): Promise<string> {
    const json = await this.post<{ explanation: string }>('explanation', req);
    return json.explanation;
  }

  async analyzeSession(req: AnalyzeSessionRequest): Promise<string> {
    const json = await this.post<{ analysis: string }>('analyze-session', req);
    return json.analysis;
  }

  async generateStudyPlan(req: GenerateStudyPlanRequest): Promise<LearningRecommendation[]> {
    const json = await this.post<{ recommendations: LearningRecommendation[] }>(
      'study-plan',
      req,
    );
    return json.recommendations;
  }
}
