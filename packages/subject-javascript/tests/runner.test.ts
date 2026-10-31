import { describe, expect, it } from 'vitest';
import { javascriptRunner, runCode } from '../src/runner/index.js';

describe('runCode', () => {
  it('formatta console.log come fmt', () => {
    expect(runCode("console.log(1 + 1, 'x', [1, 'a'], { k: 'v' })")).toBe(
      "2 x [ 1, 'a' ] { k: 'v' }",
    );
    expect(runCode("console.log('a'); console.log('b')")).toBe('a\nb');
  });

  it('restituisce il nome per errori runtime (altro realm)', () => {
    expect(runCode('throw new TypeError("boom")')).toBe('TypeError');
    expect(runCode('nonEsiste()')).toBe('ReferenceError');
    expect(runCode('null.x')).toBe('TypeError');
  });

  it('lancia su errori di sintassi', () => {
    expect(() => runCode('const =')).toThrow();
  });

  it('termina su loop infiniti', () => {
    const t0 = Date.now();
    const out = runCode('while (true) {}');
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(out).toBe('Error');
  });
});

describe('javascriptRunner.evalExpr', () => {
  it('valuta espressioni semplici', async () => {
    expect(await javascriptRunner.evalExpr!("'a' + 'b'")).toBe('ab');
    expect(await javascriptRunner.evalExpr!('[1, 2].length')).toBe('2');
  });

  it('restituisce null su ReferenceError', async () => {
    expect(await javascriptRunner.evalExpr!('nonEsiste')).toBeNull();
  });

  it('restituisce null su errori di sintassi', async () => {
    expect(await javascriptRunner.evalExpr!('const =')).toBeNull();
  });
});
