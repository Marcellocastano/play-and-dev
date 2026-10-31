import { Script, createContext } from 'node:vm';
import type { CodeRunner } from '@lg/content-pipeline';
import { fmt } from '../templates/helpers.js';

const TIMEOUT_MS = 1000;

/**
 * Executes JavaScript with a fake `console.log` formatted like Node's, in a fresh VM
 * context with a timeout. Syntax errors throw (invalid code); runtime errors yield the
 * error name as output, like a real program would report. Node-only: never import from
 * `src/index.ts` (web bundle).
 */
export function runCode(code: string): string {
  const lines: string[] = [];
  const console = { log: (...args: unknown[]) => lines.push(args.map((a) => fmt(a)).join(' ')) };
  const script = new Script(`"use strict";\n${code}`);
  try {
    script.runInContext(createContext({ console }), { timeout: TIMEOUT_MS });
  } catch (err) {
    // gli errori del contesto vm arrivano da un altro realm: instanceof Error fallisce
    const name =
      typeof err === 'object' && err !== null && typeof (err as Error).name === 'string'
        ? (err as Error).name
        : String(err);
    lines.push(name);
  }
  return lines.join('\n');
}

export const javascriptRunner: CodeRunner = {
  lang: 'javascript',
  async run(code) {
    return runCode(code);
  },
  async evalExpr(expr) {
    try {
      const out = runCode(`console.log(${expr})`);
      return out === 'ReferenceError' ? null : out;
    } catch {
      return null;
    }
  },
};
