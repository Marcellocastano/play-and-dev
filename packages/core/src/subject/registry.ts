import type { SubjectDefinition } from '../models/index.js';

export class SubjectRegistry {
  private readonly subjects = new Map<string, SubjectDefinition>();

  register(subject: SubjectDefinition): void {
    if (this.subjects.has(subject.id)) {
      throw new Error(`Subject already registered: ${subject.id}`);
    }
    this.subjects.set(subject.id, subject);
  }

  get(id: string): SubjectDefinition {
    const subject = this.subjects.get(id);
    if (!subject) throw new Error(`Unknown subject: ${id}`);
    return subject;
  }

  has(id: string): boolean {
    return this.subjects.has(id);
  }

  list(): SubjectDefinition[] {
    return [...this.subjects.values()];
  }
}

export const subjectRegistry = new SubjectRegistry();
