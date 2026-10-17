/* Juice v0 · Ratchet spec. Web Audio only. Sounds: tap, success, error. */
(function () {
  'use strict';

  var KEY = 'gamedev_sfx';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saved = localStorage.getItem(KEY);
  var enabled = saved === 'on' || (saved !== 'off' && !reduce);
  var ctx = null;
  var master = null;
  var COLORS = ['#FF6B35', '#FFA500', '#F4E8D5'];
  var SFX_LABEL = {
    es: { on: 'Silenciar', off: 'Activar sonido', stateOn: 'Sonido: sí', stateOff: 'Sonido: no' },
    en: { on: 'Mute sound', off: 'Turn sound on', stateOn: 'Sound: on', stateOff: 'Sound: off' }
  };

  function lang() {
    return document.documentElement.lang === 'en' ? 'en' : 'es';
  }

  function audio() {
    if (!enabled) return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      /* ~-18 dB */
      master.gain.value = 0.125;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, slide) {
    var c = audio();
    if (!c) return;
    dur = Math.min(dur, 0.15);
    var t0 = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(slide, 1), t0 + dur);
    g.gain.setValueAtTime(1, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.01);
  }

  var sfx = {
    tap: function () { tone(880, 0.07, 'square'); },
    success: function () {
      tone(523, 0.06, 'square');
      setTimeout(function () { tone(784, 0.08, 'square'); }, 55);
    },
    error: function () { tone(220, 0.14, 'square', 110); }
  };

  function play(name) {
    if (!enabled) return;
    var fn = sfx[name];
    if (fn) fn();
  }

  function paintToggle(btn) {
    if (!btn) return;
    var L = SFX_LABEL[lang()];
    var waves = enabled
      ? '<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'
      : '<path d="M16 9l5 6"/><path d="M21 9l-5 6"/>';
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>' + waves + '</svg>' +
      '<span class="juice-sfx__label" aria-hidden="true">' + (enabled ? L.stateOn : L.stateOff) + '</span>';
    btn.setAttribute('aria-pressed', String(enabled));
    btn.setAttribute('aria-label', SFX_LABEL[lang()][enabled ? 'on' : 'off']);
  }

  function setEnabled(on) {
    enabled = !!on;
    localStorage.setItem(KEY, enabled ? 'on' : 'off');
    paintToggle(document.querySelector('.juice-sfx'));
    if (enabled) audio();
    else if (ctx && ctx.state === 'running') ctx.suspend();
  }

  /* Particles start outside the element edge and fly outward, behind content (z-index -1).
     Any particle whose path would reach nearby text or another control is shortened or dropped. */
  var TEXTY = 'a, button, p, h1, h2, h3, li, label, input, .hero__badge';
  function hits(x, y, rects) {
    for (var k = 0; k < rects.length; k++) {
      var b = rects[k];
      if (x + 3 > b.left && x - 3 < b.right && y + 3 > b.top && y - 3 < b.bottom) return true;
    }
    return false;
  }
  function burstFrom(el) {
    if (!el || reduce) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var hw = r.width / 2, hh = r.height / 2;
    var near = [];
    document.querySelectorAll(TEXTY).forEach(function (t) {
      if (t === el || el.contains(t) || t.contains(el)) return;
      var b = t.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (b.right < r.left - 60 || b.left > r.right + 60 || b.bottom < r.top - 60 || b.top > r.bottom + 60) return;
      near.push(b);
    });
    near.push({ left: r.left - 2, right: r.right + 2, top: r.top - 2, bottom: r.bottom + 2 });
    var n = 20;
    for (var i = 0; i < n; i++) {
      var ang = (Math.PI * 2 * i) / n;
      var c = Math.cos(ang), s = Math.sin(ang);
      /* point on the element's rectangle edge in this direction, pushed 6px outside */
      var tSide = Math.abs(c) > 1e-6 ? hw / Math.abs(c) : Infinity;
      var tTop = Math.abs(s) > 1e-6 ? hh / Math.abs(s) : Infinity;
      var x0, y0;
      if (tSide < tTop) { x0 = cx + Math.sign(c) * (hw + 6); y0 = cy + s * tSide; }
      else { x0 = cx + c * tTop; y0 = cy + Math.sign(s) * (hh + 6); }
      if (hits(x0, y0, near)) continue;
      var dist = 12 + (i % 3) * 6;
      while (dist > 4 && (hits(x0 + c * dist, y0 + s * dist * 0.6, near) || hits(x0 + c * dist / 2, y0 + s * dist * 0.3, near))) dist -= 2;
      if (dist <= 4) continue;
      var p = document.createElement('span');
      p.className = 'juice-dot';
      p.style.left = x0 + 'px';
      p.style.top = y0 + 'px';
      p.style.background = COLORS[i % 3];
      p.style.setProperty('--dx', c * dist + 'px');
      p.style.setProperty('--dy', s * dist * 0.6 + 'px');
      document.body.appendChild(p);
      p.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function press(el) {
    if (reduce || !el) return;
    el.classList.remove('juice-press');
    void el.offsetWidth;
    el.classList.add('juice-press');
  }

  function shake(el) {
    if (reduce || !el) return;
    el.classList.remove('juice-shake');
    void el.offsetWidth;
    el.classList.add('juice-shake');
  }

  function onFirstGesture() {
    if (enabled) audio();
  }
  document.addEventListener('pointerdown', onFirstGesture, { once: true, capture: true });
  document.addEventListener('keydown', onFirstGesture, { once: true, capture: true });

  document.addEventListener('click', function (e) {
    var sfxBtn = e.target.closest('.juice-sfx');
    if (sfxBtn) {
      press(sfxBtn);
      setEnabled(!enabled);
      if (enabled) play('tap');
      return;
    }

    var live = e.target.closest('.ia-moki-live');
    if (live) {
      play('tap');
      return;
    }

    var formBtn = e.target.closest('form .btn, form button[type="submit"]');
    if (formBtn) {
      press(formBtn);
      return;
    }

    var squash = e.target.closest('.btn, .hud__burger, .ia-chip, .ia-more, .home-card, .ia-card');
    if (squash) press(squash);

    var burger = e.target.closest('.hud__burger');
    if (burger) {
      play('tap');
      return;
    }

    if (e.target.closest('[data-submit-open], [data-more]')) {
      play('tap');
      return;
    }

    var cta = e.target.closest('.btn--primary, .hud__cta, .hud__nav-cta');
    if (cta) {
      play('tap');
      burstFrom(cta);
      return;
    }

    if (e.target.closest('.btn, .home-card, .ia-card, .ia-chip')) play('tap');
  });

  document.addEventListener('gamedev:form', function (e) {
    var d = e.detail || {};
    if (d.key === 'form.sending') return;
    if (d.ok && (d.key === 'news.ok' || d.key === 'submit.ok' || d.key === 'sp.ok')) {
      play('success');
      burstFrom((d.form && d.form.querySelector('button[type="submit"]')) || d.el);
      return;
    }
    if (!d.ok) {
      play('error');
      shake(d.form || (d.el && d.el.closest('form')));
    }
  });

  document.addEventListener('gamedev:lang', function () {
    paintToggle(document.querySelector('.juice-sfx'));
  });

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'juice-press') e.target.classList.remove('juice-press');
    if (e.animationName === 'juice-shake') e.target.classList.remove('juice-shake');
  });

  paintToggle(document.querySelector('.juice-sfx'));
})();
