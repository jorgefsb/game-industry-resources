#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  ({ chromium } = await import('/home/ubuntu/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js'));
}

const juice = readFileSync(join(dir, 'juice.js'), 'utf8');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || '/usr/local/bin/google-chrome'
});
const page = await browser.newPage();
await page.addInitScript(() => {
  try { localStorage.setItem('jz-level', 'full'); } catch (e) {}
});
await page.setContent(
  '<!doctype html><html lang="es"><body>' +
  '<button type="button" class="btn btn--primary" data-jz="jz-tap" id="t">Tap</button>' +
  '<script>' + juice + '</script></body></html>'
);
await page.waitForFunction(() => window.JZ);

const result = await page.evaluate(async () => {
  const calls = [];
  navigator.vibrate = function (p) { calls.push(p); return true; };
  JZ.setLevel('full');
  const b = document.getElementById('t');
  b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
  await new Promise(function (r) { setTimeout(r, 80); });
  b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
  b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const afterTap = calls.slice();
  JZ.setLevel('off');
  calls.length = 0;
  b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
  await new Promise(function (r) { setTimeout(r, 80); });
  b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
  b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  return { tap: afterTap, off: calls.slice() };
});

await browser.close();
if (!result.tap.length) {
  throw new Error('haptics did not fire after pointerdown + 80ms + pointerup + click');
}
if (result.off.length) {
  throw new Error('haptics fired in Off');
}
console.log('ok hap', JSON.stringify(result.tap));
