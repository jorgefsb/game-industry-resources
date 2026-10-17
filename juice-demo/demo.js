(function () {
  'use strict';
  var burger = document.querySelector('.hud__burger');
  var nav = document.getElementById('hud-nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  function lang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') return q;
    return localStorage.getItem('gamedev_lang') || document.documentElement.lang || 'es';
  }
  function applyLang(l) {
    document.documentElement.lang = l;
    try { localStorage.setItem('gamedev_lang', l); } catch (e) {}
    document.querySelectorAll('[data-es][data-en]').forEach(function (el) {
      var text = el.getAttribute('data-' + l);
      if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
      if (!el.firstElementChild) el.innerHTML = text;
    });
    document.querySelectorAll('.lang-btn').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-lang') === l);
    });
    document.dispatchEvent(new CustomEvent('gamedev:lang', { detail: l }));
    now();
  }
  applyLang(lang());
  document.querySelectorAll('.lang-btn').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      applyLang(a.getAttribute('data-lang'));
      history.replaceState(null, '', '?lang=' + a.getAttribute('data-lang'));
    });
  });

  function now() {
    var el = document.querySelector('[data-jz-now]');
    if (!el || !window.JZ) return;
    var es = document.documentElement.lang !== 'en';
    var lab = document.querySelector('[data-jz-lab="' + JZ.level + '"]');
    el.textContent = (es ? 'Nivel actual: ' : 'Current level: ') + (lab ? lab.textContent : JZ.level);
  }
  document.querySelectorAll('[data-set-level]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.JZ) JZ.setLevel(btn.getAttribute('data-set-level'));
      now();
    });
  });

  document.querySelector('[data-vanilla]').addEventListener('click', function () {
    var s = document.querySelector('[data-vanilla-status]');
    s.textContent = document.documentElement.lang === 'en' ? 'Sent. No juice.' : 'Enviado. Sin juice.';
  });

  document.querySelector('[data-stagger-demo]').addEventListener('click', function () {
    var list = document.querySelector('[data-jz-stagger-demo]');
    if (!list || !window.JZ) return;
    list.removeAttribute('data-jz-did');
    [].slice.call(list.children).forEach(function (li) {
      li.style.opacity = '';
      li.style.transform = '';
      li.style.transition = '';
    });
    JZ.stagger(list, 'menu');
  });

  function paintCfg() {
    var off = [];
    var cfg = {};
    document.querySelectorAll('[data-cfg]').forEach(function (box) {
      var n = box.getAttribute('data-cfg');
      if (!box.checked) { off.push(n); cfg[n] = false; }
    });
    document.documentElement.setAttribute('data-jz-off', off.join(' '));
    window.JZ_CONFIG = cfg;
    document.querySelector('[data-cfg-out]').textContent =
      'data-jz-off="' + off.join(' ') + '"\nJZ_CONFIG = ' + JSON.stringify(cfg);
  }
  document.querySelectorAll('[data-cfg]').forEach(function (box) {
    box.addEventListener('change', paintCfg);
  });
  paintCfg();
  setTimeout(now, 0);
  new MutationObserver(now).observe(document.documentElement, { attributes: true, attributeFilter: ['data-jz-level', 'lang'] });
})();
