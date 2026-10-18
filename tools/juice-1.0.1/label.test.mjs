#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { chromePath, loadChromium, packDir, skipNoChromium } from './browser.mjs';

export function visibleName(el) {
  function walk(node) {
    if (!node) return '';
    if (node.nodeType === 3) return node.textContent || '';
    if (node.nodeType !== 1) return '';
    if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') return '';
    return Array.from(node.childNodes || []).map(walk).join('');
  }
  return walk(el).replace(/\s+/g, ' ').trim();
}

export function assertNameMatch(el, where) {
  if (!el) throw new Error(where + ': missing element');
  const visible = visibleName(el);
  const label = (el.getAttribute('aria-label') || '').trim();
  if (!visible) throw new Error(where + ': visible text is empty');
  if (!label) throw new Error(where + ': aria-label is empty');
  if (visible !== label) {
    throw new Error(where + ': visible "' + visible + '" !== aria-label "' + label + '"');
  }
  return visible;
}

function fakeButton(visible, label) {
  const text = { nodeType: 3, textContent: visible };
  return {
    nodeType: 1,
    childNodes: [text],
    getAttribute: function (name) {
      if (name === 'aria-label') return label;
      return null;
    }
  };
}

test('mismatch fixture fails (the 1.0.0 bug)', () => {
  assert.throws(
    () => assertNameMatch(fakeButton('Sonido: no', 'Activar sonido'), 'ES off'),
    /visible "Sonido: no" !== aria-label "Activar sonido"/
  );
});

test('EN mismatch fixture fails', () => {
  assert.throws(
    () => assertNameMatch(fakeButton('Sound: off', 'Turn sound on'), 'EN off'),
    /visible "Sound: off" !== aria-label "Turn sound on"/
  );
});

const chromium = await loadChromium();
const exe = chromePath();
const noChromium = skipNoChromium(chromium, exe, 'label.test');
if (noChromium) console.warn(noChromium);
const browserOpts = noChromium ? { skip: noChromium } : {};

const juiceJs = readFileSync(join(packDir, 'juice.js'), 'utf8');
const menuJs = readFileSync(join(packDir, 'juice-menu.js'), 'utf8');

async function withPage(opts, fn) {
  const browser = await chromium.launch({ headless: true, executablePath: exe });
  try {
    const page = await browser.newPage();
    await page.addInitScript((boot) => {
      try {
        if (boot.sfx) localStorage.setItem('gamedev_sfx', boot.sfx);
        else localStorage.removeItem('gamedev_sfx');
      } catch (e) {}
    }, { sfx: opts.sfx || null });
    if (opts.reduce) await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setContent(
      '<!doctype html><html lang="' + (opts.lang || 'es') + '"><body>' +
      '<button type="button" class="juice-sfx"></button>' +
      '<script>' + juiceJs + '</script><script>' + menuJs + '</script></body></html>'
    );
    await page.waitForFunction(() => window.JZ);
    return await fn(page);
  } finally {
    await browser.close();
  }
}

const readNames = () => {
  function vis(el) {
    function walk(node) {
      if (!node) return '';
      if (node.nodeType === 3) return node.textContent || '';
      if (node.nodeType !== 1) return '';
      if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') return '';
      return Array.from(node.childNodes || []).map(walk).join('');
    }
    return walk(el).replace(/\s+/g, ' ').trim();
  }
  function pack(el) {
    if (!el) return null;
    return {
      visible: vis(el),
      label: (el.getAttribute('aria-label') || '').trim(),
      pressed: el.getAttribute('aria-pressed')
    };
  }
  return {
    sounds: Array.from(document.querySelectorAll('.juice-sfx')).map(pack),
    feel: pack(document.querySelector('.jz-feel')),
    lvl: pack(document.querySelector('.jz-lvl')),
    level: window.JZ.level,
    red: window.JZ.red(),
    jzLevel: document.documentElement.getAttribute('data-jz-level')
  };
};

test('sound and feel names match in ES and EN, both sound states', browserOpts, async () => {
  const cases = [
    { lang: 'es', sfx: null, sound: 'Sonido', feel: 'Sonido y juice', pressed: 'false' },
    { lang: 'es', sfx: 'on', sound: 'Sonido', feel: 'Sonido y juice', pressed: 'true' },
    { lang: 'en', sfx: null, sound: 'Sound', feel: 'Sound and juice', pressed: 'false' },
    { lang: 'en', sfx: 'on', sound: 'Sound', feel: 'Sound and juice', pressed: 'true' }
  ];
  for (const c of cases) {
    const names = await withPage({ lang: c.lang, sfx: c.sfx }, async (page) => {
      if (c.sfx === 'on') await page.locator('.juice-sfx').first().click();
      return page.evaluate(readNames);
    });
    assert.ok(names.sounds.length >= 1, c.lang + ' missing sound button');
    for (const el of names.sounds) {
      assert.equal(el.visible, el.label, c.lang + ' sound visible !== aria-label');
      assert.equal(el.visible, c.sound);
      assert.equal(el.pressed, c.pressed);
    }
    assert.equal(names.feel.visible, names.feel.label, c.lang + ' feel visible !== aria-label');
    assert.equal(names.feel.visible, c.feel);
    assert.equal(names.lvl.visible, names.lvl.label, c.lang + ' level visible !== aria-label');
  }
});

test('language switch repaints matching labels', browserOpts, async () => {
  const after = await withPage({ lang: 'es' }, async (page) => {
    const start = await page.evaluate(readNames);
    await page.evaluate(() => {
      document.documentElement.lang = 'en';
      JZ.paint();
    });
    const en = await page.evaluate(readNames);
    await page.evaluate(() => {
      document.documentElement.lang = 'es';
      JZ.paint();
    });
    const es = await page.evaluate(readNames);
    return { start, en, es };
  });
  assert.equal(after.start.sounds[0].visible, 'Sonido');
  assert.equal(after.start.sounds[0].label, 'Sonido');
  assert.equal(after.start.sounds[0].pressed, 'false');
  assert.equal(after.en.sounds[0].visible, after.en.sounds[0].label);
  assert.equal(after.en.sounds[0].visible, 'Sound');
  assert.equal(after.en.feel.visible, after.en.feel.label);
  assert.equal(after.en.feel.visible, 'Sound and juice');
  assert.equal(after.es.sounds[0].visible, 'Sonido');
  assert.equal(after.es.feel.visible, 'Sonido y juice');
});

test('sound starts off; reduced motion turns juice off', browserOpts, async () => {
  const off = await withPage({ lang: 'es' }, (page) => page.evaluate(readNames));
  assert.equal(off.sounds[0].pressed, 'false');
  assert.notEqual(off.level, 'off');
  const reduced = await withPage({ lang: 'es', reduce: true }, (page) => page.evaluate(readNames));
  assert.equal(reduced.red, true);
  assert.equal(reduced.level, 'off');
  assert.equal(reduced.jzLevel, 'off');
});
