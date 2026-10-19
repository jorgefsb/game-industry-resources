#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const PIN = {
  'juice.css': 'e4777a7ee533f48007a07c3c7e5e2d530fcda8d2182d731273a80e3436ddbe2a',
  'juice.js': 'bcae1e5c22e62bcd1f48f06b4f8e1a1618587e73a83d4c8d33ad2a673cf441a8',
  'juice-menu.css': '969ad17347eae57bff9b4b2b8bb8c126c36d8d5e34b390ca7ef32ec489faaed1',
  'juice-menu.js': 'a7e13fd899812ef759532225dc839676144f34bb7140309d8cce5e6ad4acc03f'
};

const root = join(dirname(fileURLToPath(import.meta.url)), '../../juice/1.0.0');

for (const [name, want] of Object.entries(PIN)) {
  test('juice/1.0.0/' + name + ' sha256 stays pinned', () => {
    const got = createHash('sha256').update(readFileSync(join(root, name))).digest('hex');
    assert.equal(got, want);
  });
}
