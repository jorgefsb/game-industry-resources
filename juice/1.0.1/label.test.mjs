#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const dir = dirname(fileURLToPath(import.meta.url));
const juiceJs = readFileSync(join(dir, 'juice.js'), 'utf8');
const menuJs = readFileSync(join(dir, 'juice-menu.js'), 'utf8');

function loadLinkedom() {
  const require = createRequire(import.meta.url);
  const cands = [
    'linkedom',
    join(dir, 'node_modules/linkedom/worker.cjs'),
    join(process.cwd(), 'node_modules/linkedom/worker.cjs')
  ];
  for (const spec of cands) {
    try {
      return require(spec);
    } catch (e) {}
  }
  const inst = spawnSync('npm', ['install', '--no-save', '--no-package-lock', 'linkedom'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  if (inst.status !== 0) throw new Error('label.test needs linkedom: ' + (inst.stderr || inst.stdout));
  return require('linkedom');
}

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

function boot(opts) {
  opts = opts || {};
  const { parseHTML } = loadLinkedom();
  const html = parseHTML(
    '<!doctype html><html lang="' + (opts.lang || 'es') + '"><body>' +
    '<button type="button" class="juice-sfx"></button>' +
    '</body></html>'
  );
  const window = html.window;
  const document = html.document;
  const store = new Map();
  const localStorage = {
    getItem: function (k) { return store.has(k) ? store.get(k) : null; },
    setItem: function (k, v) { store.set(String(k), String(v)); },
    removeItem: function (k) { store.delete(k); }
  };
  if (opts.sfx) localStorage.setItem('gamedev_sfx', opts.sfx);
  window.localStorage = localStorage;
  window.matchMedia = function (q) {
    return {
      matches: !!opts.reduce && String(q).indexOf('prefers-reduced-motion') >= 0,
      addEventListener: function () {},
      media: q
    };
  };
  window.requestAnimationFrame = function (fn) { return setTimeout(fn, 0); };
  window.AudioContext = function () {
    this.state = 'suspended';
    this.destination = {};
    this.createGain = function () { return { gain: { value: 0 }, connect: function () {} }; };
    this.createOscillator = function () {
      return {
        type: 'square',
        frequency: { setValueAtTime: function () {}, exponentialRampToValueAtTime: function () {} },
        connect: function () {},
        start: function () {},
        stop: function () {}
      };
    };
    this.resume = function () { this.state = 'running'; };
  };
  window.webkitAudioContext = window.AudioContext;
  try { window.navigator.vibrate = function () { return true; }; } catch (e) {}
  window.innerHeight = 800;
  window.JZ_CONFIG = {};
  const ctx = {
    window: window,
    document: document,
    localStorage: localStorage,
    matchMedia: window.matchMedia,
    requestAnimationFrame: window.requestAnimationFrame,
    AudioContext: window.AudioContext,
    webkitAudioContext: window.AudioContext,
    navigator: window.navigator,
    innerHeight: 800,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Math: Math,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Number: Number,
    String: String,
    Boolean: Boolean,
    Array: Array,
    Object: Object,
    JSON: JSON,
    Date: Date,
    Error: Error
  };
  vm.createContext(ctx);
  vm.runInContext(juiceJs + '\n' + menuJs, ctx);
  return { window: window, document: document, JZ: window.JZ };
}

function namesOf(document, sel) {
  return Array.from(document.querySelectorAll(sel)).map(function (el, i) {
    return {
      i: i,
      visible: visibleName(el),
      label: (el.getAttribute('aria-label') || '').trim(),
      pressed: el.getAttribute('aria-pressed')
    };
  });
}

test('mismatch fixture fails (the 1.0.0 bug)', () => {
  const { parseHTML } = loadLinkedom();
  const { document } = parseHTML(
    '<button type="button" class="juice-sfx" aria-label="Activar sonido">' +
    '<span class="juice-sfx__label">Sonido: no</span></button>'
  );
  assert.throws(
    () => assertNameMatch(document.querySelector('.juice-sfx'), 'ES off'),
    /visible "Sonido: no" !== aria-label "Activar sonido"/
  );
});

test('EN mismatch fixture fails', () => {
  const { parseHTML } = loadLinkedom();
  const { document } = parseHTML(
    '<button type="button" class="juice-sfx" aria-label="Turn sound on">' +
    '<span class="juice-sfx__label">Sound: off</span></button>'
  );
  assert.throws(
    () => assertNameMatch(document.querySelector('.juice-sfx'), 'EN off'),
    /visible "Sound: off" !== aria-label "Turn sound on"/
  );
});

test('sound and feel names match in ES and EN, both sound states', () => {
  const cases = [
    { lang: 'es', sfx: null, sound: 'Sonido', feel: 'Sonido y juice', pressed: 'false' },
    { lang: 'es', sfx: 'on', sound: 'Sonido', feel: 'Sonido y juice', pressed: 'true' },
    { lang: 'en', sfx: null, sound: 'Sound', feel: 'Sound and juice', pressed: 'false' },
    { lang: 'en', sfx: 'on', sound: 'Sound', feel: 'Sound and juice', pressed: 'true' }
  ];
  for (const c of cases) {
    const { document } = boot({ lang: c.lang, sfx: c.sfx });
    const sounds = document.querySelectorAll('.juice-sfx');
    assert.ok(sounds.length >= 1, c.lang + ' missing sound button');
    for (const el of sounds) {
      const name = assertNameMatch(el, c.lang + ' sound ' + c.pressed);
      assert.equal(name, c.sound);
      assert.equal(el.getAttribute('aria-pressed'), c.pressed);
    }
    const feel = document.querySelector('.jz-feel');
    const feelName = assertNameMatch(feel, c.lang + ' feel');
    assert.equal(feelName, c.feel);
    const lvl = document.querySelector('.jz-lvl');
    assertNameMatch(lvl, c.lang + ' level');
  }
});

test('language switch repaints matching labels', () => {
  const { document, JZ } = boot({ lang: 'es' });
  assert.equal(assertNameMatch(document.querySelector('.juice-sfx'), 'ES start'), 'Sonido');
  assert.equal(document.querySelector('.juice-sfx').getAttribute('aria-pressed'), 'false');
  document.documentElement.lang = 'en';
  JZ.paint();
  assert.equal(assertNameMatch(document.querySelector('.juice-sfx'), 'EN after paint'), 'Sound');
  assert.equal(assertNameMatch(document.querySelector('.jz-feel'), 'EN feel after paint'), 'Sound and juice');
  document.documentElement.lang = 'es';
  JZ.paint();
  assert.equal(assertNameMatch(document.querySelector('.juice-sfx'), 'ES after paint'), 'Sonido');
  assert.equal(assertNameMatch(document.querySelector('.jz-feel'), 'ES feel after paint'), 'Sonido y juice');
});

test('sound starts off; reduced motion turns juice off', () => {
  const off = boot({ lang: 'es' });
  assert.equal(off.document.querySelector('.juice-sfx').getAttribute('aria-pressed'), 'false');
  assert.notEqual(off.JZ.level, 'off');
  const reduced = boot({ lang: 'es', reduce: true });
  assert.equal(reduced.JZ.red(), true);
  assert.equal(reduced.JZ.level, 'off');
  assert.equal(reduced.document.documentElement.getAttribute('data-jz-level'), 'off');
});

test('exported names helper sees every painted control', () => {
  const { document } = boot({ lang: 'en', sfx: 'on' });
  const sounds = namesOf(document, '.juice-sfx');
  assert.ok(sounds.every((n) => n.visible === n.label && n.visible === 'Sound' && n.pressed === 'true'));
});
