/* Fondos, convocatorias y eventos: cuenta de días y filtros. Sin dependencias. */
(function () {
  var DIA = 86400000;
  function en() { return document.documentElement.lang === 'en'; }
  function hoy() { var d = new Date(); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dias(iso) { var p = iso.split('-'); return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - hoy()) / DIA); }
  function texto(n) {
    if (n < 0) return ['ya cerró', 'closed'];
    if (n === 0) return ['cierra hoy', 'closes today'];
    if (n === 1) return ['cierra mañana', 'closes tomorrow'];
    return ['cierra en ' + n + ' días', 'closes in ' + n + ' days'];
  }
  function cuenta() {
    document.querySelectorAll('[data-cv-left]').forEach(function (el) {
      var n = dias(el.getAttribute('data-cv-left')), t = texto(n);
      el.setAttribute('data-es', t[0]); el.setAttribute('data-en', t[1]);
      el.textContent = en() ? t[1] : t[0];
      el.classList.toggle('is-urgent', n >= 0 && n <= 7);
      el.classList.toggle('is-past', n < 0);
    });
    document.querySelectorAll('[data-cv-soon] li[data-cierra]').forEach(function (li) {
      var n = dias(li.getAttribute('data-cierra')); li.hidden = n < 0 || n > 30;
    });
    document.querySelectorAll('.cv-card[data-cierra]').forEach(function (c) {
      if (dias(c.getAttribute('data-cierra')) < 0) c.classList.add('is-closed');
    });
  }
  var f = { tipo: '', pais: '' };
  function filtra() {
    var vistas = 0;
    document.querySelectorAll('[data-cv-group]').forEach(function (g) {
      var n = 0;
      g.querySelectorAll('.cv-card').forEach(function (c) {
        var p = c.getAttribute('data-paises').split(' ');
        var ok = (!f.tipo || c.getAttribute('data-tipo') === f.tipo) && (!f.pais || p.indexOf(f.pais) > -1 || p.indexOf('LATAM') > -1);
        c.hidden = !ok; if (ok) n++;
      });
      g.hidden = n === 0; vistas += n;
    });
    var v = document.querySelector('[data-cv-empty]'); if (v) v.hidden = vistas > 0;
  }
  document.querySelectorAll('[data-cv-filter]').forEach(function (grupo) {
    var k = grupo.getAttribute('data-cv-filter');
    grupo.addEventListener('click', function (ev) {
      var b = ev.target.closest('.cv-chip'); if (!b) return;
      f[k] = b.getAttribute('data-v');
      grupo.querySelectorAll('.cv-chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      filtra();
    });
  });
  cuenta();
  new MutationObserver(cuenta).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
