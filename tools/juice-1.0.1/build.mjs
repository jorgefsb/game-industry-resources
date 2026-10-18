#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '../../juice/1.0.1');
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

function gzip9file(path) {
  const r = spawnSync('gzip', ['-9', '-c', path], { maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) throw new Error((r.stderr && r.stderr.toString()) || 'gzip failed');
  return r.stdout.length;
}

const leaked = readdirSync(dir).filter((n) => n.endsWith('.test.mjs') || n === 'build.mjs');
if (leaked.length) throw new Error('juice/1.0.1 must not publish ' + leaked.join(', '));

const pairs = [
  ['juice.src.js', 'juice.js', 'js'],
  ['juice.src.css', 'juice.css', 'css'],
  ['juice-menu.src.js', 'juice-menu.js', 'js'],
  ['juice-menu.src.css', 'juice-menu.css', 'css']
];

const built = {};
for (const [srcName, outName, kind] of pairs) {
  const srcPath = join(dir, srcName);
  const outPath = join(dir, outName);
  const raw = readFileSync(srcPath, 'utf8');
  const out = kind === 'js'
    ? run('npx', ['--yes', 'esbuild', srcPath, '--minify', '--legal-comments=none'])
    : minifyCss(raw);
  built[outName] = out;
  if (kind === 'css') {
    if (/calc\([^)]*?[^\s][+-][^\s]/.test(out)) throw new Error(outName + ' broke calc() spaces');
    if (out.includes('.jz-panel') && !out.includes('.jz-panel :focus-visible')) {
      throw new Error(outName + ' lost .jz-panel :focus-visible space');
    }
    if (out.includes('calc(') && out.includes('100%') && !out.includes('calc(100% + 8px)') && /jz-panel/.test(out)) {
      throw new Error(outName + ' lost calc(100% + 8px)');
    }
  }
  if (!check) writeFileSync(outPath, out);
  if (!existsSync(outPath)) throw new Error(outName + ' missing');
  if (check && readFileSync(outPath, 'utf8') !== out) throw new Error(outName + ' is stale vs ' + srcName);
}

const coreJs = gzip9file(join(dir, 'juice.js'));
const coreCss = gzip9file(join(dir, 'juice.css'));
const menuJs = gzip9file(join(dir, 'juice-menu.js'));
const menuCss = gzip9file(join(dir, 'juice-menu.css'));
const core = coreJs + coreCss;
const pack = core + menuJs + menuCss;

const src = readFileSync(join(dir, 'juice.src.js'), 'utf8');
const pub = readFileSync(join(dir, 'juice.js'), 'utf8');
const css = readFileSync(join(dir, 'juice.css'), 'utf8');
if (/setTimeout\([^)]{0,120}hap\(/.test(src + pub)) throw new Error('hap() must not run from setTimeout');
if (/jz-tap[^\n]+around/.test(src)) throw new Error('jz-tap must not include around');
if (!/isolation:isolate/.test(css)) throw new Error('core CSS must isolate card hosts');
if (!/\.btn--primary/.test(css) || !/isolation:isolate;position:relative/.test(css)) {
  throw new Error('core CSS must isolate animated buttons');
}
if (!/body>.jz-dot/.test(css) || !/host===d\.body/.test(src)) {
  throw new Error('particles must host on isolation or the body overlay');
}
if (!/\.jz-stamp\{position:absolute/.test(css)) throw new Error('stamp must be absolute to avoid CLS');
if (!/\.jz-stamp\{/.test(css) || !/\.jz-steps\{/.test(css) || !/\.jz-check\{/.test(css)) {
  throw new Error('core CSS must style check, stamp and steps');
}
if (!/o\.kind/.test(src) || !/hk=o\.kind/.test(src)) throw new Error('play(haptics) must honor kind first');
if (!/!gest/.test(src)) throw new Error('hap() must require a user gesture');
if (!/isTrusted/.test(src)) throw new Error('click/arm must require a trusted gesture');
if (!/pointerup/.test(src) || !/pointercancel/.test(src) || !/keyup/.test(src)) {
  throw new Error('gest must clear on pointerup, pointercancel and keyup');
}
if (/arm\(\)\{[^}]*setTimeout/.test(src)) throw new Error('arm() must not clear gest before click');
if (!/\[class\*=-card\]/.test(src) || !/\[class\*=-card\]/.test(css)) {
  throw new Error('card hosts must use *= so jz-antic still matches');
}
if (/height:50px/.test(css) || /:has\(\.jz-steps\):before/.test(css)) {
  throw new Error('stamp must not reserve a 50px strip');
}
if (!/rgba\(255,255,255,.15\)/.test(css)) throw new Error('jz-check border must be rgba(255,255,255,.15)');
if (/font:700 13px/.test(css)) throw new Error('jz-check font shorthand without family is invalid');
if (!/font-weight:700/.test(css) || !/font-size:13px/.test(css) || !/line-height:1/.test(css)) {
  throw new Error('jz-check must use font-weight/size/line-height longhands');
}
if (/:has\(\.jz-stamp\)/.test(css)) throw new Error('title pad must reserve space without :has');
if (!/\[data-jz-stamp\]>:is\(h1,h2,h3\)/.test(css) || !/padding-right:126px/.test(css)) {
  throw new Error('core CSS must pad [data-jz-stamp] titles by the stamp width');
}
if (!/text-wrap:balance/.test(css)) throw new Error('stamped titles need text-wrap:balance');
if (!/function init\(/.test(src) || !/init:init/.test(src)) {
  throw new Error('JZ.init must mark success hosts with data-jz-stamp');
}
const menuCssSrc = readFileSync(join(dir, 'juice-menu.src.css'), 'utf8');
const menuJsSrc = readFileSync(join(dir, 'juice-menu.src.js'), 'utf8');
const BODY = 'var(--brand-font-body,Inter,system-ui,sans-serif)';
const HEAD = 'var(--brand-font-heading,Outfit,Inter,system-ui,sans-serif)';
const menuCssOut = built['juice-menu.css'];
if (/@import|@font-face/.test(css + menuCssOut)) throw new Error('package must not load fonts');
if (!css.includes(HEAD) || !/\.jz-stamp\{[^}]*font:700 22px\/1\.1 var\(--brand-font-heading/.test(css)) {
  throw new Error('stamp must use heading stack at 700');
}
if (!css.includes(BODY) || !menuCssOut.includes(BODY)) {
  throw new Error('body text must use brand-font-body stack at 400');
}
if (/font:700 13px Outfit/.test(menuCssSrc + menuCssOut) || !/\.jz-panel legend\{font:400 13px var\(--brand-font-body/.test(menuCssOut)) {
  throw new Error('legend must use body stack at 400, not Outfit 700');
}
if (/padding-right:8em/.test(menuCssSrc) || /\.jz-host>h1/.test(menuCssSrc)) {
  throw new Error('stamp title padding belongs in core CSS, only on stamped cards');
}
if (!/Sonido y juice/.test(menuJsSrc) || !/Movimiento reducido: apagado\./.test(menuJsSrc)) {
  throw new Error('never trim Spanish menu accessibility text');
}
if (!/Sound and juice/.test(menuJsSrc) || !/Reduced motion: off\./.test(menuJsSrc)) {
  throw new Error('never trim English menu accessibility text');
}
if (!/800\+\(Math\.random\(\)\*400/.test(src)) throw new Error('party duration must stay at or under 1.2s');
if ((css.match(/translateX\(-4px\)/g) || []).length < 3) throw new Error('shake must be 3 cycles');
if (!/function kill\(/.test(src)) throw new Error('setLevel(off) must cancel via kill()');
if (!/requestAnimationFrame\(function\(\)\{requestAnimationFrame/.test(src)) {
  throw new Error('stagger must use double rAF');
}

const bind = readFileSync(join(here, '../../scripts/juice.bind.js'), 'utf8');
if (/\.hap\(/.test(bind)) throw new Error('bind.js must not call hap()');
if (/party\(pay\)|spray\(pay/.test(bind)) throw new Error('pay click must not party or spray');
if (!/play\('jz-tap'/.test(bind)) throw new Error('pay click must play jz-tap');
if (!/allowed\('impact'\) \? jz\.HOLD : 0/.test(bind)) {
  throw new Error('Stripe wait must be allowed(impact) ? HOLD : 0');
}
if (/function mount\(/.test(bind) || /jz-dock/.test(bind)) {
  throw new Error('menu mount must live in juice-menu.js, not bind.js');
}
if (/0 0 18px 6px/.test(css) || /box-shadow:0 0 0 3px/.test(css) || /\.jz-glow/.test(css + src + pub)) {
  throw new Error('flash must be .jz-flash with a short border, not a glow');
}
if (!/\.jz-flash\{/.test(css) || !/layer\(b,'jz-flash'\)/.test(src)) {
  throw new Error('flash layer class must be jz-flash');
}
if (!/color:var\(--brand-ink,#22211F\)/.test(css)) {
  throw new Error('done check must use brand-ink');
}
if (/#FFA500/.test(css)) throw new Error('core CSS must not use #FFA500');
if (!/border:2px solid var\(--brand-accent,#FF6B35\)/.test(css)) {
  throw new Error('stamp ring must use brand-accent');
}
if (!/function sfxLab\(/.test(src) || !/setAttribute\('aria-label',lab\)/.test(src)) {
  throw new Error('sound button visible text and aria-label must share sfxLab()');
}
if (!/aria-hidden="true"/.test(src) || !/jz-feel__label/.test(menuJsSrc)) {
  throw new Error('emoji must be aria-hidden; feel button needs a visible matching label');
}

const PACK = ['juice.css', 'juice.js', 'juice-menu.css', 'juice-menu.js'];
function sha256file(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
const manifest = {
  name: 'juice',
  version: '1.0.1',
  origin: 'jorgefsb/game-industry-resources',
  files: Object.fromEntries(PACK.map((name) => [name, { sha256: sha256file(join(dir, name)) }]))
};
const manifestText = JSON.stringify(manifest, null, 2) + '\n';
const manifestPath = join(dir, 'manifest.json');
if (!check) writeFileSync(manifestPath, manifestText);
if (!existsSync(manifestPath)) throw new Error('manifest.json missing');
if (check && readFileSync(manifestPath, 'utf8') !== manifestText) {
  throw new Error('manifest.json is stale vs built files');
}

console.log((check ? 'ok' : 'wrote') + ' core', core, 'js', coreJs, 'css', coreCss, 'pack', pack, 'menu-js', menuJs, 'menu-css', menuCss);
if (core >= 6000) throw new Error('core gzip -9 ' + core + ' B >= 6000');
if (pack >= 8000) throw new Error('package gzip -9 ' + pack + ' B >= 8000');
if (check) {
  const tests = spawnSync('node', ['--test', join(here, 'pin.test.mjs'), join(here, 'label.test.mjs'), join(here, 'hap.test.mjs')], { stdio: 'inherit' });
  if (tests.status !== 0) throw new Error('juice 1.0.1 tests failed');
}
