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
})();
