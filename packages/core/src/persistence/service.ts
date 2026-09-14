import type { QuestionAttempt, Session, UserProgress } from '../models/index.js';
import type { QuestionHistoryEntry } from '../question/antiDup.js';

export interface PersistedUser {
  id: string;
  name: string;
  createdAt: number;
}

export interface PersistenceService {
  saveUser(user: PersistedUser): Promise<void>;
  getUser(id: string): Promise<PersistedUser | undefined>;
  saveSession(session: Session): Promise<void>;
  getSessions(subjectId?: string): Promise<Session[]>;
  saveAnswer(sessionId: string, attempt: QuestionAttempt): Promise<void>;
  getProgress(subjectId: string): Promise<UserProgress | undefined>;
  saveProgress(progress: UserProgress): Promise<void>;
  getQuestionHistory(subjectId: string): Promise<QuestionHistoryEntry[]>;
  appendQuestionHistory(subjectId: string, entries: QuestionHistoryEntry[]): Promise<void>;
}
