import type { SubjectDefinition, Theme } from '@lg/core';

function theme(partial: Pick<Theme, 'primary' | 'secondary' | 'accent'>): Theme {
  return {
    background: '#FAFAF7',
    surface: '#FFFFFF',
    text: '#2B2B2B',
    success: '#3CB371',
    danger: '#E5533D',
    gradients: {
      hero: `linear-gradient(135deg, ${partial.primary} 0%, ${partial.secondary} 60%, #FFFFFF 100%)`,
      card: `linear-gradient(180deg, #FFFFFF 0%, ${partial.secondary} 140%)`,
      progress: `linear-gradient(90deg, ${partial.accent} 0%, ${partial.primary} 100%)`,
    },
    ...partial,
  };
}

export const vueSubject: SubjectDefinition = {
  id: 'vue',
  name: 'Vue',
  kind: 'framework',
  description: 'Il framework progressivo per interfacce web.',
  icon: 'Vue',
  theme: theme({ primary: '#7FD8A4', secondary: '#D9F5E5', accent: '#41B883' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const reactSubject: SubjectDefinition = {
  id: 'react',
  name: 'React',
  kind: 'framework',
  description: 'La libreria per costruire UI a componenti.',
  icon: 'React',
  theme: theme({ primary: '#9ADCF5', secondary: '#DFF4FB', accent: '#61DAFB' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const angularSubject: SubjectDefinition = {
  id: 'angular',
  name: 'Angular',
  kind: 'framework',
  description: 'Il framework completo per applicazioni web.',
  icon: 'Ng',
  theme: theme({ primary: '#F5A8A0', secondary: '#FBE3E0', accent: '#DD0031' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const typescriptSubject: SubjectDefinition = {
  id: 'typescript',
  name: 'TypeScript',
  kind: 'language',
  description: 'JavaScript con i tipi statici.',
  icon: 'TS',
  theme: theme({ primary: '#9DB8F0', secondary: '#E3EBFB', accent: '#3178C6' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const nodejsSubject: SubjectDefinition = {
  id: 'nodejs',
  name: 'Node.js',
  kind: 'runtime',
  description: 'JavaScript lato server.',
  icon: 'Node',
  theme: theme({ primary: '#8FBF9F', secondary: '#DFEEE4', accent: '#3C873A' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const pythonSubject: SubjectDefinition = {
  id: 'python',
  name: 'Python',
  kind: 'language',
  description: 'Il linguaggio versatile per dati, web e automazione.',
  icon: 'Py',
  theme: theme({ primary: '#A9BCE8', secondary: '#EAF0FA', accent: '#3776AB' }),
  status: 'coming-soon',
  levels: [],
  topics: [],
  templates: [],
  learningObjectives: [],
};

export const placeholderSubjects: SubjectDefinition[] = [
  vueSubject,
  reactSubject,
  angularSubject,
  typescriptSubject,
  nodejsSubject,
  pythonSubject,
];
