/* Site binder for juice 1.0.0. Menu lives in /juice/1.0.0/juice-menu.*. Stripe untouched. */
(function (d) {
  'use strict';
  function J() { return window.JZ; }
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var F = 'input:not([type=hidden]):not([tabindex="-1"]),textarea,select';
  d.querySelectorAll('.btn--primary,.hud__cta,.hud__nav-cta,.home-card,.ia-card[href],a.ia-card,.jz-try').forEach(function (el) {
    var off = document.documentElement.getAttribute('data-jz-off') || '';
    if (off.indexOf('anticipation') < 0 && !(window.JZ_CONFIG && window.JZ_CONFIG.anticipation === false)) el.classList.add('jz-antic');
  });
  d.addEventListener('focusin', function (e) {
    var jz = J(); if (jz && e.target.matches(F) && !e.target.closest('.ia-hp')) jz.look(e.target);
  });
  d.addEventListener('focusout', function () {
    setTimeout(function () {
      var jz = J(), a = d.activeElement;
      if (jz && (!a || !a.matches || !a.matches(F))) jz.look();
    }, 0);
  });
  d.addEventListener('pointermove', function (e) {
    var jz = J(); if (!jz || !fine || !jz.allowed('tilt') || e.pointerType === 'touch') return;
    var el = e.target.closest('.jz-antic.btn--primary,.jz-antic.jz-try');
    [].slice.call(d.querySelectorAll('.jz-tilting')).forEach(function (x) {
      if (x !== el) { x.classList.remove('jz-tilting'); x.style.removeProperty('--jz-tilt'); }
    });
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--jz-tilt', Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) / (r.width / 2) * 6)).toFixed(2) + 'deg');
    el.classList.add('jz-tilting');
  });
  d.addEventListener('gamedev:lang', function () { J() && J().paint(); });
  function on(e, fn) { d.addEventListener(e, fn); }
  on('click', function (e) {
    var t = e.target, jz = J(); if (!jz) return;
    if (t.closest('.juice-sfx,.jz-lvl,.jz-feel,input[name=jz-level],[data-jz]')) return;
    var live = t.closest('.ia-moki-live,[data-jz-moki]');
    if (live) { jz.snd('tap'); jz.hop(live); return; }
    var pay = t.closest('[data-sponsor-cta]');
    if (pay && /^https:\/\/buy\.stripe\.com\//.test(pay.href || '')) {
      jz.snd('tap');
      if (jz.red() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || pay.target === '_blank') return;
      e.preventDefault();
      var url = pay.href;
      jz.hold(pay);
      setTimeout(function () { jz.rel(pay); jz.spray(pay, 'burst'); location.assign(url); }, jz.allowed('impact') ? jz.HOLD : 0);
      return;
    }
    var fb = t.closest('form .btn, form button[type="submit"]');
    if (fb) { jz.press(fb); return; }
    var sq = t.closest('.btn,.hud__burger,.ia-chip,.ia-more,.home-card,.ia-card');
    if (sq) jz.press(sq);
    var br = t.closest('.hud__burger');
    if (br) {
      jz.snd('tap');
      setTimeout(function () {
        var nav = d.getElementById(br.getAttribute('aria-controls') || 'hud-nav');
        if (nav && br.getAttribute('aria-expanded') === 'true') jz.stagger(nav, 'menu');
      }, 0);
      return;
    }
    if (t.closest('[data-submit-open],[data-more]')) { jz.snd('tap'); return; }
    var cta = t.closest('.btn--primary,.hud__cta,.hud__nav-cta');
    if (cta) { jz.snd('tap'); jz.spray(cta, 'burst'); return; }
    if (t.closest('.btn,.home-card,.ia-card,.ia-chip')) jz.snd('tap');
  });
  on('input', function (e) {
    var jz = J(), f = e.target.closest && e.target.closest('form');
    if (!jz || !f || !jz.allowed('foreshadow')) return;
    var req = [].slice.call(f.querySelectorAll('[required]'));
    if (req.length && req.every(function (x) { return (x.value || '').trim(); })) {
      var g = f.querySelector('button[type="submit"],[data-sponsor-cta]');
      if (g) jz.peek(g, f.getAttribute('data-ia-form') || 'form');
    }
  });
  on('gamedev:form', function (e) {
    var jz = J(), x = e.detail || {}; if (!jz || x.key === 'form.sending') return;
    if (x.ok && /news\.ok|submit\.ok|sp\.ok/.test(x.key || '')) {
      var b = (x.form && x.form.querySelector('button[type="submit"]')) || x.el;
      jz.hold(b);
      setTimeout(function () {
        jz.rel(b); jz.snd('success'); jz.spray(b, 'burst'); jz.hop(b);
        if (x.key === 'sp.ok') jz.stamp(x.form);
      }, jz.allowed('impact') ? jz.HOLD : 0);
    } else if (!x.ok) { jz.snd('error'); jz.shake(x.form || (x.el && x.el.closest('form'))); }
  });
  [].slice.call(d.querySelectorAll('[data-jz-steps]')).forEach(function (list) {
    var items = [].slice.call(list.querySelectorAll('[data-jz-step]'));
    function done(inp) {
      var v = (inp.value || '').trim();
      return !v ? 0 : inp.type === 'email' ? /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(v) : inp.type === 'url' ? /^(https?:\/\/)?[^\s.\/]+\.[^\s]{2,}$/i.test(v) : 1;
    }
    function ref() {
      var jz = J(); if (!jz) return;
      items.forEach(function (li) {
        var inp = d.getElementById(li.getAttribute('data-jz-step')); if (!inp) return;
        var yes = done(inp), was = li.classList.contains('is-done');
        if (yes && !was) {
          li.classList.add('is-done');
          li.style.setProperty('--jz-peak', String(1.2 + 0.06 * (items.filter(function (x) { return x.classList.contains('is-done'); }).length - 1)));
          if (jz.allowed('check') && !jz.red()) { li.classList.remove('jz-pop'); void li.offsetWidth; li.classList.add('jz-pop'); }
          jz.snd('tap');
        } else if (!yes && was) li.classList.remove('is-done', 'jz-pop');
      });
    }
    var f = list.closest('form') || d; f.addEventListener('input', ref); f.addEventListener('change', ref); ref();
  });
  var th = d.querySelector('[data-thanks]');
  if (th && !th.hidden) requestAnimationFrame(function () { J() && J().party(th); });
  var app = d.querySelector('[data-ia-app]');
  if (app) {
    var mo = new MutationObserver(function () {
      var jz = J(), list = app.querySelector('.ia-grid,.ia-cat,[data-ia-list]');
      if (jz && list && !list.getAttribute('data-jz-did')) jz.stagger(list, 'list');
    });
    mo.observe(app, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 8000);
  }
})(document);
