#!/usr/bin/env node
/**
 * Local /ia server: static files + the Worker fetch handler for /ia/go/*.
 * Usage: node worker/local-ia.mjs [port]
 */
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './ia-api.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 8765);
const toolsJson = readFileSync(join(ROOT, 'ia/tools.json'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

const kv = new Map();
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
        return new Response(toolsJson, { headers: { 'content-type': 'application/json; charset=utf-8' } });
      }
      return new Response('Not found', { status: 404 });
    }
  }
};

function safeFile(pathname) {
  const rel = decodeURIComponent(pathname).replace(/^\/+/, '');
  const full = normalize(join(ROOT, rel));
  if (!full.startsWith(ROOT + '/') && full !== ROOT) return null;
  let path = full;
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path) || !statSync(path).isFile()) return null;
  return path;
}

async function fromWorker(req, body) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
  }
  const request = new Request(url, { method: req.method, headers, body });
  return worker.fetch(request, env);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    if (url.pathname === '/ia/go' || url.pathname.startsWith('/ia/go/')) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const out = await fromWorker(req, body);
      res.statusCode = out.status;
      out.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await out.arrayBuffer()));
      return;
    }
    const file = safeFile(url.pathname);
    if (!file) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end('Not found');
      return;
    }
    const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('content-type', type);
    res.end(readFileSync(file));
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err && err.message ? err.message : err));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`local-ia http://127.0.0.1:${PORT}/ia/`);
});
