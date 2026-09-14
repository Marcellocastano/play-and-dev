import { emptyProgress, type UserProgress } from '@lg/core';
import { create } from 'zustand';
import { persistence } from '../services/LocalStoragePersistence';

interface ProgressState {
  bySubject: Record<string, UserProgress>;
  loaded: boolean;
  loadAll(subjectIds: string[]): Promise<void>;
  progressFor(subjectId: string): UserProgress;
  setProgress(progress: UserProgress): void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  bySubject: {},
  loaded: false,

  async loadAll(subjectIds) {
    const entries = await Promise.all(
      subjectIds.map(async (id) => [id, (await persistence.getProgress(id)) ?? emptyProgress(id)] as const),
    );
    set({ bySubject: Object.fromEntries(entries), loaded: true });
  },

  progressFor(subjectId) {
    return get().bySubject[subjectId] ?? emptyProgress(subjectId);
  },

  setProgress(progress) {
    set((s) => ({ bySubject: { ...s.bySubject, [progress.subjectId]: progress } }));
    void persistence.saveProgress(progress);
  },
}));
