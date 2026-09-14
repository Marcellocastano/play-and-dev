import { HttpAIProvider } from '@lg/core';

/**
 * Proxy AI sullo stesso origin: in dev Vite gira /api → http://localhost:8787.
 * Se il server non risponde, i chiamanti fanno fallback silenzioso.
 */
export const aiClient = new HttpAIProvider('');
