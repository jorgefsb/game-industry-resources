/* Kit «Paga con un post». Compartes y se abre. No se verifica el post ni se guarda nada fuera de tu navegador. */
(function () {
  'use strict';
  var root = document.querySelector('[data-kit]');
  if (!root) return;
  var KEY = 'gd_kit_abierto';
  var URL_KIT = 'https://gamedev.jorgesuarez.com.mx/kit';
  var status = document.querySelector('[data-kit-status]');
  var pending = false;

  function en() { return document.documentElement.lang === 'en'; }
  function say(es, enText) { if (status) status.textContent = en() ? enText : es; }
  function text() {
    return en()
      ? 'Free kit to make video games in LATAM: one-page GDD, store page checklist and a 10-slide pitch. Via @jorgefsb'
      : 'Kit gratis para hacer videojuegos en LATAM: GDD de una página, checklist de tu página de tienda y pitch en 10 láminas. Vía @jorgefsb';
  }
  function hrefFor(kind) {
    var u = encodeURIComponent(URL_KIT), t = encodeURIComponent(text());
    if (kind === 'x') return 'https://x.com/intent/post?text=' + t + '&url=' + u;
    if (kind === 'linkedin') return 'https://www.linkedin.com/sharing/share-offsite/?url=' + u;
    if (kind === 'whatsapp') return 'https://wa.me/?text=' + t + '%20' + u;
    if (kind === 'facebook') return 'https://www.facebook.com/sharer/sharer.php?u=' + u;
    return URL_KIT;
  }
  function setLinks() {
    document.querySelectorAll('a[data-share]').forEach(function (a) {
      a.href = hrefFor(a.getAttribute('data-share'));
    });
  }
  function unlock(announce) {
    root.classList.add('is-unlocked');
    document.querySelectorAll('[data-locked]').forEach(function (el) { el.hidden = false; });
    document.querySelectorAll('[data-lock-badge]').forEach(function (b) {
      b.setAttribute('data-es', 'Abierto'); b.setAttribute('data-en', 'Unlocked');
      b.textContent = en() ? 'Unlocked' : 'Abierto';
    });
    try { localStorage.setItem(KEY, new Date().toISOString().slice(0, 10)); } catch (_) {}
    if (announce) {
      say('Gracias por compartirlo. Ya está abierto en este navegador.', 'Thanks for sharing. It is now unlocked in this browser.');
      var first = document.getElementById('tienda');
      if (first && first.scrollIntoView) {
        var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        first.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }

  var already = null;
  try { already = localStorage.getItem(KEY); } catch (_) {}
  setLinks();
  document.addEventListener('gamedev:lang', setLinks);
  if (already) unlock(false);

  document.querySelectorAll('[data-share]').forEach(function (el) {
    el.addEventListener('click', function () {
      var kind = el.getAttribute('data-share');
      if (kind === 'copy') {
        var done = function () { say('Liga copiada. Pégala donde quieras y vuelve.', 'Link copied. Paste it wherever you like and come back.'); unlock(true); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text() + ' ' + URL_KIT).then(done, done);
        else done();
        return;
      }
      pending = true;
      say('Cuando termines de publicar, vuelve a esta pestaña.', 'When you finish posting, come back to this tab.');
    });
  });
  function back() { if (pending && !document.hidden) { pending = false; unlock(true); } }
  window.addEventListener('focus', back);
  document.addEventListener('visibilitychange', back);

  var manual = document.querySelector('[data-unlock-manual]');
  if (manual) manual.addEventListener('click', function () { unlock(true); });

  // Copiar e imprimir
  function sheetText(node) {
    var out = [];
    node.querySelectorAll('h3, li, p').forEach(function (el) {
      if (el.closest('li') && el.tagName !== 'LI') return;
      var t = el.textContent.replace(/\s+/g, ' ').trim();
      if (!t) return;
      if (el.tagName === 'H3') out.push('\n## ' + t);
      else if (el.tagName === 'LI') out.push((el.querySelector('input') ? '[ ] ' : '- ') + t);
      else out.push(t);
    });
    return out.join('\n').trim() + '\n\n' + URL_KIT;
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = document.querySelector('[data-copy-source="' + btn.getAttribute('data-copy') + '"]');
      if (!src) return;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = en() ? 'Copied' : 'Copiado';
        setTimeout(function () { btn.textContent = btn.getAttribute(en() ? 'data-en' : 'data-es') || old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(sheetText(src)).then(done, done);
      else done();
    });
  });
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });
})();
