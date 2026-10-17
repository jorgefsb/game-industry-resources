(function () {
  'use strict';

  const burger = document.querySelector('.hud__burger');
  const nav = document.getElementById('hud-nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  document.querySelectorAll('.ia-moki-live').forEach(function (el) {
    el.addEventListener('click', function () {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.JZ && window.JZ.level === 'off') return;
      el.classList.remove('is-hop');
      void el.offsetWidth;
      el.classList.add('is-hop');
    });
    el.addEventListener('animationend', function (e) {
      if (e.animationName === 'ia-moki-hop') el.classList.remove('is-hop');
    });
  });
})();
