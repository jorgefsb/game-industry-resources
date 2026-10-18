/* v7 baseline (motion/sound spec + GMTK). Evolved into juice 1.0.0 at /juice/1.0.0/.
   Kept so existing behavior is not thrown away. Live pages now load 1.0.0. */
/* Juice · motion/sound spec + GMTK game-feel techniques (v7). Web Audio only. Sounds: tap, success, error. */
(function () {
  'use strict';

  var KEY = 'gamedev_sfx';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Sound is OFF by default for everyone. It only plays after the person turns it on;
     a saved choice in localStorage is always respected. */
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (err) { saved = null; }
  var enabled = saved === 'on';
  var ctx = null;
  var master = null;
  var COLORS = ['#FF6B35', '#FFA500', '#F4E8D5'];
  var SFX_LABEL = {
    es: { on: 'Silenciar', off: 'Activar sonido', stateOn: 'Sonido: sí', stateOff: 'Sonido: no' },
    en: { on: 'Mute sound', off: 'Turn sound on', stateOn: 'Sound: on', stateOff: 'Sound: off' }
  };
  var DONE_LABEL = { es: 'Listo', en: 'Done' };
  var HOLD_MS = 150; /* impact pause, never more than 300ms */

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

  /* j = random pitch factor per play, within ±5%, so repeated sounds don't tire. */
  var sfx = {
    tap: function (j) { tone(880 * j, 0.07, 'square'); },
    success: function (j) {
      tone(523 * j, 0.06, 'square');
      setTimeout(function () { tone(784 * j, 0.08, 'square'); }, 55);
    },
    error: function (j) { tone(220 * j, 0.14, 'square', 110 * j); }
  };

  function play(name) {
    if (!enabled) return;
    var fn = sfx[name];
    if (fn) fn(0.95 + Math.random() * 0.1);
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
    try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (err) { /* private mode: keep it for this page only */ }
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
  /* Opaque cards (isolation: isolate in juice.css) host their own particles, so the
     burst paints above the card background and still below the card's text. */
  var BURST_HOSTS = '.ia-sponsor__form';
  function burstFrom(el) {
    if (!el || reduce) return;
    var host = el.closest(BURST_HOSTS) || document.body;
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
    var n = 12; /* §2: max 12 particles per event */
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
      host.appendChild(p);
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

  /* ---------- 1. Impact pause: the button stays pressed, then the celebration. ---------- */
  function hold(el) {
    if (!el) return;
    el.classList.remove('juice-press');
    if (!reduce) el.classList.add('jz-held');
  }
  function release(el) {
    if (el) el.classList.remove('jz-held');
  }

  /* ---------- 2. Press flash + ripple on primary buttons. ---------- */
  function layer(btn, cls) {
    var l = btn.querySelector(':scope > .' + cls);
    if (!l) {
      l = document.createElement('span');
      l.className = cls;
      l.setAttribute('aria-hidden', 'true');
      btn.appendChild(l);
    }
    return l;
  }
  function flash(btn) {
    var g = layer(btn, 'jz-flash');
    if (reduce) {
      /* No animation in reduced motion: the color still flashes in timed steps. */
      g.style.opacity = '1';
      setTimeout(function () { g.style.opacity = '.5'; }, 50);
      setTimeout(function () { g.style.opacity = ''; }, 250);
      return;
    }
    g.classList.remove('is-on');
    void g.offsetWidth;
    g.classList.add('is-on');
  }
  function ripple(btn, x, y) {
    if (reduce) return;
    var clip = layer(btn, 'jz-ripple-clip');
    var r = btn.getBoundingClientRect();
    var px = (x == null ? r.left + r.width / 2 : x) - r.left;
    var py = (y == null ? r.top + r.height / 2 : y) - r.top;
    var R = Math.max(Math.hypot(px, py), Math.hypot(r.width - px, py), Math.hypot(px, r.height - py), Math.hypot(r.width - px, r.height - py));
    var dot = document.createElement('span');
    dot.className = 'jz-ripple';
    dot.style.left = (px - R) + 'px';
    dot.style.top = (py - R) + 'px';
    dot.style.width = dot.style.height = (2 * R) + 'px';
    clip.appendChild(dot);
    dot.addEventListener('animationend', function () { this.remove(); });
  }
  document.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    var btn = e.target.closest('.btn--primary');
    if (!btn || btn.disabled) return;
    flash(btn);
    ripple(btn, e.clientX, e.clientY);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var btn = e.target.closest && e.target.closest('.btn--primary');
    if (!btn || btn.disabled) return;
    flash(btn);
    ripple(btn);
  });

  /* ---------- 3. Escalating progress on form steps. ---------- */
  function stepDone(input) {
    var v = (input.value || '').trim();
    if (!v) return false;
    if (input.type === 'email') return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(v);
    if (input.type === 'url') return /^(https?:\/\/)?[^\s.\/]+\.[^\s]{2,}$/i.test(v);
    return true;
  }
  document.querySelectorAll('[data-jz-steps]').forEach(function (list) {
    var items = [].slice.call(list.querySelectorAll('[data-jz-step]'));
    function refresh() {
      items.forEach(function (li) {
        var input = document.getElementById(li.getAttribute('data-jz-step'));
        if (!input) return;
        var done = stepDone(input);
        var was = li.classList.contains('is-done');
        if (done && !was) {
          li.classList.add('is-done');
          var count = items.filter(function (x) { return x.classList.contains('is-done'); }).length;
          /* each successive step pops a little stronger: 1.2, 1.26, 1.32 */
          li.style.setProperty('--jz-peak', String(1.2 + 0.06 * (count - 1)));
          if (!reduce) {
            li.classList.remove('jz-pop');
            void li.offsetWidth;
            li.classList.add('jz-pop');
          }
          play('tap');
        } else if (!done && was) {
          li.classList.remove('is-done', 'jz-pop');
        }
      });
    }
    var form = list.closest('form') || document;
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    refresh();
  });

  /* ---------- 4. Persistent done stamp after success. ---------- */
  function lockWithStamp(form) {
    if (!form || form.classList.contains('jz-locked')) return;
    form.classList.add('jz-locked');
    form.querySelectorAll('input, textarea, select').forEach(function (f) {
      if (f.closest('.ia-hp')) return;
      f.readOnly = true;
      f.setAttribute('aria-readonly', 'true');
    });
    var submit = form.querySelector('button[type="submit"]');
    if (submit) { submit.disabled = true; submit.setAttribute('aria-disabled', 'true'); }
    var host = form.closest('.ia-sponsor__form') || form;
    var stamp = document.createElement('span');
    stamp.className = 'jz-stamp';
    stamp.setAttribute('data-jz-stamp', '');
    stamp.innerHTML = '<span class="jz-stamp__text"></span><span class="jz-stamp__ring" aria-hidden="true"></span>';
    stamp.querySelector('.jz-stamp__text').textContent = DONE_LABEL[lang()];
    host.appendChild(stamp);
  }

  /* ---------- 5. Moki looks at the focused field (focus only, max 5px). ---------- */
  var FIELD = 'input:not([type="hidden"]):not([tabindex="-1"]), textarea, select';
  function mokiLook(field) {
    if (reduce) return;
    var fr = field ? field.getBoundingClientRect() : null;
    document.querySelectorAll('.ia-moki-live').forEach(function (m) {
      if (!fr) { m.style.transform = ''; return; }
      var mr = m.getBoundingClientRect();
      if (!mr.width || mr.bottom < 0 || mr.top > innerHeight) { m.style.transform = ''; return; }
      var vx = (fr.left + fr.width / 2) - (mr.left + mr.width / 2);
      var vy = (fr.top + fr.height / 2) - (mr.top + mr.height / 2);
      var len = Math.hypot(vx, vy);
      if (len < 1) { m.style.transform = ''; return; }
      m.style.transform = 'translate(' + (5 * vx / len).toFixed(2) + 'px, ' + (5 * vy / len).toFixed(2) + 'px)';
    });
  }
  document.addEventListener('focusin', function (e) {
    if (e.target.matches && e.target.matches(FIELD) && !e.target.closest('.ia-hp')) mokiLook(e.target);
  });
  document.addEventListener('focusout', function () {
    setTimeout(function () {
      var a = document.activeElement;
      if (!a || !a.matches || !a.matches(FIELD)) mokiLook(null);
    }, 0);
  });

  /* ---------- 6. Big celebration only for the payment moment (?gracias=1). ---------- */
  function celebrate(banner) {
    if (reduce || !banner) return;
    var r = banner.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var n = 36;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'jz-confetti';
      p.style.background = COLORS[i % 3];
      var x0 = r.left + 8 + (r.width - 16) * ((i + 0.5) / n);
      var y0 = r.bottom + 6;
      var dur = 800 + Math.round(Math.random() * 400);
      var T = dur / 1000;
      var vx = (Math.random() * 2 - 1) * 70;
      var vy = Math.random() * 120;
      var g = 700 + Math.random() * 300;
      if (x0 + vx * T < 4 || x0 + vx * T > vw - 12) vx = -vx;
      p.style.left = x0 + 'px';
      p.style.top = y0 + 'px';
      document.body.appendChild(p);
      var frames = [];
      for (var k = 0; k <= 10; k++) {
        var t = (k / 10) * T;
        var x = Math.max(4 - x0, Math.min(vw - 12 - x0, vx * t));
        var y = vy * t + 0.5 * g * t * t;
        frames.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)', opacity: k < 7 ? 1 : 1 - (k - 7) / 3 });
      }
      var a = p.animate(frames, { duration: dur, easing: 'linear', fill: 'forwards' });
      a.onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }
  var thanksBanner = document.querySelector('[data-thanks]');
  if (thanksBanner && !thanksBanner.hidden) {
    requestAnimationFrame(function () { celebrate(thanksBanner); });
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

    /* 1. Pay button: hold pressed 150ms, burst, then go to the exact Stripe URL.
       Reduced motion or modified clicks: normal navigation, no delay. */
    var pay = e.target.closest('[data-sponsor-cta]');
    if (pay && /^https:\/\/buy\.stripe\.com\//.test(pay.href || '')) {
      play('tap');
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || pay.target === '_blank') return;
      e.preventDefault();
      var url = pay.href;
      hold(pay);
      setTimeout(function () {
        release(pay);
        burstFrom(pay);
        location.assign(url);
      }, HOLD_MS);
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
      var btn = (d.form && d.form.querySelector('button[type="submit"]')) || d.el;
      hold(btn);
      setTimeout(function () {
        release(btn);
        play('success');
        burstFrom(btn);
        if (d.key === 'sp.ok') lockWithStamp(d.form);
      }, HOLD_MS);
      return;
    }
    if (!d.ok) {
      play('error');
      shake(d.form || (d.el && d.el.closest('form')));
    }
  });

  document.addEventListener('gamedev:lang', function () {
    paintToggle(document.querySelector('.juice-sfx'));
    document.querySelectorAll('[data-jz-stamp] .jz-stamp__text').forEach(function (t) { t.textContent = DONE_LABEL[lang()]; });
  });

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'juice-press') e.target.classList.remove('juice-press');
    if (e.animationName === 'juice-shake') e.target.classList.remove('juice-shake');
    if (e.animationName === 'jz-pop') e.target.closest('li') && e.target.closest('li').classList.remove('jz-pop');
    if (e.animationName === 'jz-flash') e.target.classList.remove('is-on');
  });

  paintToggle(document.querySelector('.juice-sfx'));
})();
