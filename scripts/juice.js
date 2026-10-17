/* Juice v0 · Ratchet spec. Web Audio only. Sounds: tap, success, error. */
(function () {
  'use strict';

  var KEY = 'gamedev_sfx';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var saved = localStorage.getItem(KEY);
  var enabled = saved === 'on' || (saved !== 'off' && !reduce);
  var ctx = null;
  var master = null;
  var COLORS = ['#FF6B35', '#FFA500', '#F4E8D5'];
  var SFX_LABEL = {
    es: { on: 'Silenciar', off: 'Activar sonido' },
    en: { on: 'Mute sound', off: 'Turn sound on' }
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
    btn.textContent = enabled ? '🔊' : '🔇';
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

  function burst(x, y) {
    if (reduce) return;
    var n = 12;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      var ang = (Math.PI * 2 * i) / n;
      var dist = 24 + (i % 3) * 10;
      p.className = 'juice-dot';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = COLORS[i % 3];
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      document.body.appendChild(p);
      p.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function burstFrom(el) {
    if (!el || reduce) return;
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top - 4);
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

  function hop(live) {
    if (reduce || !live) return;
    live.classList.remove('juice-hop');
    void live.offsetWidth;
    live.classList.add('juice-hop');
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
      hop(live);
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

  if (!reduce && fineHover) {
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var card = e.target.closest('.ia-card, .home-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      var ry = Math.max(-6, Math.min(6, px * 12));
      var rx = Math.max(-6, Math.min(6, -py * 12));
      card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });
    document.addEventListener('pointerout', function (e) {
      var card = e.target.closest('.ia-card, .home-card');
      if (!card) return;
      if (e.relatedTarget && card.contains(e.relatedTarget)) return;
      card.style.transform = '';
    }, true);
  }

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
    if (e.animationName === 'juice-hop') {
      var live = e.target.closest && e.target.closest('.ia-moki-live');
      if (live) live.classList.remove('juice-hop');
    }
  });

  paintToggle(document.querySelector('.juice-sfx'));
})();
