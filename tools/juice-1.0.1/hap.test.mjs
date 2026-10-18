#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { armIdle, packDir, readyMarkup, requireBrowser, tapSelector, waitIdle, waitJzReady } from './browser.mjs';

const { chromium, exe } = await requireBrowser('hap.test');

test('haptics: trusted tap fires; off / tab / drag / scripted click do not', async () => {
  const juice = readFileSync(join(packDir, 'juice.js'), 'utf8');
  const browser = await chromium.launch({ headless: true, executablePath: exe });
  try {
    const page = await browser.newPage();
    await page.setContent(
      '<!doctype html><html lang="es"><body>' +
      '<button type="button" class="btn btn--primary" data-jz="jz-tap" id="t">Tap</button>' +
      '<script>' + juice + '</script>' + readyMarkup() +
      '</body></html>'
    );
    await waitJzReady(page);
    await page.evaluate(() => {
      window.__vib = [];
      navigator.vibrate = function (p) { window.__vib.push(p); return true; };
      JZ.setLevel('full');
    });

    await tapSelector(page, '#t');
    const afterTap = await page.evaluate(() => window.__vib.slice());

    await page.evaluate(() => { window.__vib = []; JZ.setLevel('off'); });
    await tapSelector(page, '#t');
    const off = await page.evaluate(() => window.__vib.slice());

    await page.evaluate(() => { JZ.setLevel('full'); });
    await armIdle(page, 'keyup');
    await page.locator('#t').focus();
    await page.keyboard.down('Tab');
    await page.keyboard.up('Tab');
    await waitIdle(page);
    const afterTab = await page.evaluate(() => {
      window.__vib = [];
      JZ.play('tap+haptics', document.getElementById('t'));
      return window.__vib.slice();
    });

    await armIdle(page, 'pointerup');
    {
      const box = await page.locator('#t').boundingBox();
      await page.mouse.move(box.x + 6, box.y + 6);
      await page.mouse.down();
      await page.mouse.move(box.x + 80, box.y + 60, { steps: 10 });
      await page.mouse.up();
    }
    await waitIdle(page);
    const afterDrag = await page.evaluate(() => {
      window.__vib = [];
      JZ.play('tap+haptics', document.getElementById('t'));
      return window.__vib.slice();
    });

    const afterProg = await page.evaluate(() => {
      window.__vib = [];
      document.getElementById('t').click();
      return window.__vib.slice();
    });

    assert.ok(afterTap.length, 'haptics did not fire after pointerdown + pointerup + click');
    assert.equal(off.length, 0, 'haptics fired in Off');
    assert.equal(afterTab.length, 0, 'haptics fired after Tab then play()');
    assert.equal(afterDrag.length, 0, 'haptics fired after drag then play()');
    assert.equal(afterProg.length, 0, 'haptics fired from scripted el.click()');
  } finally {
    await browser.close();
  }
});
