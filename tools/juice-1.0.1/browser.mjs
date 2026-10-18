import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const packDir = join(here, '../../juice/1.0.1');

export function chromePath() {
  const cands = [
    process.env.CHROME_PATH,
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const p of cands) if (p && existsSync(p)) return p;
}

export async function loadChromium() {
  const cands = [
    'playwright',
    join(process.cwd(), 'node_modules/playwright/index.js'),
    join(here, '../../node_modules/playwright/index.js'),
    join(here, 'node_modules/playwright/index.js')
  ];
  for (const spec of cands) {
    try {
      const href = spec.includes('/') ? pathToFileURL(spec).href : spec;
      const mod = await import(href);
      if (mod.chromium) return mod.chromium;
    } catch (e) {}
  }
  return null;
}

export function skipNoChromium(chromium, exe, who) {
  if (chromium && exe) return '';
  return who + ': no chromium - skipped';
}
