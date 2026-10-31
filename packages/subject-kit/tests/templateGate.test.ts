import { describe, expect, it } from 'vitest';
import { format, resolveConfig } from 'prettier';
import { prettierRejectReason } from '../src/node/templateIO.js';
import { correctionMessage } from '../src/node/templatePrompt.js';

const BROKEN = `const a = {\n  x: 1\n  y: 2\n};\n`;

describe('prettierRejectReason', () => {
  it('riporta la riga del codice grezzo che causa l’errore', async () => {
    let reason = '';
    try {
      const config = await resolveConfig('x.ts');
      await format(BROKEN, { ...config, filepath: 'x.ts' });
    } catch (err) {
      reason = prettierRejectReason(err, BROKEN);
    }
    expect(reason).toContain('prettier:');
    expect(reason).toContain('→ y: 2');
  });

  it('ripiega sulla regex del messaggio se manca loc', () => {
    const err = new Error("',' expected. (3:10)");
    const reason = prettierRejectReason(err, BROKEN);
    expect(reason).toContain('→ y: 2');
  });
});

describe('correctionMessage', () => {
  it('numera le righe e chiede il file senza numeri', () => {
    const msg = correctionMessage('const a = 1;\nconst b = 2;', ['tsc: x(2,1): errore']);
    expect(msg).toContain('   2| const b = 2;');
    expect(msg).toContain('SENZA numeri di riga');
  });
});
