import type { SubjectDefinition } from '@lg/core';
import { javascriptSubject } from '@lg/subject-javascript';
import { placeholderSubjects } from '@lg/subject-placeholders';
import { create } from 'zustand';

interface SubjectState {
  subjects: SubjectDefinition[];
  currentSubjectId: string | null;
  selectSubject(id: string | null): void;
  getSubject(id: string): SubjectDefinition | undefined;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [javascriptSubject, ...placeholderSubjects],
  currentSubjectId: null,
  selectSubject: (id) => set({ currentSubjectId: id }),
  getSubject: (id) => get().subjects.find((s) => s.id === id),
}));

export function getSubjectById(id: string): SubjectDefinition | undefined {
  return useSubjectStore.getState().subjects.find((s) => s.id === id);
}
