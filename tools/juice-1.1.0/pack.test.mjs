#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../../juice/1.1.0');
const man = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const sha = (p) => createHash('sha256').update(readFileSync(join(dir, p))).digest('hex');

test('juice/1.1.0 sha256 matches manifest', () => {
  assert.equal(man.version, '1.1.0');
  for (const [name, { sha256 }] of Object.entries(man.files)) assert.equal(sha(name), sha256, name);
});

test('labels: Juega/Play with Nada, Poquito, Mucho', () => {
  const js = readFileSync(join(dir, 'juice.js'), 'utf8');
  for (const w of ['Nada', 'Poquito', 'Mucho', 'Juega', 'None', 'A little', 'A lot', 'Play']) assert.ok(js.includes("'" + w + "'") || js.includes('"' + w + '"'), w);
  assert.ok(!/"Juice"|'Juice'/.test(js), 'no Juice label');
});

test('paper is never text color in published CSS', () => {
  for (const f of ['juice.css', 'juice-menu.css', 'moki/moki.css']) {
    const css = readFileSync(join(dir, f), 'utf8');
    assert.ok(!/(^|[;{])color:(var\([^)]*,)?#F4E8D5/i.test(css), f);
  }
});
