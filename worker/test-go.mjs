#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import worker from './ia-api.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const toolsJson = readFileSync(join(ROOT, 'ia/tools.json'), 'utf8');
const catalog = JSON.parse(toolsJson);
const meshy = catalog.tools.find((t) => t.id === 'meshy');
if (!meshy || !meshy.affiliate || !meshy.url) {
  throw new Error('Meshy catalog entry needs url + affiliate');
}

const kv = new Map();
const logs = [];
const origLog = console.log;
console.log = (...args) => {
  logs.push(args.map(String).join(' '));
};

const env = {
  IA_KV: {
    async get(key) {
      return kv.has(key) ? kv.get(key) : null;
    },
    async put(key, value) {
      kv.set(key, String(value));
    }
  },
  ASSETS: {
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === '/ia/tools.json') {
        return new Response(toolsJson, { headers: { 'content-type': 'application/json' } });
      }
      return new Response('no', { status: 404 });
    }
  }
};

async function go(path, method = 'GET') {
  return worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx' + path, { method }), env);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const aff = await go('/ia/go/meshy');
assert(aff.status === 302, `meshy status ${aff.status}`);
assert(aff.headers.get('location') === meshy.affiliate, `meshy location ${aff.headers.get('location')}`);
assert(aff.headers.get('location') !== meshy.url, 'meshy must not skip the affiliate URL');

const unknown = await go('/ia/go/no-such-tool');
assert(unknown.status === 404, `unknown status ${unknown.status}`);

const cursor = catalog.tools.find((t) => t.id === 'cursor');
const cur = await go('/ia/go/cursor');
assert(cur.status === 302, `cursor status ${cur.status}`);
const cursorLoc = cur.headers.get('location') || '';
assert(cursorLoc === cursor.url || cursorLoc === new URL(cursor.url).toString(), `cursor location ${cursorLoc}`);

const extra = await go('/ia/go/meshy/extra');
assert(extra.status === 404, `nested path status ${extra.status}`);
const empty = await go('/ia/go/');
assert(empty.status === 404, `empty slug status ${empty.status}`);
const upper = await go('/ia/go/MESHY');
assert(upper.status === 404, `uppercase status ${upper.status}`);

const open = await go('/ia/go/meshy?to=https://evil.example');
assert(open.headers.get('location') === meshy.affiliate, 'query must not change destination');

const day = new Date().toISOString().slice(0, 10);
const key = `clicks:meshy:${day}`;
assert(kv.get(key) === '2', `kv count ${kv.get(key)}`);
assert(logs.some((line) => line.includes('"event":"outbound_click"') && line.includes('"slug":"meshy"')), `log lines ${JSON.stringify(logs)}`);
assert(!logs.some((line) => /cf-connecting-ip|127\.0\.0\.1|x-forwarded/i.test(line)), 'must not log IPs');

const kvDown = {
  ...env,
  IA_KV: {
    async get() { throw new Error('kv down'); },
    async put() { throw new Error('kv down'); }
  }
};
const still = await worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx/ia/go/meshy'), kvDown);
assert(still.status === 302, `kv-fail status ${still.status}`);
assert(still.headers.get('location') === meshy.affiliate, 'kv-fail must still 302 to affiliate');

console.log = origLog;
console.log('OK: /ia/go/meshy → affiliate 302, unknown 404, KV ' + key + '=' + kv.get(key));
