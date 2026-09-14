import type { QuestionAttempt, Session, UserProgress } from '../models/index.js';
import type { QuestionHistoryEntry } from '../question/antiDup.js';
import type { PersistenceService, PersistedUser } from './service.js';

export class InMemoryPersistence implements PersistenceService {
  private users = new Map<string, PersistedUser>();
  private sessions = new Map<string, Session>();
  private answers = new Map<string, QuestionAttempt[]>();
  private progress = new Map<string, UserProgress>();
  private history = new Map<string, QuestionHistoryEntry[]>();

  async saveUser(user: PersistedUser): Promise<void> {
    this.users.set(user.id, user);
  }

  async getUser(id: string): Promise<PersistedUser | undefined> {
    return this.users.get(id);
  }

  async saveSession(session: Session): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async getSessions(subjectId?: string): Promise<Session[]> {
    const all = [...this.sessions.values()];
    return subjectId === undefined ? all : all.filter((s) => s.subjectId === subjectId);
  }

  async saveAnswer(sessionId: string, attempt: QuestionAttempt): Promise<void> {
    const list = this.answers.get(sessionId) ?? [];
    list.push(attempt);
    this.answers.set(sessionId, list);
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.set(sessionId, { ...session, attempts: [...session.attempts, attempt] });
    }
  }

  async getProgress(subjectId: string): Promise<UserProgress | undefined> {
    return this.progress.get(subjectId);
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    this.progress.set(progress.subjectId, progress);
  }

  async getQuestionHistory(subjectId: string): Promise<QuestionHistoryEntry[]> {
    return this.history.get(subjectId) ?? [];
  }

  async appendQuestionHistory(
    subjectId: string,
    entries: QuestionHistoryEntry[],
  ): Promise<void> {
    const list = this.history.get(subjectId) ?? [];
    this.history.set(subjectId, [...list, ...entries]);
  }
}
