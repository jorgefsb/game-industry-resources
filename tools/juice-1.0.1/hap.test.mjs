#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { chromePath, loadChromium, packDir, skipNoChromium } from './browser.mjs';

const chromium = await loadChromium();
const exe = chromePath();
const noChromium = skipNoChromium(chromium, exe, 'hap.test');
if (noChromium) console.warn(noChromium);
const browserOpts = noChromium ? { skip: noChromium } : {};

test('haptics: trusted tap fires; off / tab / drag / scripted click do not', browserOpts, async () => {
  const juice = readFileSync(join(packDir, 'juice.js'), 'utf8');
  const browser = await chromium.launch({ headless: true, executablePath: exe });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem('jz-level', 'full'); } catch (e) {}
      window.__vib = [];
      navigator.vibrate = function (p) { window.__vib.push(p); return true; };
    });
    await page.setContent(
      '<!doctype html><html lang="es"><body>' +
      '<button type="button" class="btn btn--primary" data-jz="jz-tap" id="t">Tap</button>' +
      '<script>' + juice + '</script></body></html>'
    );
    await page.waitForFunction(() => window.JZ);
    await page.evaluate(() => {
      window.__vib = [];
      navigator.vibrate = function (p) { window.__vib.push(p); return true; };
    });

    async function tap() {
      const box = await page.locator('#t').boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(80);
      await page.mouse.up();
    }

    await page.evaluate(() => { window.__vib = []; JZ.setLevel('full'); });
    await tap();
    const afterTap = await page.evaluate(() => window.__vib.slice());

    await page.evaluate(() => { window.__vib = []; JZ.setLevel('off'); });
    await tap();
    const off = await page.evaluate(() => window.__vib.slice());

    await page.evaluate(() => { window.__vib = []; JZ.setLevel('full'); });
    await page.locator('#t').focus();
    await page.keyboard.down('Tab');
    await page.keyboard.up('Tab');
    await page.waitForTimeout(30);
    await page.evaluate(() => { JZ.play('tap+haptics', document.getElementById('t')); });
    const afterTab = await page.evaluate(() => window.__vib.slice());

    await page.evaluate(() => { window.__vib = []; });
    {
      const box = await page.locator('#t').boundingBox();
      await page.mouse.move(box.x + 6, box.y + 6);
      await page.mouse.down();
      await page.mouse.move(box.x + 80, box.y + 60, { steps: 10 });
      await page.mouse.up();
    }
    await page.waitForTimeout(30);
    await page.evaluate(() => { JZ.play('tap+haptics', document.getElementById('t')); });
    const afterDrag = await page.evaluate(() => window.__vib.slice());

    const afterProg = await page.evaluate(() => {
      window.__vib = [];
      document.getElementById('t').click();
      return window.__vib.slice();
    });

    assert.ok(afterTap.length, 'haptics did not fire after pointerdown + 80ms + pointerup + click');
    assert.equal(off.length, 0, 'haptics fired in Off');
    assert.equal(afterTab.length, 0, 'haptics fired after Tab then timer');
    assert.equal(afterDrag.length, 0, 'haptics fired after drag then timer');
    assert.equal(afterProg.length, 0, 'haptics fired from scripted el.click()');
  } finally {
    await browser.close();
  }
});
