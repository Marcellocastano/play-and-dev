import {
  applyAnswer,
  composeSession,
  summarizeSession,
  updateProgressAfterSession,
  xpForAttempt,
  type GameMode,
  type LevelId,
  type Question,
  type QuestionAttempt,
  type QuestionHistoryEntry,
  type Session,
} from '@lg/core';
import { create } from 'zustand';
import { persistence } from '../services/LocalStoragePersistence';
import { getSubjectById } from './subjectStore';
import { useProgressStore } from './progressStore';

interface SessionState {
  session: Session | null;
  index: number;
  answered: QuestionAttempt | null;
  questionStartedAt: number;
  lastXp: number;
  finishing: boolean;

  current(): Question | undefined;
  start(subjectId: string, levelId: LevelId, mode: GameMode, weightedToWeak?: boolean): Promise<void>;
  answer(optionId: string): void;
  next(): void;
  finish(): Promise<Session>;
}

function currentStreak(attempts: readonly QuestionAttempt[]): number {
  let s = 0;
  for (let i = attempts.length - 1; i >= 0 && attempts[i]!.correct; i--) s++;
  return s;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  index: 0,
  answered: null,
  questionStartedAt: 0,
  lastXp: 0,
  finishing: false,

  current() {
    return get().session?.questions[get().index];
  },

  async start(subjectId, levelId, mode, weightedToWeak = false) {
    const subject = getSubjectById(subjectId);
    if (!subject) throw new Error(`Subject sconosciuto: ${subjectId}`);
    const history = await persistence.getQuestionHistory(subjectId);
    const progressStore = useProgressStore.getState();
    const progress = progressStore.progressFor(subjectId);
    const session = composeSession({
      subject,
      levelId,
      mode,
      history,
      seed: Date.now(),
      progress: weightedToWeak ? progress : undefined,
    });
    set({ session, index: 0, answered: null, questionStartedAt: Date.now(), lastXp: 0 });
  },

  answer(optionId) {
    const { session, index, answered, questionStartedAt } = get();
    const q = session?.questions[index];
    if (!session || !q || answered) return;
    const attempt: QuestionAttempt = {
      questionId: q.id,
      templateId: q.templateId,
      topicId: q.topicId,
      subtopicId: q.subtopicId,
      type: q.type,
      difficulty: q.difficulty,
      correct: optionId === q.correctOptionId,
      selectedOptionId: optionId,
      timeMs: Date.now() - questionStartedAt,
      attempt: 1,
      answeredAt: Date.now(),
    };
    const streak = currentStreak(session.attempts);
    set({
      session: applyAnswer(session, attempt),
      answered: attempt,
      lastXp: xpForAttempt(attempt, streak),
    });
    void persistence.saveAnswer(session.id, attempt);
  },

  next() {
    const { session, index } = get();
    if (!session) return;
    if (index + 1 >= session.questions.length) {
      void get().finish();
      return;
    }
    set({ index: index + 1, answered: null, questionStartedAt: Date.now(), lastXp: 0 });
  },

  async finish() {
    const { session, finishing } = get();
    if (!session || finishing) return session!;
    set({ finishing: true });
    const finished: Session = {
      ...session,
      finishedAt: Date.now(),
      summary: summarizeSession(session),
    };
    const subject = getSubjectById(finished.subjectId);
    const progressStore = useProgressStore.getState();
    const prev = progressStore.progressFor(finished.subjectId);
    const next = updateProgressAfterSession(prev, finished, subject!);

    const historyEntries: QuestionHistoryEntry[] = finished.questions.map((q) => ({
      templateId: q.templateId,
      variantKey: q.variantKey,
      sessionId: finished.id,
      answeredAt: finished.finishedAt!,
    }));

    await Promise.all([
      persistence.saveSession(finished),
      persistence.appendQuestionHistory(finished.subjectId, historyEntries),
      persistence.saveProgress(next),
    ]);
    set({ session: finished, finishing: false });
    progressStore.setProgress(next);
    return finished;
  },
}));
