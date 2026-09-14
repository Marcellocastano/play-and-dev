export interface QuestionTypeDefinition {
  id: string;
  label: string;
  requiresCode: boolean;
}

export class QuestionTypeRegistry {
  private readonly types = new Map<string, QuestionTypeDefinition>();

  register(def: QuestionTypeDefinition): void {
    if (this.types.has(def.id)) {
      throw new Error(`Question type already registered: ${def.id}`);
    }
    this.types.set(def.id, def);
  }

  get(id: string): QuestionTypeDefinition {
    const def = this.types.get(id);
    if (!def) throw new Error(`Unknown question type: ${id}`);
    return def;
  }

  has(id: string): boolean {
    return this.types.has(id);
  }

  list(): QuestionTypeDefinition[] {
    return [...this.types.values()];
  }
}

export const PHASE1_QUESTION_TYPES: QuestionTypeDefinition[] = [
  { id: 'multiple-choice', label: 'Scelta multipla', requiresCode: false },
  { id: 'predict-output', label: "Prevedi l'output", requiresCode: true },
  { id: 'find-the-bug', label: 'Trova il bug', requiresCode: true },
  { id: 'fill-the-gap', label: 'Completa il codice', requiresCode: true },
  { id: 'compare', label: 'Confronta', requiresCode: false },
  { id: 'best-method', label: 'Metodo migliore', requiresCode: false },
];

export function createDefaultQuestionTypeRegistry(): QuestionTypeRegistry {
  const registry = new QuestionTypeRegistry();
  for (const def of PHASE1_QUESTION_TYPES) registry.register(def);
  return registry;
}

export const questionTypeRegistry = createDefaultQuestionTypeRegistry();
