#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
// gzip -9 via system gzip, matching review measurement
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const srcJs = join(dir, 'juice.src.js');
const srcCss = join(dir, 'juice.src.css');
const outJs = join(dir, 'juice.js');
const outCss = join(dir, 'juice.css');
const check = process.argv.includes('--check');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout || cmd) + ' exit ' + r.status);
  return r.stdout;
}

function minifyCss(src) {
  const keep = [];
  const stash = (value) => {
    keep.push(value);
    return '___JZ' + (keep.length - 1) + '___';
  };
  let out = src.replace(/\/\*[\s\S]*?\*\//g, '');
  out = out.replace(/calc\(([^)]+)\)/g, (_, inner) => stash('calc(' + inner.replace(/\s*([+-])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim() + ')'));
  out = out.replace(/\.jz-panel :focus-visible/g, () => stash('.jz-panel :focus-visible'));
  out = out.replace(/\s+/g, ' ');
  out = out.replace(/\s*([{};,])\s*/g, '$1');
  out = out.replace(/;}/g, '}');
  out = out.replace(/and\(/g, 'and (');
  out = out.replace(/___JZ(\d+)___/g, (_, i) => keep[+i]);
  return out.trim() + '\n';
}

const js = run('npx', ['--yes', 'esbuild', srcJs, '--minify', '--legal-comments=none']);
const css = minifyCss(readFileSync(srcCss, 'utf8'));

if (/calc\([^)]*?[^\s][+-][^\s]/.test(css)) throw new Error('minified CSS broke calc() spaces');
if (!css.includes('.jz-panel :focus-visible')) throw new Error('minified CSS lost .jz-panel :focus-visible space');
if (!css.includes('calc(100% + 8px)')) throw new Error('minified CSS lost calc(100% + 8px)');
const site = readFileSync(join(dir, '../../styles/juice.css'), 'utf8');
if (!site.includes('calc(100% + 8px)') || !site.includes('.jz-panel :focus-visible')) {
  throw new Error('styles/juice.css missing panel calc/focus-visible');
}
if (/transition:[^;{}]*border-color/.test(site) || /transition:[^;{}]*(?<![-\w])color\b/.test(site)) {
  throw new Error('styles/juice.css may only animate transform/opacity');
}
const bind = readFileSync(join(dir, '../../scripts/juice.bind.js'), 'utf8');
if (/\.hap\(/.test(bind)) throw new Error('bind.js must not call hap()');
if (!/allowed\('impact'\) \? jz\.HOLD : 0/.test(bind)) {
  throw new Error('Stripe wait must be allowed(impact) ? HOLD : 0');
}

// Official size = `gzip -9 -c <file>` (filename in header). stdin gzip is smaller.
function gzip9file(path) {
  const r = spawnSync('gzip', ['-9', '-c', path], { maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) throw new Error((r.stderr && r.stderr.toString()) || 'gzip failed');
  return r.stdout.length;
}

if (!check) {
  writeFileSync(outJs, js);
  writeFileSync(outCss, css);
}

if (!existsSync(outJs) || !existsSync(outCss)) throw new Error('published files missing');
if (check) {
  if (readFileSync(outJs, 'utf8') !== js) throw new Error('juice.js is stale vs juice.src.js');
  if (readFileSync(outCss, 'utf8') !== css) throw new Error('juice.css is stale vs juice.src.css');
}

const fileJs = gzip9file(outJs);
const fileCss = gzip9file(outCss);
const fileTotal = fileJs + fileCss;
const src = readFileSync(srcJs, 'utf8');
const pub = readFileSync(outJs, 'utf8');
if (/setTimeout\([^)]*hap\(/.test(src + pub) || /setTimeout\([^)]{0,120}hap\(/.test(src + pub)) {
  throw new Error('hap() must not run from setTimeout');
}
if (/jz-tap[^\n]+around/.test(src)) throw new Error('jz-tap must not include around');
if (!/z-index:-1/.test(readFileSync(srcCss, 'utf8'))) throw new Error('canvas must sit at z-index:-1');

console.log((check ? 'ok' : 'wrote') + ' gzip-9', fileTotal, 'js', fileJs, 'css', fileCss);
if (fileTotal >= 6000) throw new Error('gzip -9 ' + fileTotal + ' B (js ' + fileJs + ' + css ' + fileCss + ') >= 6000');
