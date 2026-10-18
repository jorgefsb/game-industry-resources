import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const packDir = join(here, '../../juice/1.0.1');

const MAC_APPS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'
];

const LINUX_BINS = [
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
];

function firstExisting(paths) {
  for (const p of paths) if (p && existsSync(p)) return p;
}

function playwrightCacheRoots() {
  const home = homedir();
  const extra = process.env.PLAYWRIGHT_BROWSERS_PATH;
  return [
    extra,
    join(home, 'Library/Caches/ms-playwright'),
    join(home, '.cache/ms-playwright'),
    join(home, 'AppData/Local/ms-playwright')
  ].filter(Boolean);
}

function chromeInPlaywrightCache() {
  const names = [
    'chrome-linux/chrome',
    'chrome-linux64/chrome',
    'chrome-headless-shell/chrome-headless-shell',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    'chrome-mac-x64/Chromium.app/Contents/MacOS/Chromium',
    'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium',
    'chrome-win/chrome.exe',
    'chrome-win64/chrome.exe'
  ];
  for (const root of playwrightCacheRoots()) {
    if (!existsSync(root)) continue;
    let kids = [];
    try { kids = readdirSync(root); } catch (e) { continue; }
    for (const kid of kids) {
      if (!String(kid).startsWith('chromium')) continue;
      for (const rel of names) {
        const p = join(root, kid, rel);
        if (existsSync(p)) return p;
      }
    }
  }
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

export async function chromePath(chromium) {
  const env = process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  if (chromium) {
    try {
      const bundled = chromium.executablePath();
      if (bundled && existsSync(bundled)) return bundled;
    } catch (e) {}
  }
  return firstExisting(LINUX_BINS) || firstExisting(MAC_APPS) || chromeInPlaywrightCache();
}

export async function requireBrowser(who) {
  const chromium = await loadChromium();
  const exe = await chromePath(chromium);
  if (chromium && exe) return { chromium, exe };
  const msg = (who || 'test') + ': no chromium. Run npm run test:install';
  console.error(msg);
  process.exitCode = 1;
  throw new Error(msg);
}

export function readyMarkup() {
  return (
    '<script>' +
    'document.documentElement.setAttribute("data-jz-ready","1");' +
    'document.dispatchEvent(new CustomEvent("jz-ready"));' +
    '</script>'
  );
}

export async function waitJzReady(page) {
  await page.waitForFunction(() => (
    window.JZ && document.documentElement.getAttribute('data-jz-ready') === '1'
  ));
  await page.evaluate(() => { window.__vib = []; });
}

export async function tapSelector(page, selector) {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error('tapSelector: missing ' + selector);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error('tapSelector: no element ' + sel);
    window.__jzClickWait = new Promise((resolve) => {
      el.addEventListener('click', () => { setTimeout(resolve, 0); }, { once: true });
    });
  }, selector);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await page.evaluate(() => window.__jzClickWait);
}

export async function armIdle(page, eventType) {
  await page.evaluate((type) => {
    window.__jzIdleWait = new Promise((resolve) => {
      window.addEventListener(type, () => { setTimeout(resolve, 0); }, { once: true });
    });
  }, eventType);
}

export async function waitIdle(page) {
  await page.evaluate(() => window.__jzIdleWait);
}