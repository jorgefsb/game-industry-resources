#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const PIN = {
  'juice/1.0.0': {
    'juice.css': 'e4777a7ee533f48007a07c3c7e5e2d530fcda8d2182d731273a80e3436ddbe2a',
    'juice.js': 'bcae1e5c22e62bcd1f48f06b4f8e1a1618587e73a83d4c8d33ad2a673cf441a8',
    'juice-menu.css': '969ad17347eae57bff9b4b2b8bb8c126c36d8d5e34b390ca7ef32ec489faaed1',
    'juice-menu.js': 'a7e13fd899812ef759532225dc839676144f34bb7140309d8cce5e6ad4acc03f'
  },
  'juice/1.0.1': {
    'juice.css': '2d02b3e2d968cd5afe9b6174979255b97aa7ad8793c682273a85976f06058981',
    'juice.js': '03d7702ea203f4b817cef606ab982fa481da4bb0e7ec427ae513323218915bef',
    'juice-menu.css': '3e4dcb2ccd833171eb6358bc9e337dc993c5c5fbf28aacd1672de3d6065c42d3',
    'juice-menu.js': '2dfad631d1043dac50740485ce55d4c0d12b1e204f94bc07081b8cd822404917'
  }
};

for (const [dir, files] of Object.entries(PIN)) {
  for (const [name, want] of Object.entries(files)) {
    test(dir + '/' + name + ' sha256 stays pinned', () => {
      const got = createHash('sha256').update(readFileSync(join(root, dir, name))).digest('hex');
      assert.equal(got, want);
    });
  }
}
