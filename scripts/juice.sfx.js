/* Site paint for .juice-sfx: SVG speaker, not the clipped 🔇 slash.
   Opt-out: juice 1.0.x already starts muted. 1.2.0 pages must not set data-jz-sound=on.
   No AudioContext here. Juice opens it only after a gesture and only if sound is on. */
(function (d, w) {
  'use strict';
  var ICO_ON = '<svg class="juice-sfx__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l6 5V5L7 10H3z"/><path d="M16 9.5a3.2 3.2 0 0 1 0 5"/><path d="M18.2 7a6 6 0 0 1 0 10"/></svg>';
  var ICO_OFF = '<svg class="juice-sfx__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l6 5V5L7 10H3z"/><path d="M4 4l16 16"/></svg>';
  var busy = false;

  function painted(b) {
    return !!(b && b.querySelector(':scope > .juice-sfx__ico'));
  }

  function lab(on) {
    var en = d.documentElement.lang === 'en';
    if (typeof w.t === 'function') return w.t(on ? 'ui.sfx.on' : 'ui.sfx.off');
    return on ? (en ? 'Mute sound' : 'Silenciar') : (en ? 'Turn sound on' : 'Activar sonido');
  }

  function paint(b) {
    if (!b || !b.classList.contains('juice-sfx')) return;
    var on = b.getAttribute('aria-pressed') === 'true';
    var text = lab(on);
    b.setAttribute('aria-label', text);
    b.innerHTML = (on ? ICO_ON : ICO_OFF) + '<span class="juice-sfx__label">' + text + '</span>';
  }

  function all() {
    [].slice.call(d.querySelectorAll('.juice-sfx')).forEach(paint);
  }

  var mo = new MutationObserver(function (muts) {
    if (busy) return;
    var need = false;
    muts.forEach(function (m) {
      if (m.type === 'attributes' && m.attributeName === 'aria-pressed') need = true;
      if (m.type === 'childList' && m.target.classList && m.target.classList.contains('juice-sfx') && !painted(m.target)) need = true;
    });
    if (!need) return;
    busy = true;
    all();
    busy = false;
  });

  function watch() {
    [].slice.call(d.querySelectorAll('.juice-sfx')).forEach(function (b) {
      mo.observe(b, { attributes: true, attributeFilter: ['aria-pressed'], childList: true });
    });
  }

  function boot() {
    all();
    watch();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  w.addEventListener('load', boot);
  d.addEventListener('gamedev:lang', function () { setTimeout(all, 0); });
})(document, window);
