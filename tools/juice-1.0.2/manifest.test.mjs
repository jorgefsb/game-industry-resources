#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PACK = ['juice.css', 'juice.js', 'juice-menu.css', 'juice-menu.js'];

const LEGACY_1_0_0 = {
  'juice.css': 'e4777a7ee533f48007a07c3c7e5e2d530fcda8d2182d731273a80e3436ddbe2a',
  'juice.js': 'bcae1e5c22e62bcd1f48f06b4f8e1a1618587e73a83d4c8d33ad2a673cf441a8',
  'juice-menu.css': '969ad17347eae57bff9b4b2b8bb8c126c36d8d5e34b390ca7ef32ec489faaed1',
  'juice-menu.js': 'a7e13fd899812ef759532225dc839676144f34bb7140309d8cce5e6ad4acc03f'
};

function sha256file(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function expectedHashes(dir) {
  const manPath = join(dir, 'manifest.json');
  if (existsSync(manPath)) {
    const man = JSON.parse(readFileSync(manPath, 'utf8'));
    assert.ok(man.files, manPath + ' missing files');
    return Object.fromEntries(PACK.map((name) => {
      const want = man.files[name] && man.files[name].sha256;
      assert.ok(want, manPath + ' missing sha256 for ' + name);
      return [name, want];
    }));
  }
  return null;
}

for (const ver of ['1.0.0', '1.0.1', '1.0.2']) {
  const dir = join(root, 'juice', ver);
  test('juice/' + ver + ' sha256 matches manifest', () => {
    const want = expectedHashes(dir) || (ver === '1.0.0' ? LEGACY_1_0_0 : null);
    assert.ok(want, 'juice/' + ver + ' has no manifest.json and no legacy pin');
    for (const name of PACK) {
      const got = sha256file(join(dir, name));
      assert.equal(got, want[name], ver + '/' + name);
    }
  });
}
