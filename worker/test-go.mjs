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

const TEST_IP = '203.0.113.50';
const TEST_SALT = 'test-ip-hash-salt';
const kv = new Map();
const putOpts = new Map();
const logs = [];
const origLog = console.log;
console.log = (...args) => {
  logs.push(args.map(String).join(' '));
};

const env = {
  IP_HASH_SALT: TEST_SALT,
  IA_KV: {
    async get(key) {
      return kv.has(key) ? kv.get(key) : null;
    },
    async put(key, value, opts) {
      kv.set(key, String(value));
      putOpts.set(key, opts || {});
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
  return worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx' + path, {
    method,
    headers: { 'cf-connecting-ip': TEST_IP }
  }), env);
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

const sub = await worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx/ia/api/subscribe', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': TEST_IP },
  body: JSON.stringify({ email: 'qa@example.com', lang: 'es' })
}), env);
assert(sub.status === 200, `subscribe status ${sub.status}`);

const hour = Math.floor(Date.now() / 3600000);
const tokenBytes = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(`${TEST_SALT}:${TEST_IP}:${day}`)
);
const token = Array.from(new Uint8Array(tokenBytes), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
const rlKey = `rl:${token}:${hour}`;
assert(kv.get(rlKey) === '1', `hashed rl key ${rlKey} -> ${kv.get(rlKey)}`);
assert(putOpts.get(rlKey)?.expirationTtl === 3600, `rl ttl ${JSON.stringify(putOpts.get(rlKey))}`);
assert(!rlKey.includes(TEST_IP), 'rl key must not embed the IP');

const noSaltEnv = { IA_KV: env.IA_KV, ASSETS: env.ASSETS };
const noSalt = await worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx/ia/api/subscribe', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': TEST_IP },
  body: JSON.stringify({ email: 'qa2@example.com', lang: 'es' })
}), noSaltEnv);
assert(noSalt.status === 200, `subscribe without salt status ${noSalt.status}`);
assert(![...kv.keys()].some((k) => k.includes(TEST_IP)), `no-salt must not store IP keys: ${[...kv.keys()]}`);

const kvDown = {
  ...env,
  IA_KV: {
    async get() { throw new Error('kv down'); },
    async put() { throw new Error('kv down'); }
  }
};
const still = await worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx/ia/go/meshy', {
  headers: { 'cf-connecting-ip': TEST_IP }
}), kvDown);
assert(still.status === 302, `kv-fail status ${still.status}`);
assert(still.headers.get('location') === meshy.affiliate, 'kv-fail must still 302 to affiliate');

const noSaltGo = await worker.fetch(new Request('https://gamedev.jorgesuarez.com.mx/ia/go/meshy', {
  headers: { 'cf-connecting-ip': TEST_IP }
}), { IA_KV: env.IA_KV, ASSETS: env.ASSETS });
assert(noSaltGo.status === 302, `go without salt status ${noSaltGo.status}`);

for (const [k, v] of kv.entries()) {
  assert(!k.includes(TEST_IP), `KV key leaked IP: ${k}`);
  assert(!String(v).includes(TEST_IP), `KV value leaked IP at ${k}: ${v}`);
}
assert(!logs.some((line) => line.includes(TEST_IP)), `logs leaked IP: ${JSON.stringify(logs)}`);

console.log = origLog;
console.log('OK: /ia/go/meshy → affiliate 302, unknown 404, KV ' + key + '=' + kv.get(key));
