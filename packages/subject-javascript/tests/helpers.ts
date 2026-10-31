import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const contentDir = join(pkgRoot, 'src', 'bank', 'content');
