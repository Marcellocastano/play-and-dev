import { fmt } from '../src/templates/helpers.js';

/** Executes the code capturing console.log lines, formatted with the same fmt convention. */
export function runCode(code: string): string {
  const lines: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => lines.push(args.map((a) => fmt(a)).join(' ')),
  };
  const fn = new Function('console', `"use strict";\n${code}`);
  try {
    fn(fakeConsole);
  } catch (err) {
    lines.push(err instanceof Error ? err.name : String(err));
  }
  return lines.join('\n');
}
