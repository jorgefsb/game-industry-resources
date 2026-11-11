/* Menú por intención (10-nov-2026). Abre y cierra los grupos del HUD. Sin dependencias. */
(function () {
  'use strict';
  var groups = Array.prototype.slice.call(document.querySelectorAll('.nav-group'));
  if (!groups.length) return;
  var desktop = window.matchMedia('(min-width: 981px)');

  function close(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      g.classList.remove('is-open');
      var b = g.querySelector('.nav-group__btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  groups.forEach(function (g) {
    var btn = g.querySelector('.nav-group__btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      if (!desktop.matches) return;
      e.stopPropagation();
      var open = !g.classList.contains('is-open');
      close(g);
      g.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); btn.focus(); }
    });
    if (g.querySelector('a[aria-current="page"]')) g.classList.add('is-current');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-group')) close();
  });
  document.addEventListener('focusin', function (e) {
    if (desktop.matches && !e.target.closest('.nav-group')) close();
  });
})();
