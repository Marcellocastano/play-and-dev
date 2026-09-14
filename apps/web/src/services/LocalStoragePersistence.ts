import type {
  PersistenceService,
  PersistedUser,
  QuestionAttempt,
  QuestionHistoryEntry,
  Session,
  UserProgress,
} from '@lg/core';

const PREFIX = 'lg:v1:';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

/** PersistenceService su localStorage, namespace `lg:v1:`. */
export class LocalStoragePersistence implements PersistenceService {
  async saveUser(user: PersistedUser): Promise<void> {
    writeJson(`user:${user.id}`, user);
  }

  async getUser(id: string): Promise<PersistedUser | undefined> {
    return readJson<PersistedUser | undefined>(`user:${id}`, undefined);
  }

  async saveSession(session: Session): Promise<void> {
    const sessions = readJson<Session[]>('sessions', []);
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) sessions[idx] = session;
    else sessions.push(session);
    writeJson('sessions', sessions);
  }

  async getSessions(subjectId?: string): Promise<Session[]> {
    const sessions = readJson<Session[]>('sessions', []);
    return subjectId ? sessions.filter((s) => s.subjectId === subjectId) : sessions;
  }

  async saveAnswer(sessionId: string, attempt: QuestionAttempt): Promise<void> {
    const answers = readJson<Record<string, QuestionAttempt[]>>('answers', {});
    (answers[sessionId] ??= []).push(attempt);
    writeJson('answers', answers);
  }

  async getProgress(subjectId: string): Promise<UserProgress | undefined> {
    return readJson<UserProgress | undefined>(`progress:${subjectId}`, undefined);
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    writeJson(`progress:${progress.subjectId}`, progress);
  }

  async getQuestionHistory(subjectId: string): Promise<QuestionHistoryEntry[]> {
    return readJson<QuestionHistoryEntry[]>(`history:${subjectId}`, []);
  }

  async appendQuestionHistory(
    subjectId: string,
    entries: QuestionHistoryEntry[],
  ): Promise<void> {
    const history = await this.getQuestionHistory(subjectId);
    writeJson(`history:${subjectId}`, [...history, ...entries]);
  }
}

export const persistence = new LocalStoragePersistence();
