import type { Theme } from '@lg/core';

/** Tema JavaScript: giallo pastello su crema. */
export const javascriptTheme: Theme = {
  primary: '#F5D547',
  secondary: '#FFF3B0',
  background: '#FFFBEA',
  surface: '#FFFFFF',
  accent: '#E0B400',
  text: '#2B2B2B',
  success: '#3CB371',
  danger: '#E5533D',
  gradients: {
    hero: 'linear-gradient(135deg, #F5D547 0%, #FFF3B0 55%, #FFFBEA 100%)',
    card: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9D6 100%)',
    progress: 'linear-gradient(90deg, #E0B400 0%, #F5D547 100%)',
  },
  decor: 'radial-gradient(circle at 80% 10%, rgba(245, 213, 71, 0.25), transparent 55%)',
};
