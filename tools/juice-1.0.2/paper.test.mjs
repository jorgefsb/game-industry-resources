#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const pack = join(dirname(fileURLToPath(import.meta.url)), '../../juice/1.0.2');
const FILES = ['juice.css', 'juice.js', 'juice-menu.css', 'juice-menu.js'];
const PAPER = '#F4E8D5';
const asColor = /(?:^|[;{\s])color\s*:\s*#F4E8D5\b/i;

test('detector fails when #F4E8D5 is used as color', () => {
  assert.equal(asColor.test('.jz-panel{background:#161616;color:#F4E8D5}'), true);
  assert.equal(asColor.test('.jz-ripple{background:#F4E8D5}'), false);
});

test('1.0.2 published files must not use #F4E8D5 as color (text)', () => {
  for (const name of FILES) {
    const src = readFileSync(join(pack, name), 'utf8');
    assert.equal(asColor.test(src), false, name + ' uses ' + PAPER + ' as color');
  }
});

test('1.0.2 .jz-panel text on #161616 uses on-dark / muted tokens', () => {
  const css = readFileSync(join(pack, 'juice-menu.css'), 'utf8');
  assert.match(css, /\.jz-panel\{[^}]*background:#161616/);
  assert.match(css, /\.jz-panel\{[^}]*color:var\(--brand-text-on-dark,#FFFFFF\)/);
  assert.match(css, /\.jz-panel__note\{[^}]*color:var\(--brand-text-muted,#B7B3AD\)/);
  assert.doesNotMatch(css, /\.jz-panel\{[^}]*color:#F4E8D5/);
});
