import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { JSONFilePreset } from 'lowdb/node';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const db = await JSONFilePreset(join(__dirname, '..', 'config.json'), { proxies: [] });
